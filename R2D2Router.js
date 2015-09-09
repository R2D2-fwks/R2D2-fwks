

var LoginComponent = React.createClass({
   displayName: 'LoginComponent',
   handleSubmit: function( event ){
     var username = this.refs.username.getDOMNode().value;
     var password = this.refs.password.getDOMNode().value;
      // $.post("http://localhost:9090/myapp/authenticate",
      //   {
      //           username: username,
      //           password: password
      //   },
      //   function(data, textStatus)
      //   {
      //       //window.location.replace("http://localhost:9090/dashboard");
      //       $(location).attr('href',"http://localhost:9090/dashboard");
      //   });
     if( username ==password){
          var currentURL = window.location.hash;
          window.location.hash = "!";
          if(currentURL.split("#").length >1 ){
              window.location.hash = currentURL;
          }else{
           window.location.hash = "#home"
          }
          
     }else{
          console.log( " Username is NOT equal to password so login the user ");
          window.location.hash = "#login"
     }    
  },
  render: function() {
    return (
      <div className="LoginComponent">
           <div>
              <input  ref="username" type="text" placeholder="Username" />
              <input  ref="password" type="password" placeholder="Password" />
              <button  onClick={this.handleSubmit}>Login</button>

           </div>
      </div>
    );
  }
});


var LoginModule = React.createClass({
  displayName: 'LoginModule',
  render: function() {
        return (
            <div className="LoginModule" id="LoginModule">
                <div className="pen-title">
                   <h1>peppermint with react.js</h1>
                </div>
                <div className="module form-module">
                    <div className="toggle"><i className="fa fa-times fa-pencil"></i>
                        <div className="tooltip">Click Me</div>
                    </div>
                    <div className="form">
                        <h2>Login to your account</h2>
                        <LoginComponent /> 
                    </div>
                    <div className="form">
                         <h2>Create an account</h2>
                         <form>
                              <input type="text" placeholder="Username" />
                              <input type="password" placeholder="Password"/>
                              <input type="email" placeholder="Email Address"/>
                              <input type="tel" placeholder="Phone Number"/>
                              <button>Register</button>
                         </form>
                    </div>
                    <div className="cta">
                        <form>
                              <input type="text" placeholder="email"/>
                              <button>email my password</button>
                         </form>
                    </div>
                </div> 
            </div>
        );
    }
});


var NotFound = React.createClass({
  displayName: 'NotFound',
  render: function() {
    return (
      <div className="NotFound">
            <h1> The Component is wrongly configured OR not available </h1>
            <h1> ERROR :~ 505 component not found !!  </h1>
      </div>
    );
  }
});

var Tab = React.createClass({
    displayName: 'Tab',  
    componentWillMount: function () {
    },
    render: function () {
          return ( < div className = "Tab" >  < /div>);
    }
});


var Router = React.createClass({
  displayName:'Router',
      // Lifecycle methods in React.js
  propTypes: {
        landing: React.PropTypes.string.isRequired,
        routeRepo:React.PropTypes.object.isRequired
  },    
  getInitialState: function () {
            return{
                  loadwidget: this.props.landing
            }
  },
  componentDidMount: function() {
          var IsRefresh = this.getF5Marker();      
          if (IsRefresh != null && IsRefresh != "") {
                this.setState({
                  loadwidget:window.location.hash 
                });
          }
          else {
                this.setState({
                        loadwidget:this.props.landing 
                });
                this.setF5Marker();
           }   
          
         //******************************************************
         // Listener for any change in the window location hash 
         // This is typically the change in the #{tabname} which
         // occurs when a user clicks on the URL.
         // ******************************************************
         $(window).on('hashchange', function() {
                this.setState({
                    loadwidget:window.location.hash    
                });  
         }.bind(this)); 
          
  }, 
 // Helper method to manage the state of the tab/window
  setF5Marker: function () {
         sessionStorage.refreshMarker = true;
  },
  getF5Marker: function () {
         return sessionStorage.refreshMarker;
  },      
     
  render: function() {
    var Component = NotFound;
    if( this.props.routeRepo.contains( this.state.loadwidget ) ) {
        Component = this.props.routeRepo.get( this.state.loadwidget ); 
    }
    
    return (
      <div className="Router">
          <Component />
      </div>
    );
  }
});



var Container = React.createClass({
     displayName: 'Container', 
     propTypes: {
        children: React.PropTypes.arrayOf( React.PropTypes.instanceOf(Tab)).isRequired,
        landing: React.PropTypes.string.isRequired
     },
    
     componentWillMount: function() {
          for(var index=0;index<this.props.children.length;index++){
                this.addTab(this.props.children[index].props.path,this.props.children[index].props.handler);
          } 
     },
     addTab: function (name, component) {
            console.log(" Adding the component .. ");
            this.repo.put(name, component);
     },
     getTab: function (name) {
             return this.repo.get(name);
     },  
     repo: new Map(),                          
     render: function () {
           return ( < div className = "Container" >
                   <Router  routeRepo={this.repo} landing={this.props.landing}/>
              < /div>
           );
     }
});
