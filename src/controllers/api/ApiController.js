import Controller from '../Controller'
import Siren from '../../siren/Siren'	
import extensions from '../../extensions'    
    
export default class ApiController extends Controller {
	constructor(router, baseUrl = '') {
		baseUrl = '/api/' + baseUrl.trimBoth('/')
		super(router, baseUrl)
	}
    
    siren(entity) {
        var url = super.absoluteUrl(url)
        var siren = new Siren(entity, url)
        return siren.json
    }
}