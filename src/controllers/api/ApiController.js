import Controller from '../Controller'
import Siren from '../../siren/Siren'	
    
export default class ApiController extends Controller {
	constructor(router, baseUrl = '') {
		baseUrl = '/api/' + baseUrl.trimBoth('/')
		super(router, baseUrl)
	}
    
    siren(entity) {
        var siren = new Siren(entity)
        return siren.json
    }
}