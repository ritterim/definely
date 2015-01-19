import Hapi from 'hapi'
import Path from 'path'
import controllers from './controllers/index'
import _ from './extensions'
import Lazy from 'lazy.js'
import Handlebars from 'handlebars';

Handlebars.registerHelper("currentYear", function() {
    return new Date().getFullYear();
});

spawnServer('App', 3000, controllers, {
    engines: {
        hbs: Handlebars
    },
    path: Path.join(__dirname, './views'),
    partialsPath: Path.join(__dirname, './views/partials'),
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

    server.ext('onRequest', function (request, reply) {
        var methodOverride = request.query['hapi_method'];

        if (methodOverride) {
            request.setMethod(methodOverride);
        }

        return reply.continue();
    });

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
