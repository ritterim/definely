import Hapi from 'hapi'
import Path from 'path'
import registerControllers from './controllers/index'
import _ from './extensions'
import Lazy from 'lazy.js'
import Handlebars from 'handlebars'
import cp from 'child_process'
import Promise from 'bluebird'
import Config from '../config'



main()

function main() {

    migrate()
        .then(() => {
            Handlebars.registerHelper("currentYear", function () {
                return new Date().getFullYear()
            })

            spawnServer('App', 3000, registerControllers, {
                engines: {
                    hbs: Handlebars
                },
                path: Path.join(__dirname, './views'),
                partialsPath: Path.join(__dirname, './views/partials'),
                layoutPath: Path.join(__dirname, './views/layouts'),
                layout: 'layout'
            })
        })
        .error(message => console.log(message))
}

function migrate() {
    // use the global connection string if found, else use the local one.
    var connectionString = process.env.DATABASE_URL || Config.connectionString
    
    var cmd = Path.join(__dirname, '..', 'node_modules', '.bin', 'pg-migrate');
    console.log('Migrating db at: ' + connectionString
                
    return new Promise((resolve, reject) => {
        cp.spawn(cmd, ['up'], {
            env: {
                DATABASE_URL: connectionString
            }
        })
            .on('data', data => console.log(data.toString()))
            .on('exit', resolve)
            .on('error', reject)
    })
}

function spawnServer(name, port, registerControllers, viewOptions) {

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

    registerControllers(server)

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