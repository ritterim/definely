import Controller from './Controller'
import pg from 'pg'

export default class TermController extends Controller {
    constructor(router) {
        super(router, '/terms')
        this.get('/', this.index)
    }

    index(request, reply) {
        var searchTerm = request.url.query['search-term'];
        var title = searchTerm == null ? 'Terms' : 'Search results for: ' + searchTerm;

        var findTerms = function(searchTerm, cb) {
            var client = new pg.Client(process.env['DATABASE_URL']);

            client.connect(function(err) {
                if(err) {
                    return console.error('Could not connect to postgres', err);
                }

                client.query('select t.term, t.tags, d.id from terms t inner join definitions d on t.id = d.termid where t.term ilike $1', [searchTerm + '%'] , function(err, result) {
                    if(err) {
                        return console.error('Error running query', err);
                    }

                    client.end();

                    cb(result);
                });
            });
        };

        findTerms(searchTerm, function(dbResponse) {
            reply.view('termList', {
                title: title,
                terms: dbResponse.rows
            });
        });
    }
}
