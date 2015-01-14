import Hapi from 'hapi'
import controllers from './controllers/index'
import _ from './extensions'
import Lazy from 'lazy.js'

var server = new Hapi.Server()

server.connection({
	port: 3000
})

server.views({
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, './views')
});

controllers(server)

// Providing a VERY starter homepage.
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index');
    }
});


server.start(() => {
	console.log('Server running at:', server.info.uri)
	outputRoutes()
})


function outputRoutes() {
	console.log('Available Routes:')
	for (var route of server.table()[0].table)
		console.log(route.method + ' ' + route.path)
}
