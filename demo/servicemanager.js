var serviceManager = {};

serviceManager.index = {
	cache: {
		expiresIn: 0
	},
	cors: true,
	handler: {
		file: {
			path: process.cwd() + '/index.html'
		}
	}
};

serviceManager.less = {
	cache: {
		expiresIn: 0
	},
	cors: true,
	handler: {
		directory: {
			// we will be passing the javascript and the CSS ..
			path: process.cwd() + '/less/'
		}
	}
};

serviceManager.images = {
	cache: {
		expiresIn: 0
	},
	cors: true,
	handler: {
		directory: {
			// we will be passing the javascript and the CSS ..
			path: process.cwd() + '/images/'
		}
	}
};

serviceManager.css = {
	cache: {
		expiresIn: 0
	},
	cors: true,
	handler: {
		directory: {
			// we will be passing the javascript and the CSS ..
			path: process.cwd() + '/css/'
		}
	}
};

serviceManager.js = {
	cache: {
		expiresIn: 0
	},
	cors: true,
	handler: {
		directory: {
			// we will be passing the javascript and the CSS ..
			path: process.cwd() + '/js/'
		}
	}
};

serviceManager.fonts = {
	cache: {
		expiresIn: 0
	},
	cors: true,
	handler: {
		directory: {
			// we will be passing the javascript and the CSS ..
			path: process.cwd() + '/fonts/'
		}
	}
};

serviceManager.components = {
	cache: {
		expiresIn: 0
	},
	cors: true,
	handler: {
		directory: {
			// we will be passing the javascript and the CSS ..
			path: process.cwd() + '/components/'
		}
	}
};

serviceManager.react = {
	cache: {
		expiresIn: 0
	},
	cors: true,
	handler: {
		directory: {
			// we will be passing the javascript and the CSS ..
			path: process.cwd() + '/react/'
		}
	}
};

serviceManager.authenticate = {
	cache: {
		expiresIn: 0
	},
	cors: true,
	handler: function(request, reply) {
		console.log("***USER **** " + request.payload.username);
		console.log("***PASSWORD **** " + request.payload.password);
		//reply.header('token', 'pass').hold();
		//reply.redirect("http://localhost:9090/dashboard");
	}
};

serviceManager.echopost = {
	cache: {
		expiresIn: 0
	},
	cors: true,
	handler: function(request, reply) {

		console.log("[ Inside the ECHO - POST handler ] " + request.payload.name);
		reply(request.payload);
	}
}

module.exports = [{
	path: '/r2d2/',
	method: 'GET',
	config: serviceManager.index
}, {
	path: '/r2d2/authenticate',
	method: 'POST',
	config: serviceManager.authenticate
}, {
	path: '/r2d2/images/{file*}',
	method: 'GET',
	config: serviceManager.images
}, {
	path: '/r2d2/fonts/{file*}',
	method: 'GET',
	config: serviceManager.fonts
}, {
	path: '/r2d2/less/{file*}',
	method: 'GET',
	config: serviceManager.less
}, {
	path: '/r2d2/js/{file*}',
	method: 'GET',
	config: serviceManager.js
}, {
	path: '/r2d2/css/{file*}',
	method: 'GET',
	config: serviceManager.css
}, {
	path: '/r2d2/components/{file*}',
	method: 'GET',
	config: serviceManager.components
}, {
	path: '/r2d2/react/{file*}',
	method: 'GET',
	config: serviceManager.react
}, {
	path: '/r2d2/echopost',
	method: 'POST',
	config: serviceManager.echopost
}, ];