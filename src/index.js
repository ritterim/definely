import Hapi from 'hapi'
import Path from 'path'
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

server.start(() => {
	console.log('Server running at:', server.info.uri)
	outputRoutes()
})


function outputRoutes() {
	console.log('Available Routes:')
	Lazy(server.table()[0].table)
	.map(route => route.method + ' ' + route.path)
	.sort()
	.each(e=>console.log(e))
}
