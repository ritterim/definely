export default class Controller {
    constructor(router, baseUrl = '') {
        this.router = router
        this.baseUrl = baseUrl
    }

    get(relativeUrl, handler, name = null) {
        this.route('GET', this.url(relativeUrl), handler)
    }

    post(relativeUrl, handler, name = null) {
        this.route('POST', this.url(relativeUrl), handler)
    }

    delete(relativeUrl, handler, name = null) {
        this.route('DELETE', this.url(relativeUrl), handler)
    }

    patch(relativeUrl, handler, name = null) {
        this.route('PATCH', this.url(relativeUrl), handler)
    }

    put(relativeUrl, handler, name = null) {
        this.route('PUT', this.url(relativeUrl), handler)
    }

    route(method, path, handler, name = null) {
        var route = {
            method,
            path,
            config: {
                handler
            }

        }
        if (name)
            route.config.id = name

        this.router.route(route)
    }

    url(relativeUrl='') {
        var url = ('/' + this.baseUrl + '/' + relativeUrl).normalize('/')
        if (url != '/')
            url = url.trimEnd('/')
        return url
    }

    absoluteUrl(relativeUrl='') {
        console.log('asdf')
//        console.log(this.router)
//        console.log(this.router.info.uri)
//        console.log(url())
        return (this.router.info.uri + "/" + this.url(relativeUrl)).normalize()
    }
}
