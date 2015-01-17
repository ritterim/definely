import pg from 'pg';

export default class Database{
    constructor(connectionUri){
        this.client = new pg.Client(connectionUri);
    };

    add(term, tags, definition, callback) {
        var self = this;

        this.client.connect(function(err) {
            if(err) {
                return console.error('Could not connect to postgres', err);
            }

            self.client.query('insert into terms (term, tags, definition) values ($1, $2, $3);', [ term, tags, definition ], function(err, result) {
                if(err) {
                    return console.error('Error running query', err);
                }

                self.client.end();

                callback(result);
            });
        });
    };

    find(id, callback) {
        var self = this;

        this.client.connect(function(err) {
            if(err) {
                return console.error('Could not connect to postgres', err);
            }

            self.client.query('select id, term, tags, definition from terms where id = $1;', [ id ],
                              function(err, result) {
                                  if(err) {
                                      return console.error('Error running query', err);
                                  }

                                  self.client.end();

                                  callback(result);
                              });
        });
    };

    search(searchTerm, callback) {
        var self = this;

        this.client.connect(function(err) {
            if(err) {
                return console.error('Could not connect to postgres', err);
            }

            self.client.query('select id, term, tags from terms, to_tsquery($1) as query where weightedVector @@ query order by ts_rank_cd(weightedVector, query) desc;', [ searchTerm ],
                              function(err, result) {
                                  if(err) {
                                      return console.error('Error running query', err);
                                  }

                                  self.client.end();

                                  callback(result);
                              });
        });
    };

    update(id, term, tags, definition, callback) {
        var self = this;

        this.client.connect(function(err) {
            if(err) {
                return console.error('Could not connect to postgres', err);
            }

            self.client.query('update terms set term = $1, tags = $2, definition = $3 where id = $4;', [ term, tags, definition, id ], function(err, result) {
                if(err) {
                    return console.error('Error running query', err);
                }

                self.client.end();

                callback(result);
            });
        });
    };
}
