import Errors from '../Errors'
import Lazy from 'lazy.js'

export
default

function Siren(resource) {
    this.root = root(resource)
    this.json = JSON.stringify(this.root)

    function root(object) {
        if (isArray(object))
            return deepArray(object)
        else if (isObject(object))
            return entity(object)
        throw Errors.typeArg('object', 'array|object')
    }

    function entity(object, parentObject, parentProperty, parentRel) {
        if (object === null)
            throw Errors.nullArg('object')

        var relValue = rel(object, parentRel)
        return {
            class: cls(object, parentProperty),
            rel: relValue,
            properties: properties(object),
            entities: entities(object, relValue),
            links: links(object, parentObject, parentProperty),
            actions: actions(object)
        }
    }

    function entities(object, rel) {
        var entities = []
        for (var prop in object) {
            var value = object[prop]
            if (!isValue(value)) {
                if (isArray(value))
                    entities.push(shallowArray(value, object, prop, rel))
                else if (isObject(value)) {
                    if (value != null)
                        entities.push(entity(value, object, prop, rel))
                }
            }
        }
        return entities
    }

    // only call at root
    function deepArray(objects) {
        return Lazy(objects).map(o => entity(o)).toArray()
    }

    // All non-root collections should only store an href and not its resolved constituents
    function shallowArray(objects, parentObject, parentProperty, parentRel) {
        if (!isArray(objects))
            throw Errors.typeArg('objects', 'array')
        return {
            class: cls(objects, parentProperty),
            rel: rel(objects, parentRel),
            href: linkSelf(null, parentObject, parentProperty).href
        }
    }

    function cls(object, parentProperty = '') {
        if (object === null)
            throw Errors.nullArg('object')
        var type = typeOf(object)
        parentProperty = parentProperty.trim()
        var cls = []
        if (parentProperty && typeof (parentProperty) == 'string')
            cls.push(parentProperty)
        cls.push(type)
        return cls
    }

    function rel(object, parentRel = null) {
        if (object === null)
            throw Errors.nullArg('object')
        var type = typeOf(object)
        var rel
        if (!parentRel)
            rel = type
        else
            rel = parentRel[0] + '.' + type
        return [rel]
    }

    function properties(object) {
        var props = {}
        for (var prop in object) {
            var value = object[prop]
            if (isValue(value))
                props[prop] = value
        }
        return props
    }

    // takes all methods decorated with GET and exposes as links
    function links(object, parent, parentProperty) {
        var links = []
        links.push(linkSelf(object, parent, parentProperty))
        for (var prop in object) {
            var value = object[prop]
            if (isFunction(value) && value.annotations && value.annotations.length > 0) {
                var annotation = value.annotations[0]
                if (typeOf(annotation).match(/get/i))
                    links.push(link(prop, annotation.url))
            }
        }

        function link(name, href) {
            return {
                rel: [name],
                href
            }
        }

        return links
    }

    function linkSelf(object, parentObject, parentProperty) {
        object = object || {}
        var url
        if (object.constructor.annotations) {
            url = object.constructor.annotations[0].url
        } else if (parentObject) {
            var parentUrl = linkSelf(parentObject).href
            url = parentUrl ? parentUrl + '/' + parentProperty : ''
        }

        return {
            rel: ['self'],
            href: url || ''
        }
    }

    function actions(object) {
        var actions = [];

        for (var prop in object) {
            var value = object[prop]

            if (isFunction(value) && value.annotations && value.annotations.length > 0) {
                var annotation = value.annotations[0]
                if (typeOf(annotation).match(/post|put|delete|patch/i))
                    actions.push(action(value, prop, annotation))
            }
        }

        function action(func, prop, annotation) {
            return {
                name: prop,
                title: prop,
                href: annotation.url,
                method: typeOf(annotation).toUpperCase(),
                fields: args(func).map(arg => ({
                    name: arg,
                    type: typeOf(value)
                }))
            }
        }

        return actions
    }

    function typeOf(object) {
        if (isArray(object)) {
            if (object.length == 0)
                return '[]'
            return '[' + object[0].constructor.name + ']'
        }
        return object.constructor.name
    }

    function isValue(object) {
        return (typeof object) !== 'object' && !isFunction(object)
    }

    function isArray(object) {
        return Array.isArray(object)
    }

    function isFunction(object) {
        return (typeof object) == 'function'
    }

    function isObject(object) {
        return (typeof object) == 'object'
    }
    
    function args(func) {
        var match = func.toString().match(/function.*?\((.*?)\)/)[1]
        if (!match)
            return []
        return match.split(',').map(e=>e.trim())
    }

}