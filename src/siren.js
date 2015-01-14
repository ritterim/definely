export class Siren {
    constructor(resource) {


    }

    function load(resource) {
        if (Array.isArray(resource))
            return loadArray(resource)
        return loadObject(resource)
    }

    function loadArray(collection, property=null, rel=null, href=null) {
        var siren = {}
        siren.class = []
        var type = object.constructor.name
        
        if (property)
            siren.class.push(property)
        siren.class.push(type)
        
        if (rel)
            siren.rel = rel
            
        if (href) 
            siren.href = href
    }

    function loadObject(object, property=null, rel=null, href=null) {
        var siren = {}
        siren.class = [object.constructor.name]
        siren.properties = {}
        siren.entities = []
        
        for (var prop in object) {
            var value = object[prop]
            if (isValue(value))
                siren.properties[prop] = value
            else {
                siren.entities.push(load(value))
            }
        }
        
    }
    
    function post(object) {
        
    }
    
    function isValue(object) {
        return typeof object !== 'object';
    }
        
}