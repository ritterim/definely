import chai from 'chai'
var should = chai.should()
import {Get, Post, Put, Patch, Delete} from './attributes'

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
                this.complexArray = [1,2,3],
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
        
        it('does not contain properties with null values',() => {
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
        
        it('subentity collection need not contain a self link', () => {
            function Entity() {
                this.subEntity = [new SubEntity()]
            }
            function SubEntity() {}
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.entities[0].hasOwnProperty('links').should.be.false
        })
        
        it('entity contains links for every method decorated with Get attribute', () => {
            class Entity {
                @Get('url')
                method(){}
                
                @Get('url2')
                method2(){}
            }
            var entity = new Entity()
            var siren = new Siren(entity)
            siren.root.links[0].rel.should.deep.equal(['self'])
            siren.root.links[1].rel.should.deep.equal(['method'])
            siren.root.links[1].href.should.equal('url')
            siren.root.links[2].rel.should.deep.equal(['method2'])
            siren.root.links[2].href.should.equal('url2')
        })
    
        it('entity auto linking by decorated methods only work if entity is created using class syntax (limitation due to annotation support from traceur)', () => {
            function Entity() {
                
                this.method = function() {}
            }
            var entity = new Entity()
            var siren = new Siren(entity)
            console.log(siren.root.links)
            siren.root.links[0].rel.should.deep.equal(['self'])
            siren.root.links.length.should.equal(1)
        })
    })
    
})