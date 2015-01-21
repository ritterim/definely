import SirenClient from './SirenClient'
import chai from 'chai'
var should = chai.should()



describe('SirenClient:', () => {
    describe('array:', () => {
        it('handles arrays by mapping each element to a parsed element', () => {
            var json = JSON.stringify([
                {
                    properties: {
                        p1: 1
                    }
                },
                {
                    properties: {
                        p2: 'string'
                    }
                }
            ])
            var siren = new SirenClient(json)
            siren.view.should.be.an('array')
            siren.view.length.should.equal(2)
            siren.view[0].p1.should.equal(1)
            siren.view[1].p2.should.equal('string')
        })
    })
    describe('properties:', () => {
        it('contains all properties from siren json', () => {
            var json = JSON.stringify({
                properties: {
                    num: 1,
                    float: 1.2,
                    string: 'string',
                    simpleArray: ['a', 1, 1.2]
                }
            })
            var siren = new SirenClient(json)
            siren.view.num.should.equal(1)
            siren.view.float.should.equal(1.2)
            siren.view.string.should.equal('string')
            siren.view.simpleArray.should.deep.equal(['a', 1, 1.2])
        })

        it('contains all properties from nested entities', () => {
            var json = JSON.stringify({
                entities: [{
                    class: ["p", "pType"],
                    properties: {
                        num: 1,
                        float: 1.2,
                        string: 'string',
                        simpleArray: ['a', 1, 1.2]
                    }
                }]
            })
            var siren = new SirenClient(json)
            siren.view.p.num.should.equal(1)
            siren.view.p.float.should.equal(1.2)
            siren.view.p.string.should.equal('string')
            siren.view.p.simpleArray.should.deep.equal(['a', 1, 1.2])
        })
    })

    describe('entities:', () => {
        it('contains all sub entities from siren json', () => {
            var json = JSON.stringify({
                entities: [{
                        class: ["p1", "p1Type"],
                },
                    {
                        class: ["p2", "p2Type"],
                    }]
            })
            var siren = new SirenClient(json)
            siren.view.p1.should.be.an('object')
            siren.view.p2.should.be.an('object')
        })

        it('non embedded collection entities should be added to collections object', () => {
            var json = JSON.stringify({
                entities: [{
                        class: ["collection", "collectionType"],
                        href: 'collectionUrl'
                },
                    {
                        class: ["entity", "entityType"],
                    }]
            })
            var siren = new SirenClient(json)
            siren.view.collections.collection.should.equal('collectionUrl')
            siren.view.entity.should.be.an('object')
        })
    })

    describe('links:', () => {
        it('contains all links', () => {
            var json = JSON.stringify({
                links: [{
                    rel: ['self'],
                    href: 'selfUrl'
                }, {
                    rel: ['previous'],
                    href: 'previousUrl'
                }]
            })

            var siren = new SirenClient(json)
            siren.view.links.self.should.equal('selfUrl')
            siren.view.links.previous.should.equal('previousUrl')
        })
    })

    describe('actions:', () => {
        it('contains all actions', () => {
            var json = JSON.stringify({
                actions: [{
                        name: 'postMethod',
                        title: 'Post Method',
                        method: 'POST',
                        href: 'postMethodUrl'
                },
                    {
                        name: 'putMethod',
                        title: 'Put Method',
                        method: 'PUT',
                        href: 'putMethodUrl'
                },
                    {
                        name: 'deleteMethod',
                        title: 'Delete Method',
                        method: 'DELETE',
                        href: 'deleteMethodUrl'
                },
                    {
                        name: 'patchMethod',
                        title: 'Patch Method',
                        method: 'PATCH',
                        href: 'patchMethodUrl'
                }]
            })
            var siren = new SirenClient(json)
            siren.view.actions.postMethod.title.should.equal('Post Method')
            siren.view.actions.postMethod.method.should.equal('POST')
            siren.view.actions.postMethod.href.should.equal('postMethodUrl')
            siren.view.actions.putMethod.title.should.equal('Put Method')
            siren.view.actions.putMethod.method.should.equal('PUT')
            siren.view.actions.putMethod.href.should.equal('putMethodUrl')
            siren.view.actions.deleteMethod.title.should.equal('Delete Method')
            siren.view.actions.deleteMethod.method.should.equal('DELETE')
            siren.view.actions.deleteMethod.href.should.equal('deleteMethodUrl')
            siren.view.actions.patchMethod.title.should.equal('Patch Method')
            siren.view.actions.patchMethod.method.should.equal('PATCH')
            siren.view.actions.patchMethod.href.should.equal('patchMethodUrl')
        })

        it('template contains all fields in each action', () => {
            var json = JSON.stringify({
                actions: [{
                    name: 'postMethod',
                    fields: [{
                        name: 'p1',
                        value: 1
                        }, {
                        name: 'p2',
                        value: 'string'
                        }, {
                        name: 'p3'
                        }]
                }]
            })
            var siren = new SirenClient(json)
            siren.view.actions.postMethod.should.have.property('template')
            siren.view.actions.postMethod.template.p1.should.equal(1)
            siren.view.actions.postMethod.template.p2.should.equal("string")
            siren.view.actions.postMethod.template.should.have.property('p3')
            should.equal(siren.view.actions.postMethod.template.p3, null)
        })
    })
})