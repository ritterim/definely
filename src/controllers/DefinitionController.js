import Controller from './Controller'
import pg from 'pg'

export default class DefinitionController extends Controller {
    constructor(router)
    {
        super(router, '/definitions')
        this.get('/{id}', this.show)
    }

    show(request, reply) {
        var id = request.params.id;

        var client = new pg.Client(process.env['DATABASE_URL']);

        client.connect(function(err) {
            if(err) {
                return console.error('Could not connect to postgres', err);
            }

            client.query('select t.term, t.tags, d.definition from terms t inner join definitions d on t.id = d.termid where d.id = $1', [id] , function(err, result) {
                if(err) {
                    return console.error('Error running query', err);
                }

                client.end();

                reply.view('definitionList', {
                    title: 'Definition for ' + result.rows[0].term,
                    definition: result.rows[0]
                });
            });
        });
    }
}
