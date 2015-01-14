import Controller from './Controller'

export default class TermController extends Controller {
	constructor(router)
	{
		super(router, '/terms')
		this.get('/', this.index)
	}
	
	index(request, reply) {
		reply.view('termList')
	}
	
}