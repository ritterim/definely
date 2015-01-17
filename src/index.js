import Hapi from 'hapi'
import Path from 'path'
import controllers from './controllers/index'
import _ from './extensions'
import Lazy from 'lazy.js'


spawnServer('App', 3000, controllers, {
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, './views'),
    layoutPath: Path.join(__dirname, './views/layouts'),
    layout: 'layout'
})

function spawnServer(name, port, controllers, viewOptions) {

    var server = new Hapi.Server()

    server.connection({
        port
    })

	if (viewOptions)
		server.views(viewOptions);

    controllers(server)

    server.start(() => {
        console.log(name + ' server running at:', server.info.uri)
        outputRoutes(server)
    })
}

function outputRoutes(server) {
    console.log('Available Routes:')
    Lazy(server.table()[0].table)
        .map(route => route.method + ' ' + route.path)
        .sort()
        .each(e => console.log(e))
}
