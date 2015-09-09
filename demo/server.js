var Hapi = require('hapi');
var servicemanager = require('./servicemanager.js');
var server = new Hapi.Server();


/*  starting out the server  on a preconfigured host and port
 */
server.connection({
     host: '127.0.0.1',
     port: 9090
});

/*
    Adding routes information to server..P
 */
server.route(servicemanager);
server.start(
    function() {
         console.log(' ** Hapi is listening at port 9090 and the host address is http://localhost:9090/r2d2 ');
    }
);

