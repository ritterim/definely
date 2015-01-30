import SirenClient from '../siren/SirenClient'

export default class Controller {
    constructor(router, baseUrl = '') {
        this.router = router
        this.baseUrl = baseUrl
    }

    siren(json) {
        var siren = new SirenClient(json)
        return siren.view
    }

    url(relativeUrl='') {
        var url = ('/' + this.baseUrl + '/' + relativeUrl).normalize('/')
        if (url != '/')
            url = url.trimEnd('/')
        return url
    }

    absoluteUrl(relativeUrl='') {
        var url = this.router.info.uri.trimEnd('/') + ("/" + relativeUrl).normalize('/')
        return url
    }
}
