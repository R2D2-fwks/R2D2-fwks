var NotFound = React.createClass({
  render: function() {
    return (
      <div className="NotFound">
            <h1> The Component is wrongly configured OR not available </h1>
            <h1> Please click the back button to get back into the application </h1>
      </div>
    );
  }
});

var Tab = React.createClass({
      componentWillMount: function () {
           
      },
      render: function () {
            return ( < div className = "Tab" > {
                    this.props.handler
            } < /div>);
      }
});		

var Container = React.createClass({
     repo: new HashMap(),
     addTab: function (name, component) {
            console.log(" Adding the component .. ");
            this.repo.set(name, component);
     },
     getTab: function (name) {
             return this.repo.get(name);
     },
     // Helper method to manage the state of the tab/window
     setF5Marker: function () {
         sessionStorage.refreshMarker = true;
     },
     getF5Marker: function () {
         return sessionStorage.refreshMarker;
     },      
      // Lifecycle methods in React.js
     getInitialState: function () {
            return{
                  loadwidget: this.props.landing
            }
     },
     componentWillMount: function() {
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
          for(var index=0;index<this.props.children.length;index++){
                this.addTab(this.props.children[index].props.path,this.props.children[index].props.handler);
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
     render: function () {
           var Component = NotFound;
          
           for(var index=0;index<this.props.children.length;index++){
                 if(this.state.loadwidget == this.props.children[index].props.path){
                      Component = this.props.children[index].props.handler ;
                 }
           }
           return ( 
                   <Component />
              
           );
     }
});