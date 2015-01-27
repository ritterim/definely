import Controller from './Controller'

export default class HomeController extends Controller {
    constructor(router) {
        super(router)
        this.get('/', this.index)
    }

    index(request, reply) {
        // This is a special view and should not have a layout.
        reply.view('index', {}, {
            layout: false
        })
    }
}
