import Controller from '../Controller'
import Siren from '../../siren/Siren'

export default class ApiController extends Controller {
    constructor(router, baseUrl = '') {
        baseUrl = '/api/' + baseUrl.trimBoth('/')
        super(router, baseUrl)
        this.router = router
    }

    siren(entity) {
        var url = this.absoluteUrl('api') //.bind(this, url)()
        //var url = 'https://localhost:3000/api'
        var siren = new Siren(entity, url)
        return siren.json
    }
}