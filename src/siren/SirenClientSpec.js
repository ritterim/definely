import SirenClient from './SirenClient'
import chai from 'chai'
var should = chai.should()

describe('SirenClient:', () => {
    describe('properties:', () => {
        it('contains all properties from siren json', () => {
            var json = JSON.stringify({
                properties: {
                    p1: 1,
                    p2: 'string'
                }
            })
            var siren = new SirenClient(json)
            siren.view.p1.should.equal(1)
            siren.view.p2.should.equal('string')
        })

        it('contains all properties from nested entities', () => {
            var json = JSON.stringify({
                entities: [{
                    class: ["p", "p1Type"],
                    href: 'url1',
                    properties: {
                        p1: 1,
                        p2: 'string'
                    }
                }]
            })
            var siren = new SirenClient(json)
            siren.view.p.p1.should.equal(1)
            siren.view.p.p2.should.equal('string')
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
            console.log(JSON.stringify(siren.view))
            siren.view.actions.postMethod.should.have.property('template')
            siren.view.actions.postMethod.template.p1.should.equal(1)
            siren.view.actions.postMethod.template.p2.should.equal("string")
            siren.view.actions.postMethod.template.should.have.property('p3')
            should.equal(siren.view.actions.postMethod.template.p3, null)
        })
    })
})