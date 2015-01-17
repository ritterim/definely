import Controller from './Controller'
import pg from 'pg'
import Database from '../database'

export default class DefinitionController extends Controller {
    constructor(router)
    {
        super(router, '/definitions')
        this.get('/{id}', this.show)
    }

    show(request, reply) {
        var id = request.params.id;
        var database = new Database(process.env['DATABASE_URL']);

        database.find(id, function(dbResponse) {
            reply.view('definitionList', {
                title: 'Definition for ' + dbResponse.rows[0].term,
                definition: dbResponse.rows[0]
            });
        });
    }
}
