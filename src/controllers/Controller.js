import SirenClient from '../siren/SirenClient'

export default class Controller {
    siren(json) {
        var siren = new SirenClient(json)
        return siren.view
    }
}
