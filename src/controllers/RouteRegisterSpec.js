import RouteRegister from './RouteRegister'
import chai from 'chai'
var should = chai.should()
import {Get, Post, Put, Patch, Delete} from '../attributes'


describe('RouteRegister:', () => {
    describe('hapi:', () => {
        function HapiServer() {
            this.routes = []
            this.route = function (route) {
                this.routes.push(route)
            }
        }

        it('registers method, path, handler, and optionally name from parms', () => {
            var server = new HapiServer()
            var register = RouteRegister.hapi(server)
            var parms = {
                method: 'method',
                path: 'path',
                handler: 'handler'
            }
            var parms2 = {
                method: 'method2',
                path: 'path2',
                handler: 'handler2',
                name: 'name2'
            }
            register._register(parms)
            register._register(parms2)
            server.routes[0].method.should.equal('method')
            server.routes[0].path.should.equal('path')
            server.routes[0].config.handler.should.equal('handler')
            server.routes[0].config.should.not.have.property('id')
            server.routes[1].method.should.equal('method2')
            server.routes[1].path.should.equal('path2')
            server.routes[1].config.handler.should.equal('handler2')
            server.routes[1].config.id.should.equal('name2')
        })
    })

    describe('register:', () => {
        function Registration() {
            this.routes = []
            this.handler = parms => this.routes.push(parms)
        }

        it('extracts http method from all methods decorated with Put, Get, Post, Patch, Delete attributes', () => {
            var registration = new Registration()
            var register = new RouteRegister(registration.handler)
            class Controller {
                @Get()
                getMethod() { }
                @Post()
                postMethod() { }
                @Put()
                putMethod() { }
                @Patch()
                patchMethod() { }
                @Delete()
                deleteMethod() { }
            }
            register.register(Controller)
            registration.routes.length.should.equal(5)
            registration.routes[0].method.should.equal('GET')
            registration.routes[1].method.should.equal('POST')
            registration.routes[2].method.should.equal('PUT')
            registration.routes[3].method.should.equal('PATCH')
            registration.routes[4].method.should.equal('DELETE')
        })

        it('extracts url from all methods decorated with Put, Get, Post, Patch, Delete attributes', () => {
            var registration = new Registration()
            var register = new RouteRegister(registration.handler)
            class Controller {
                @Get('getUrl')
                getMethod() { }
                @Post('postUrl')
                postMethod() { }
                @Put('putUrl')
                putMethod() { }
                @Patch('patchUrl')
                patchMethod() { }
                @Delete('deleteUrl')
                deleteMethod() { }
            }
            register.register(Controller)
            registration.routes.length.should.equal(5)
            registration.routes[0].path.should.equal('getUrl')
            registration.routes[1].path.should.equal('postUrl')
            registration.routes[2].path.should.equal('putUrl')
            registration.routes[3].path.should.equal('patchUrl')
            registration.routes[4].path.should.equal('deleteUrl')
        })

        it('urls are appended to any controller route prefixes', () => {
            var registration = new Registration()
            var register = new RouteRegister(registration.handler)
            @Get('baseUrl')
            class Controller {
                @Get('getUrl')
                getMethod() {
                }
                @Post('postUrl')
                postMethod() {
                }
                @Put('putUrl')
                putMethod() {
                }
                @Patch('patchUrl')
                patchMethod() {
                }
                @Delete('deleteUrl')
                deleteMethod() {
                }
            }
            register.register(Controller)
            registration.routes.length.should.equal(5)
            registration.routes[0].path.should.equal('baseUrl/getUrl')
            registration.routes[1].path.should.equal('baseUrl/postUrl')
            registration.routes[2].path.should.equal('baseUrl/putUrl')
            registration.routes[3].path.should.equal('baseUrl/patchUrl')
            registration.routes[4].path.should.equal('baseUrl/deleteUrl')
        })

        it('extracts method from all methods decorated with Put, Get, Post, Patch, Delete attributes', () => {
            var registration = new Registration()
            var register = new RouteRegister(registration.handler)
            class Controller {
                @Get()
                getMethod() {
                    return 'return get'
                }
                @Post()
                postMethod() {
                    return 'return post'
                }
                @Put()
                putMethod() {
                    return 'return put'
                }
                @Patch()
                patchMethod() {
                    return 'return patch'
                }
                @Delete()
                deleteMethod() {
                    return 'return delete'
                }
            }
            register.register(Controller)
            registration.routes.length.should.equal(5)
            registration.routes[0].handler().should.equal('return get')
            registration.routes[1].handler().should.equal('return post')
            registration.routes[2].handler().should.equal('return put')
            registration.routes[3].handler().should.equal('return patch')
            registration.routes[4].handler().should.equal('return delete')
        })

        it('extracts name from all methods decorated with Put, Get, Post, Patch, Delete attributes', () => {
            var registration = new Registration()
            var register = new RouteRegister(registration.handler)
            class Controller {
                @Get('getUrl', 'name1')
                getMethod() {
                }
                @Post('postUrl')
                postMethod() {
                }
                @Put('putUrl', 'name2')
                putMethod() {
                }
                @Patch('patchUrl')
                patchMethod() {
                }
                @Delete('deleteUrl', 'name3')
                deleteMethod() {
                }
            }
            register.register(Controller)
            registration.routes.length.should.equal(5)
            registration.routes[0].name.should.equal('name1')
            should.not.exist(registration.routes[1].name)
            registration.routes[2].name.should.equal('name2')
            should.not.exist(registration.routes[3].name)
            registration.routes[4].name.should.equal('name3')
        })
    })
})
