var Hapi = require('hapi');
var Path = require('path');
var server = new Hapi.Server();

// This should be set via config. at some point.
server.connection({ port: 3000 });

server.views({
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, './views')
});

// Providing a VERY starter homepage.
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index');
    }
});

server.start(function () {
    console.log('definely running at:', server.info.uri);
});

