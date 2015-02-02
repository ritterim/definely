import Controller from '../Controller'
import Siren from '../../siren/Siren'
import _ from '../../extensions'

export default class ApiController extends Controller {
    siren(entity) {
        var url = this.url('api')
        var siren = new Siren(entity, url)
        return siren.json
    }
}
