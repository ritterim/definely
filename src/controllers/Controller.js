import SirenClient from '../siren/SirenClient'

export
default class Controller {
    siren(json) {
        var siren = new SirenClient(json)
        return siren.view
    }

    url(relativeUrl = '') {
        // this.server is set when routes are registered from child controllers in index.js using RouteRegister.
        return this.server.info.uri.trimEnd('/') + ("/" + relativeUrl).normalize('/')
    }
}
