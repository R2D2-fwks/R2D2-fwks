var MenuBar = React.createClass({
    displayName:'MenuBar',
    render: function() {
        return (
            <div className="MenuBar">
                <div className="menu_simple">
                    <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#yoda">YODA</a></li>
                    <li><a href="#hansolo">Han Solo</a></li>
                    <li><a href="#c-3po">C-3PO</a></li>
                    <li><a href="#chewbacca">chewbacca</a></li>
                    </ul>
                    <br />
                </div>
            </div>
        );
    }
});


var Home = React.createClass({
    displayName:'Home',
    render: function() {
        return (
            <div className="Home">
                <MenuBar />
                <div>
                        Hello, Home <br/>
                        May the force be  you 
                </div>
            </div>

        );
    }
});

var Yoda = React.createClass({
    displayName:'Home',
    render: function() {
        return (
            <div className="Yoda">
                <MenuBar />
                <div>
                        Hello, Yoda <br/>
                        May the force be  you 
                </div>
            </div>

        );
    }
});

var HanSolo = React.createClass({
    displayName:'HanSolo',
    render: function() {
        return (
            <div className="HanSolo">
                <MenuBar />
                <div>
                        Hello, Han Solo <br/>
                        May the force be  you 
                </div>
            </div>

        );
    }
});

var C3po = React.createClass({
    displayName:'C3po',
    render: function() {
        return (
            <div className="C3po">
                <MenuBar />
                <div>
                        Hello, C-3PO <br/>
                        May the force be  you 
                </div>
            </div>

        );
    }
});

var Chewbacca = React.createClass({
    displayName:'Chewbacca',
    render: function() {
        return (
            <div className="Chewbacca">
                <MenuBar />
                <div>
                        Hello, Chewbacca <br/>
                        May the force be  you 
                </div>
            </div>

        );
    }
});









