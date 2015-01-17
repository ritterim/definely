import Controller from './Controller'
import pg from 'pg'
import Database from '../database'

export default class TermController extends Controller {
    constructor(router) {
        super(router, '/terms')
        this.get('/', this.index)
    }

    index(request, reply) {
        var searchTerm = request.url.query['search-term'];
        var title = searchTerm == null ? 'Terms' : 'Search results for: ' + searchTerm;

        var database = new Database(process.env['DATABASE_URL']);

        database.search(searchTerm, function(dbResponse) {
            reply.view('termList', {
                title: title,
                terms: dbResponse.rows
            });
        });
    }
}
