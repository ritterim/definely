import Controller from '../Controller'
import Siren from '../../siren/Siren'	
    
export default class ApiController extends Controller {
	constructor(router, baseUrl = '') {
		baseUrl = '/api/' + baseUrl.trimBoth('/')
		super(router, baseUrl)
        this.router = router
	}
    
    siren(entity) {
        //var url = super.absoluteUrl.bind(this, url)()
        //console.log(url)
        var siren = new Siren(entity, 'https://localhost:3000/api')
        return siren.json
    }
}