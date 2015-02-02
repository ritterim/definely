import SirenClient from '../siren/SirenClient'

export
default class Controller {
    siren(json) {
        var siren = new SirenClient(json)
        return siren.view
    }

    url(relativeUrl = '') {
        return this.server.info.uri.trimEnd('/') + ("/" + relativeUrl).normalize('/')
    }
}
