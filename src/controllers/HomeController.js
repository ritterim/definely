import Controller from './Controller'

export default class HomeController extends Controller {
	constructor(router)
	{
		super(router, '/definitions')
		this.get('/', this.index)
	}
	
	index(request, reply) {
		reply.view('index')
	}
	
}