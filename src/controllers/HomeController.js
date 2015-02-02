import Controller from './Controller'
import {Get, Post, Put, Patch, Delete} from '../attributes'

export default class HomeController extends Controller {
    @Get()
    index(request, reply) {
        console.log('asdf')
        // This is a special view and should not have a layout.
        reply.view('index', {}, {
            layout: false
        })
    }
}
