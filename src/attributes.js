class Method {
    constructor(url, name=null) {
        this.url = url
        this.name = name
    }
}

export class Get extends Method {
    constructor(url,name) {
        super(url,name)
    }
}

export class Post extends Method {
    constructor(url,name) {
        super(url,name)
    }
}

export class Put extends Method {
    constructor(url,name) {
        super(url,name)
    }
}

export class Patch extends Method {
    constructor(url,name) {
        super(url,name)
    }
}

export class Delete extends Method {
    constructor(url,name) {
        super(url,name)
    }
}
