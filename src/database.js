import pg from 'pg';
export default class Database{
    constructor(){
        
    };
    
    search(searchTerm, callback){
         var client = new pg.Client(process.env['DATABASE_URL']);
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
    }
    
}
