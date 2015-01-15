import {
    TypeError, NullError
}
from './Errors'

import Lazy from 'lazy.js'

export default function Siren(resource) {

    this.root = root(resource)
    this.json = JSON.stringify(root)

    function root(object) {
        if (isArray(object))
            return deepArray(object)
        else if (isObject(object))
            return entity(object)
        throw new TypeError('object is not an array or an object')
    }

    function entity(object, parentProperty, parentRel) {
        if (object === null)
            throw new NullError('Object cannot be null')

        return {
            class: cls(object, parentProperty),
            rel: rel(object, parentRel),
            properties: properties(object),
            entities: entities(object, rel)
        }
    }

    // only call at root
    function deepArray(objects) {
        return Lazy(objects).map(o => entity(o)).toArray()
    }

    // All non-root collections should only store an href and not its resolved constituents
    function shallowArray(objects, parentProp, parentRel) {
        if (!isArray(objects))
            throw new TypeError('objects are not an array.')

        return {
            class: cls(object, parentProperty),
            rel: rel(object, parentRel),
            href: 'todo: get url from property url annotation',
            links: links(object)
        }
    }

    function entities(object, rel) {
        var entities = []
        for (var prop in object) {
            var value = object[prop]
            if (!isValue(value)) {
                if (isArray(value))
                    entities.push(shallowArray(value, prop, rel))
                else if (isObject(value))
                    entities.push(entity(value, prop, rel))
            }
        }
        return entities
    }

    function cls(object, parentProperty = '') {
        if (object === null)
            throw new NullError('Object cannot be null')
        var type = type(object)
        parentProperty = parentProperty.trim()
        var cls = []
        if (parentProperty && string.isString(parentProperty))
            cls.push(parentProperty)
        cls.push(type)
        return cls
    }

    // For now let rel = 'parentRel/currentType'
    function rel(object, parentRel = '') {
        if (object === null)
            throw new NullError('Object cannot be null')
        parentRel = parentRel.trim()
        var type = type(object)
        if (parentRel === '')
            return type
        return parentRel + '/' + type
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
    function links(object) {
        // siren spec: all links must have at least a rel 'self' linking to self unless it is a collection sub-entity

        var links = []
        links.push(link('self', 'todo: find url from GET annotation'))
        for (var prop in object) {
            var value = object[prop]
            var annotation = {
                    method: 'GET',
                    url: 'url'
                } // get annotation from method
            if (isFunction(value) && annotation.method.match(/get/i))
                links.push(link(prop, annotation))
        }

        function link(name, annotation) {
            return {
                rel: [name],
                href: annotation.url
            }
        }

        return links
    }

    // takes all methods decorated with POST and exposes as actions
    function actions(object) {
        var actions = [];

        for (var prop in object) {
            var value = object[prop]
            var annotation = {
                    method: 'POST',
                    url: 'url'
                } // get annotation from method
            if (isFunction(value) && "post put delete patch".indexOf(annotation.method) != -1)
                actions.push(action(value, prop, annotation))
        }

        function action(value, prop, annotation) {
            return {
                name: prop,
                title: prop,
                href: annotation.url,
                method: annotation.method,
                fields: Lazy(arguments).map(arg => ({
                    name: arg,
                    type: type(value),
                    value
                })).toArray(),
            }
        }

        return actions
    }

    function type(object) {
        if (isArray(object)) {
            if (object.length == 0)
                return 'collection'
            object = object[0]
        }
        return "test"//object.constructor.name
    }

    function isValue(object) {
        return typeof (object) !== 'object' && !isFunction(object)
    }

    function isArray(object) {
        return Array.isArray(object)
    }

    function isFunction(object) {
        return typeof (object) == 'function'
    }

    function isObject(object) {
        return typeof (object) == 'object'
    }

}