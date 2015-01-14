import Controller from '../Controller'
	
export default class ApiController extends Controller {
	constructor(router, baseUrl = '') {
		baseUrl = '/api/' + baseUrl.trimBoth('/')
		super(router, baseUrl)
	}

}