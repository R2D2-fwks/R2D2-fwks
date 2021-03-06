/**
 * Resig's OO library for giving JS some JAVA flavour.
 * Afterll we come from java background.
 */

(function() {
	var initializing = false,
		fnTest = /xyz/.test(function() {
			xyz;
		}) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	this.Class = function() {};

	// Create a new Class that inherits from this Class
	Class.isExtendedBy = function(prop) {
		var _super = this.prototype;
		// Instantiate a base Class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" &&
				typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn) {
				return function() {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but on the super-Class
					this._super = _super[name];

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply(this, arguments);
					this._super = tmp;

					return ret;
				};
			})(name, prop[name]) :
				prop[name];
		}

		// The dummy Class constructor
		function Class() {
			// All construction is actually done in the init method
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}

		// Populate our constructed prototype Class
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this Class extendable
		Class.isExtendedBy = arguments.callee;

		return Class;
	};
})();

/**
 * [Controller: Controller is the base of all the handlers. 
 * We have to register the actions in controller and make them listen to a channel ]
 */
var Controller = Class.isExtendedBy({
	subscribers: {
		any: [] // event event: subscribers
	},
	bind: function(fn, event) {
		event = event || 'any';
		if (typeof this.subscribers[event] === "undefined") {
			this.subscribers[event] = [];
		}
		this.subscribers[event].push(fn);
		return this;
	},
	unbind: function(fn, event) {
		this.visitSubscribers('unsubscribe', fn, event);
		return this;
	},
	dispatch: function(publication, event) {
		this.visitSubscribers('publish', publication, event);
	},
	visitSubscribers: function(action, arg, event) {
		var pubtype = event || 'any',
			subscribers = this.subscribers[pubtype],
			i,
			max = subscribers.length;
		for (i = 0; i < max; i += 1) {
			if (action === 'publish') {
				subscribers[i](arg);
			} else {
				if (subscribers[i] === arg) {
					subscribers.splice(i, 1);
				}
			}
		}
	}
});

/**
 * ClassIntrospector: This is the class which will introspect a JS class for all the 
 *                    function it has exposed.
 *                     
 */
var ClassIntrospector = Class.isExtendedBy({
	introspect: function(Class) {
		var propList = [];
		for (var propName in Class) {
			if (typeof(Class[propName]) != "undefined" && typeof(Class[propName]) == "function" && (propName !== 'constructor')) {
				propList.push(propName);
			}
		}
		return propList;
	}
});

/**
 * Map: This is the utility class which gives map llike capability
 * in JS.
 */

var Map = Class.isExtendedBy({
	map: null,
	init: function() {
		this.map = {};
	},
	put: function(key, value) {
		this.map[key] = value;
		return this;
	},
	get: function(key) {
		if (this.map.hasOwnProperty(key)) {
			return this.map[key];
		}
	},
	contains: function(key) {
		return this.map.hasOwnProperty(key);
	},
	keys: function() {
		var keyList = [];
		for (var key in this.map) {
			keyList.push(key);
		}
		return keyList;
	},
	values: function() {
		var valueList = [];
		for (var key in this.map) {
			valueList.push(this.map[key]);
		}
		return valueList;
	},
	delete: function(key) {
		delete this.map[key];
	},
	size: function() {
		var _size = 0;
		for (var key in this.map) {
			_size = ++_size;
		}
		return _size;
	}
});


/**************************************** WORKFLOW ENGINE **********************************************/

/**
 * [init description]
 */
var FlowExecutionEngine = Class.isExtendedBy({
	init: function(mapping) {
		if (mapping instanceof Map) {
			this.map = mapping;

		} else {
			throw new Error(' mapping is not an instance of Map class !! ')
		}
		this.responseLog = [];
	},
	checkValidity: function() {
		var status = new StateValidator().check(this.map);
		if (status) {
			return this;
		} else {
			return status;
		}

	},
	addResponseLog: function(log) {
		this.responseLog.push(log);
	},
	getResponseLog: function() {
		return this.responseLog;
	},
	execute: function(state, args) {
		var init_action = this.map.get(state);
		var state = init_action.computeResponse(args);
		this.addResponseLog(state.getName() + "@" + state.getMsg());
		if (state.getName() === 'stop') {
			this.map.get('stop').computeResponse(args);
		} else if (state.getName() === 'error') {
			this.map.get('error').computeResponse(args);
		} else {
			this.execute(state.getName(), args);
		}
	}
});

var Argument = Map.isExtendedBy({
	init: function() {
		this._super();

	}
});

var State = Class.isExtendedBy({
	init: function(name, message) {
		this.name = name;
		this.message = message;
	},
	getName: function() {
		return this.name;
	},
	getMsg: function() {
		return this.message;
	},
	isEqual: function(name) {
		return this.name == name;
	}
});

var Action = Class.isExtendedBy({
	init: function() {
		this.possibleStates = new Array();
	},
	addState: function(state, message) {
		var state = new State(state, message == undefined ? '' : message);
		this.possibleStates.push(state);
		return this;
	},
	process: function(args) {
		return new Error('please implement the process its an abstract in Action Class ');
	},
	computeResponse: function(args) {
		var responseState = this.contains(this.possibleStates, this.process(args));

		return responseState;
	},
	contains: function(array, state) {
		var i = array.length;
		while (i--) {
			if (array[i].getName() === state) {
				return array[i];
			}
		}
		return new State('error', 'Ilegal State returned @ check the regsitered states or states returned by action classes ');
	},
	getAllStatesBoundToThisAction: function() {
		return this.possibleStates;
	}
});

/**
 *  State Validator: The primary function of this component is to validated the associated states with action
 *  object with the registered states in the mapping..
 */

var StateValidator = Class.isExtendedBy({
	check: function(mapping) {
		var allRegisteredStates = mapping.keys();
		var allActionAndAssociatedStates = mapping.values();
		for (var index = 0; index < allRegisteredStates.length; index++) {
			var registeredState = allRegisteredStates[index];
			var action = mapping.get(registeredState);
			var statesUnderAction = action.getAllStatesBoundToThisAction();
			for (var subindex = 0; subindex < statesUnderAction.length; subindex++) {
				var actionBoundState = statesUnderAction[subindex];
				if (!this.contains(allRegisteredStates, actionBoundState)) {
					return new Error(" The state [ " + actionBoundState.getName() + " ] is not registered look in entry no- " + (index + 1) + " .. ");
				}
			}

		}
		return true;
	},
	contains: function(array, state) {
		var i = array.length;
		while (i--) {
			if (array[i] === state.getName()) {
				return true;
			}
		}
		return false;
	},
});

var StartAction = Action.isExtendedBy({
	init: function() {
		this._super();
	},
	process: function(args) {
		console.log(" The program is in START - ACTION ");
		return "register";
	}
});

var StopAction = Action.isExtendedBy({
	init: function() {
		this._super();
	},
	process: function(args) {
		console.log(" The program is in STOP - ACTION ");
		return "stop";
	}
});








///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////


// var ReturnValue = Class.isExtendedBy({

// 	init: function() {
// 		this.result = null;
// 		this.values = null;
// 		this.reason = null;
// 	},
// 	setResult: function(result) {
// 		this.result = result;
// 		return this;
// 	},
// 	getResult: function() {
// 		return this.result;
// 	},
// 	setValue: function(values) {
// 		this.values = values;
// 		return this;
// 	},
// 	getValue: function() {
// 		return this.values;
// 	},
// 	setReason: function(reason) {
// 		this.reason = reason;
// 		return this;
// 	},
// 	getReason: function() {
// 		return this.reason;
// 	}

// });

// var Argument = Class.isExtendedBy({
//     map: {},
// 	init: function() {},
// 	put: function(key, value) {
//         this.map[key] = value;
//         return this;        
// 	},
// 	get: function(key) {
//         if(this.map.hasOwnProperty(key)){
//             return this.map[key];
//         }
// 	},
//     contains: function( key ){
//         return this.map.hasOwnProperty(key);
//     },
//     keys: function(){
//         var keyList = [];
//         for (var key in this.map) {
//            keyList.push( key );
//         }
//         return keyList;
//     },
//     values: function(){
//         var valueList = [];
//         for (var key in this.map) {
//            valueList.push( this.map[key] );
//         }
//         return valueList;
//     },
//     delete: function( key ){
//         delete this.map[key];
//     },
//     size: function(){
//         var _size = 0;
//         for (var key in this.map) {
//            _size=++_size;
//         }
//         return _size; 
//     }
// });

// /***************Condition ***************************************************************/
// var Condition = Class.isExtendedBy({
// 	init: function() {
// 		this.left = null;
// 		this.operator = null;
// 		this.right = null;
// 	},
// 	evaulate: function() {
// 		return new Error(" This is an abstract function please implement your own evaluate ");
// 	}
// });

// var NumberCondition = Condition.isExtendedBy({
// 	init: function(left, operator, right) {
// 		this.left = left;
// 		this.operator = operator;
// 		this.right = right;
// 	},
// 	evaluate: function() {
// 		if (this.operator === 'equal_to') {
// 			if (this.left === this.right) {
// 				return new ReturnValue().setResult(true);
// 			} else {
// 				return new ReturnValue().setResult(false).setReason("Left operand = " + this.left + " operator = " + this.operator + " Right operand = " + this.right);
// 			}
// 		} else if (this.operator === 'not_equal_to') {
// 			if (this.left != this.right) {
// 				return new ReturnValue().setResult(true);
// 			} else {
// 				return new ReturnValue().setResult(false).setReason("Left operand = " + this.left + " operator = " + this.operator + " Right operand = " + this.right);
// 			}
// 		} else {
// 			return new ReturnValue().setResult(false).setReason("Well this condition is not implemented in NumberCondition ");
// 		}
// 	}
// });

// /***************Action ***************************************************************/

// var Action = Class.isExtendedBy({
// 	init: function() {
// 		this.returnvalue = new ReturnValue();
// 	},
// 	pass: function(argument) {
// 		return new Error(" This is an abstract function please implement your own pass function ");
// 	},
// 	fail: function(argument) {
// 		return new Error(" This is an abstract function please implement your own fail function ");
// 	}
// });

// var NullAction = Action.isExtendedBy({
// 	init: function() {
// 		this.returnvalue = new ReturnValue();
// 		this.returnvalue.setResult(false).setValue(null);
// 		this.returnvalue.setResult(false).setReason("Please make sure your action extends Action Class");
// 	},
// 	pass: function(argument) {
// 		return this.returnvalue;
// 	},
// 	fail: function(argument) {
// 		return this.returnvalue;
// 	}
// });

// var DummyAction = Action.isExtendedBy({
// 	init: function() {
// 		this.returnvalue = new ReturnValue();
// 	},
// 	pass: function(argument) {
//         return new ReturnValue().setResult(true).setValue(" This is a dummy action ");
// 	},
// 	fail: function(argument) {
// 		return new ReturnValue().setResult(false).setReason(" This dummy action has failed ");
// 	}
// });

// /***************Rule   ***************************************************************/

// var Rule = Class.isExtendedBy({
// 	init: function(condition) {
// 		if (condition instanceof Condition) {
// 			this.condition = condition;
// 		} else {
// 			return new Error(" condition is not an instance of Condition class ");
// 		}
// 	},
// 	load: function(action) {
// 		if (action instanceof Action) {
// 			this.action = action;
// 			return this;
// 		} else {
// 			this.action = new NullAction();
// 			return this;
// 		}
// 	},
// 	execute: function(argument) {
// 		return new Error(" This is an abstract function please implement your own execute ");
// 	}
// });

// var OneRuleMultipleAction = Rule.isExtendedBy({
// 	actionlist: [],
// 	init: function(_condition) {
// 		this.condition = _condition;
// 	},
// 	load: function(action) {
// 		if (action instanceof Action) {
// 			this.actionlist.push(action);
// 			return this;
// 		} else {
// 			this._super(new NullAction());
// 			return this;
// 		}

// 	},
// 	execute: function(argument) {
//         returnvalueCollection = [];

// 		if (argument instanceof Argument) {
// 			var returnvalue = this.condition.evaluate();
// 			if (returnvalue.getResult()) {
// 				for (var index=0;index<this.actionlist.length;index++) {
//                     var _action = this.actionlist[index];
// 					returnvalueCollection.push(_action.pass(argument));
// 				}
// 			} else {
// 				for (var index=0;index<this.actionlist.length;index++) {
// 					var _action = this.actionlist[index];
//                     returnvalueCollection.push(_action.fail(argument));
// 				}
// 			}
//             return returnvalueCollection;
// 		} else {
// 			return new Error("CompositeRule: injected argument not instanceof [ Argument ] Class");
// 		}

// 	}
// });

// var BalanceLimit = Rule.isExtendedBy({
// 	init: function(condition) {
// 		this._super(condition);
// 	},
// 	load: function(action) {
// 		this._super(action);
// 		return this;
// 	},
// 	execute: function(argument) {
// 		if (argument instanceof Argument) {
// 			var returnvalue = this.condition.evaluate();
// 			if (returnvalue.getResult()) {
// 				return this.action.pass(argument);
// 			} else {
// 				return this.action.fail(returnvalue);
// 			}

// 		} else {
// 			return new Error("BalanceLimit: injected argument not instanceof [ Argument ] Class");
// 		}
// 	}
// });

// // var balancelimitcheck = new BalanceLimit( new NumberCondition(1,'not_equal_to',1)).load(new DummyAction());
// // console.log(balancelimitcheck.execute( new Argument() ));

// var compositeActionTester = new OneRuleMultipleAction(new NumberCondition(1, 'equal_to', 2)).load(new DummyAction()).load(new DummyAction()).load(new DummyAction()).load(new DummyAction());
// console.log(compositeActionTester.execute(new Argument()));

// var argument = new Argument();
// argument.put('name','vinoo');
// argument.put('email','vinoo.das@wipro.com');
// console.log(argument.get('name'));
// console.log(argument.contains('name'));
// console.log(argument.size());
// console.log(argument.keys());
// console.log(argument.values());
// argument.delete('name');
// console.log(argument.keys());
// console.log(argument.values());

// console.log(new ClassIntrospector().introspect( new Argument() ));

// Experiment of the day.. workflow 



/*******************************************Sample WorkFlow engine *************************************************/

var RegisterAction = Action.isExtendedBy({
	init: function() {
		this._super();
	},
	process: function(args) {
		console.log(" The program is in REGISTER - ACTION ");
		return "stop";
	}
});

//console.log(new StartAction().addState('stop', 'I am  done').addState('register', ' Registeration Done: But Who let the dogs out ').computeResponse());
//console.log(new StopAction().addState('stop', 'I am  done').addState('register', ' Registeration Done: But Who let the cats out ').computeResponse());

var mapping = new Map()
	.put('start', new StartAction().addState('stop', 'some thing').addState('error', 'could not authenticate').addState('registerx', ' Registration Done: But Who let the dogs out '))
	.put('stop', new StopAction().addState('stop'))
	.put('error', new StopAction().addState('stop'))
	.put('register', new RegisterAction().addState('error', 'user exists in the system').addState('stop', 'sucessful registration '));



// var stateValid = new StateValidator();
// console.log(stateValid.check(mapping));

// var ngine = new FlowExecutionEngine(mapping).checkValidity();
// var argument = new Argument();
// ngine.execute('start', argument);
// console.log(ngine.getResponseLog());







/*******************************************Login Handler*************************************************/
var LoginHandler = Controller.isExtendedBy({
	login: function(name, password) {
		log.info('LoginHandler.login()','Entering into LoginHandler');
		var loginMsg = {};
		if (name != password) {
			loginMsg['status']='FAIL';
			loginMsg['reason']='The user name is NOT equal to password';
			this.dispatch( loginMsg, "unsuccessfullogin");
		} else {
			loginMsg['status']='PASS';
			this.dispatch(loginMsg, "successfullogin");
		}
	},
	register: function() {
		this.publish("user data", "newuser");
	}
});






