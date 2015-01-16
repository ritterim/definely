import chai from 'chai'
var should = chai.should()
import {
    Get, Post, Put, Patch, Delete
}
from './attributes'

import Siren from './Siren'

describe('siren:', () => {

    describe('class:', () => {
        it('should be an array', () => {
            function Entity() {}
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.class.should.be.an('array')
        })

        it('root should exactly be [entity type]', () => {
            function Entity() {}
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.class.should.deep.equal(['Entity'])
        })

        it('subentity (of complex type) should exactly be [parent\'s property name, subentity type]', function () {
            function Entity() {
                this.subEntity = new SubEntity()
            }

            function SubEntity() {}
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.class.should.deep.equal(['Entity'])
            siren.root.entities[0].class.should.deep.equal(['subEntity', 'SubEntity'])
        })

        it('subentity (of collection type) should exactly be [parent\'s property name, [collection type]]', function () {
            function Entity() {
                this.subEntities = [new SubEntity()]
            }

            function SubEntity() {}
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.class.should.deep.equal(['Entity'])
            siren.root.entities[0].class.should.deep.equal(['subEntities', '[SubEntity]'])
        })
    })

    describe('properties:', () => {
        it('may contain empty and nonempty string', () => {
            function Entity() {
                this.string1 = 'string1'
                this.string2 = ''
            }
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.properties.string1.should.equal('string1')
            siren.root.properties.string2.should.equal('')
        })

        it('may contain integers and reals', () => {
            function Entity() {
                this.num = 1
                this.real = 1.2
                this.num2 = -1
                this.real2 = -1.2
            }
            var entity = new Entity()
            var siren = new Siren(entity)
            Object.keys(siren.root.properties).length.should.equal(4)
            siren.root.properties.num.should.equal(1)
            siren.root.properties.real.should.equal(1.2)
            siren.root.properties.num2.should.equal(-1)
            siren.root.properties.real2.should.equal(-1.2)
        })

        it('contains only simple types and no complex types', () => {
            function Entity() {
                this.num = 1
                this.real = 1.2
                this.string = 'a'
                this.complex = new Complex()
                this.nil = null
            }

            function Complex() {}
            var entity = new Entity()
            var siren = new Siren(entity)
            Object.keys(siren.root.properties).length.should.equal(3)
            siren.root.properties.hasOwnProperty('complex').should.be.false
            siren.root.properties.hasOwnProperty('nil').should.be.false
            siren.root.properties.num.should.equal(1)
            siren.root.properties.real.should.equal(1.2)
            siren.root.properties.string.should.equal('a')
        })

        it('does not contain properties with null values', () => {
            function Entity() {
                this.nil = null
            }
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.properties.should.deep.equal({})
        })

        it('subentity properties contain only simple types and no complex types', () => {
            function Entity() {
                this.subEntity = new SubEntity()
            }

            function SubEntity() {
                this.num = 1
                this.real = 1.2
                this.string = 'a'
                this.complex = new Complex()
                this.nil = null
            }

            function Complex() {}
            var entity = new Entity()
            var siren = new Siren(entity)

            siren.root.properties.should.deep.equal({})
            Object.keys(siren.root.entities[0].properties).length.should.equal(3)
            siren.root.entities[0].properties.hasOwnProperty('complex').should.be.false
            siren.root.properties.hasOwnProperty('nil').should.be.false
            siren.root.entities[0].properties.num.should.equal(1)
            siren.root.entities[0].properties.real.should.equal(1.2)
            siren.root.entities[0].properties.string.should.equal('a')
        })
    })

    describe('entities:', () => {
        it('contains only complex types', () => {
            function Entity() {
                this.num = 1
                this.real = 1.2
                this.string = 'a'
                this.complex = new Complex(),
                this.complex2 = new Complex2(),
                this.complexArray = [1, 2, 3],
                this.complexArray2 = [new Complex(), new Complex2()]
            }

            function Complex() {}

            function Complex2() {}
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.entities.length.should.equal(4)
            siren.root.entities[0].class[0].should.equal('complex')
            siren.root.entities[1].class[0].should.equal('complex2')
            siren.root.entities[2].class[0].should.equal('complexArray')
            siren.root.entities[3].class[0].should.equal('complexArray2')
        })

        it('does not contain properties with null values', () => {
            function Entity() {
                this.nil = null
            }
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.entities.should.be.empty
        })
    })

    describe('rel:', () => {
        it('root rel equals [entityType]', () => {
            function Entity() {}
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.rel.should.deep.equal(['Entity'])
        })

        it('subentity rel equal [parentRel.entityType]', () => {
            function Entity() {
                this.subEntity = new SubEntity()
            }

            function SubEntity() {}
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.entities[0].rel.should.deep.equal(['Entity.SubEntity'])
        })

        it('subentity collection rel equal [parentRel.[entityType]]', () => {
            function Entity() {
                this.subEntity = [new SubEntity()]
            }

            function SubEntity() {}
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.entities[0].rel.should.deep.equal(['Entity.[SubEntity]'])
        })
    })

    describe('links:', () => {
        it('entity contains a self link', () => {
            function Entity() {}
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.links.length.should.equal(1)
            siren.root.links[0].rel.should.deep.equal(['self'])
        })

        it('subentity contains a self link', () => {
            function Entity() {
                this.subEntity = new SubEntity()
            }

            function SubEntity() {}
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.entities[0].links.length.should.equal(1)
            siren.root.entities[0].links[0].rel.should.deep.equal(['self'])
        })

        it('selfLink.href will match any route attributes decorating the entity', () => {
            @Get('url')
            class Entity {}
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.links[0].href.should.equal('url')

            @Get('url2')
            function Entity2() {}
            var entity2 = new Entity2()
            var siren2 = new Siren(entity2)
            siren2.root.links[0].href.should.equal('url2')
            
            class Entity3 { 
                get entity() {return new Entity()}
                get entity2() {return new Entity2()}
            }
            var entity3 = new Entity3()
            var siren3 = new Siren(entity3)
            siren3.root.entities[0].links[0].href.should.equal('url')
            siren3.root.entities[1].links[0].href.should.equal('url2')
        })
        
        it('selfLink.href will assume the default form parentSelfLink.href/parentProperty if no custom attributes decorate the entity', () =>{
            @Get('url')
            class Entity {
                get subEntity() {return new SubEntity()}
            }
           class SubEntity {}
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.entities[0].links[0].href.should.equal('url/subEntity')
            
            @Get('url2')
            function Entity2() {
                this.subEntity = new SubEntity2() 
            }
            function SubEntity2() {}
            var entity2 = new Entity2()
            var siren2 = new Siren(entity2)
            siren2.root.entities[0].links[0].href.should.equal('url2/subEntity')
        })
        
        it('selfLink.href will be the empty string if no custom attribute decorates entity and default form applies but parentSelfLink is also the empty string', () => {
           class Entity {}
           var entity = new Entity()
           var siren = new Siren(entity)
           siren.root.links[0].href.should.equal('')
           
           class Entity2 {
               get entity() { return new Entity() }
           }
           var entity2 = new Entity2()
           var siren2 = new Siren(entity2)
           siren2.root.entities[0].links[0].href.should.equal('')
        })

        it('subentity collection contains a self link in the form of simply href instead of {rel:[self],href:}', () => {
            @Get('url')
            function Entity() {
                this.subEntity = [new SubEntity()]
            }

            function SubEntity() {}
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.entities[0].hasOwnProperty('links').should.be.false
            siren.root.entities[0].hasOwnProperty('href').should.be.true
            siren.root.entities[0].href.should.equal('url/subEntity')
        })

        it('entity contains links for every method decorated with Get attribute', () => {
            class Entity {
                @Get('url')
                method() {}

                @Get('url2')
                method2() {}
            }
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.links[0].rel.should.deep.equal(['self'])
            siren.root.links[1].rel.should.deep.equal(['method'])
            siren.root.links[1].href.should.equal('url')
            siren.root.links[2].rel.should.deep.equal(['method2'])
            siren.root.links[2].href.should.equal('url2')
        })

        it('entity auto linking by decorated methods only works if entity is created using class syntax (limitation due to annotation support from traceur)', () => {
            function Entity() {
                this.method = function () {}
            }
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.links[0].rel.should.deep.equal(['self'])
            siren.root.links.length.should.equal(1)
        })
    })
    
    describe('actions:', () => {
        it('entity contains actions for every method decorated with Post, Put, Patch, or Delete attributes', () => {
            class Entity {
                @Post('post/url')
                method1() {}
                @Put('put/url')
                method2() {}
                @Patch('patch/url')
                method3() {}
                @Delete('delete/url')
                method4() {}
            }
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.actions.length.should.equal(4)
            siren.root.actions[0].name.should.equal('method1')
            siren.root.actions[0].title.should.equal('method1')
            siren.root.actions[0].href.should.equal('post/url')
            siren.root.actions[0].method.should.equal('POST')
            siren.root.actions[0].fields.should.be.empty
            siren.root.actions[1].name.should.equal('method2')
            siren.root.actions[1].title.should.equal('method2')
            siren.root.actions[1].href.should.equal('put/url')
            siren.root.actions[1].method.should.equal('PUT')
            siren.root.actions[1].fields.should.be.empty
            siren.root.actions[2].name.should.equal('method3')
            siren.root.actions[2].title.should.equal('method3')
            siren.root.actions[2].href.should.equal('patch/url')
            siren.root.actions[2].method.should.equal('PATCH')
            siren.root.actions[2].fields.should.be.empty
            siren.root.actions[3].name.should.equal('method4')
            siren.root.actions[3].title.should.equal('method4')
            siren.root.actions[3].href.should.equal('delete/url')
            siren.root.actions[3].method.should.equal('DELETE')
            siren.root.actions[3].fields.should.be.empty
        })
        
        it('entity contains action fields for every parameter of a decorated method', () => {
            class Entity {
                @Post('post/url')
                method(a,b,c,d) {}
            }
           var entity = new Entity()
           var siren = new Siren(entity)
           siren.root.actions.length.should.equal(1)
           var fields = siren.root.actions[0].fields 
           fields.length.should.equal(4)
           fields[0].name.should.equal('a')
           fields[1].name.should.equal('b')
           fields[2].name.should.equal('c')
           fields[3].name.should.equal('d')
        })
    })

})