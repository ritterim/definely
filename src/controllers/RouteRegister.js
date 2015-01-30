import Lazy from 'lazy.js'
import _ from '../extensions'
import chai from 'chai'
var should = chai.should()

export
default class RouteRegister {
    constructor(register) {
        should.exist(register)
        this._register = register || function () {}
    }

    get controllers() {
        return this._controllers = this._controllers || []
    }

    get routes() {
        return this._routes = this._routes || []
    }

    register(...controllers) {
        Lazy(controllers)
            .map(c => new c())
            .map(c =>
                Object.keys(c)
                .concat(Object.keys(Object.getPrototypeOf(c)))
                .filter(key => (typeof c[key]) == 'function' && c[key].annotations && c[key].annotations.length > 0 && c[key].annotations[0].constructor.name.match(/get|post|put|patch|delete/i))
                .map(key => ({
                    c, key, func: c[key], anno: c[key].annotations[0]
                }))
            )
            .flatten()
            .map(({
                c, key, func, anno
            }) => {
                this.controllers.push(c)
                var parms = {}
                var cAnnos = c.constructor.annotations
                var baseUrl = cAnnos && cAnnos.length>0 && cAnnos[0].constructor.name.match(/get|post|put|patch|delete/i) ? (cAnnos[0].url||'') : ''
                parms.path = this.url(baseUrl,anno.url)
                var annoType = anno.constructor.name
                parms.method = annoType.match(/get/i) ? 'GET' : annoType.match(/post/i) ? 'POST' : annoType.match(/put/i) ? 'PUT' : annoType.match(/patch/i) ? 'PATCH' : annoType.match(/delete/i) ? 'DELETE' : 'UNKNOWN'
                parms.handler = func.bind(c)
                parms.name = anno.name
                this.routes.push(parms)
                return parms;
            })
            .each(this._register)
    }

    url(base, relative) {
        var url = ('/' + base + '/' + relative).normalize('/')
        if (url != '/')
            url = url.trimEnd('/')
        return url
    }

    static hapi(server) {
        return new RouteRegister(parms => {
            var route = {
                method: parms.method,
                path: parms.path,
                config: {
                    handler: parms.handler
                }
            }
            if (parms.name)
                route.config.id = parms.name
            server.route(route)
        })
    }
}
