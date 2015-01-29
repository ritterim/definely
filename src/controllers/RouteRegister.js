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
            .map(c =>
                 Object.keys(c)
                 .filter(key => (typeof c[key]) == 'function' && c[key].annotations.match(/get|post|put|patch|delete/i))
                 .map(key => ({c, key, func: c[key]})))
            .flatten()
            .map(({
                c, key, func
            }) => {
                this.controllers.push(c)
                var parms = {}
                parms.path = func.annotation.url
                parms.method = func.annotation.match(/get/i) ? 'GET' : func.annotation.match(/post/i) ? 'POST' : func.annotation.match(/put/i) ? 'PUT' : func.annotation.match(/patch/i) ? 'PATCH' : func.annotation.match(/delete/i) ? 'DELETE' : 'UNKNOWN'
                parms.handler = func
                if (func.annotation.name)
                    parms.name = func.annotation.name
                this.routes.push(parms)
                console.log(parms)
                return parms;
            })
            .each(this._register)
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
