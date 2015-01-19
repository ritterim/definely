import Errors from '../Errors'
import Lazy from 'lazy.js'
import Path from 'path'
import _ from '../extensions'
    
export default function Siren(resource, baseUrl = '') {
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

        publicMembers(object).each(({
            value, prop
        }) => {
            if (!isValue(value)) {
                if (isArray(value))
                    entities.push(shallowArray(value, object, prop, rel))
                else if (isObject(value)) {
                    if (value != null)
                        entities.push(entity(value, object, prop, rel))
                }
            }
        })

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

        publicMembers(object).each(({
            value, prop
        }) => {
            if (isValue(value))
                props[prop] = value
        })
        return props
    }

    // takes all methods decorated with GET and exposes as links
    function links(object, parent, parentProperty) {
        var links = []
        links.push(linkSelf(object, parent, parentProperty))

        publicMembers(object).each(({
            value, prop
        }) => {
            if (isFunction(value) && value.annotations && value.annotations.length > 0) {
                var annotation = value.annotations[0]
                if (typeOf(annotation).match(/get/i)) {
                    var link = {
                        rel: [prop],
                        href: fixUrl(annotation.url, object)
                    }
                    links.push(link)
                }
            }
        })

        function link(name, href, object) {
            return {
                rel: [name],
                href: fixUrl(href, object)
            }
        }

        return links
    }

    function linkSelf(object, parentObject, parentProperty) {
        object = object || {}
        var url

        if (object.constructor.annotations) {
            url = object.constructor.annotations[0].url
            url = fixUrl(url, object)
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

        publicMembers(object).each(({
            value, prop
        }) => {
            if (isFunction(value) && value.annotations && value.annotations.length > 0) {
                var annotation = value.annotations[0]
                if (typeOf(annotation).match(/post|put|delete|patch/i)) {
                    var action = {
                        name: prop,
                        title: prop,
                        href: fixUrl(annotation.url, object),
                        method: typeOf(annotation).toUpperCase(),
                        fields: args(value).map(arg => ({
                            name: arg,
                            type: 'todo'
                        }))
                    }
                    actions.push(action)
                }
            }
        })

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
        return match.split(',').map(e => e.trim())
    }

    function fixUrl(relativeUrl, object) {
        // replace any parameters in url
        var parmPattern = /:[^\/]*|\{.*?\}/g
        Lazy(relativeUrl.match(parmPattern))
        .map(e=>e.replace(/[\{\}:]/g, ''))
        .map(e=>({parm: e, value: object[e]}))
        .each(e=>relativeUrl = relativeUrl.replace('{' + e.parm + '}', e.value)
                            .replace(':' + e.parm, e.value))
        
        // append the base url to the relative one
        var url = (baseUrl + (baseUrl?'/':'') + relativeUrl).normalize()
        return url
    }

    // Iterates through only public properties and methods. Public are all those without _ appended or prepended to field name.
    function publicMembers(object) {
        var members = []
        for (var prop in object) {
            if (!prop.match(/^_|_$/))
                members.push({
                    prop: prop,
                    value: object[prop]
                })
        }
        return Lazy(members)
    }

}