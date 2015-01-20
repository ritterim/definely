import Lazy from 'lazy.js'
import _ from '../extensions'
import chai from 'chai'
var should = chai.should()

export
default

function SirenClient(sirenJson, loadCollections) {
    this.root = JSON.parse(sirenJson)
    this.loadCollections = loadCollections
    this.view = parse(this.root)

    function parse(root) {
        var view = {}
        addProperties(view, root)
        addLinks(view, root)
        addActions(view, root)
        addEntities(view, root)
        return view
    }

    function addProperties(view, object) {
        if (object.properties) {
            for (var prop in object.properties) {
                view[prop] = object.properties[prop]
            }
        }
    }

    function addEntities(view, object) {
        if (object.entities) {
            for (var entity of object.entities) {
                entity.class.should.not.be.empty
                var prop = entity.class[0]
                view.should.not.have.property(prop)
                view[prop] = parse(entity)
            }
        }
    }

    function addLinks(view, object) {
        view.links = {}
        if (object.links) {
            Lazy(object.links).each(link => view.links[link.rel[0]] = link.href)
        }
    }

    function addActions(view, object) {
        view.actions = {}
        if (object.actions) {
            Lazy(object.actions).each(action => {
                view.actions[action.name] = {
                    method: action.method,
                    href: action.href,
                    title: action.title,
                    template: Lazy(action.fields || []).reduce((template, field) => {
                        template[field.name] = field.value === undefined ? null : field.value
                        return template
                    }, {})
                }
            })
        }
    }
}