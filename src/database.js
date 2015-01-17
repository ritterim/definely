import pg from 'pg';

export default class Database{
    constructor(){
        this.client = new pg.Client(process.env['DATABASE_URL']);
    };

    search(searchTerm, callback){
        client.connect(function(err){
            if(err) {
                return console.error('Could not connect to postgres', err);
            }

            client.query("select id, term, definition, tags, document, ts_rank(document,to_tsquery(" + searchTerm + ")) from (select id, term, definition, tags, setweight(to_tsvector(coalesce(terms.term, '')), 'A') || setweight(to_tsvector(coalesce(terms.definition, '')), 'C') || setweight(to_tsvector(coalesce(terms.tags, '')), 'B') as document from terms) t_search where document @@ to_tsquery(" + searchTerm + ") order by ts_rank(document, to_tsquery(" + searchTerm + " )) desc;",
                         function(err, result){
                             if(err) {
                                 return console.error('Error running query', err);
                             }
                             client.end();
                             callback(result);
                         });
        });
    };

    add(tags, term, definition, callback){
        client.connect(function(err){
            if(err){
                return console.error('Could not connect to postgres', err);
            }
            client.query("insert into terms (tags, term, definition) values(" + tags + "," + term + ", " + definition + " ); ", function(err, result){
                if(err){
                    return console.error('Error running query', err);
                }
                client.end();
                callback(result);
            });
        });
    };

    update(id, tags, term, definition, callback){
        client.connect(function(err){
            if(err){
                return console.error('Could not connect to postgres', err);
            }
            client.query("update terms set tags = " + tags + ", term = " + term + ", definition = " + definition + " where id = " + id + ";",function(err, result){
                if(err){
                    return console.error('Error running query', err);
                }
                client.end();
                callback(result);
            });
        });
    };
}
