exports.up = function(pgm, run) {
    pgm.createTable('terms',
            {
                id: { type: 'serial', primaryKey: true, notNull: true}, 
                tags: { type: 'text'},
                term: { type: 'varchar(100)', notNull: true}
            });
    
    pgm.createTable('definitions', 
            {
                id: { type: 'serial', primaryKey: true, notNull: true},
                termid: { type: 'integer', foreignKey: true, notNull: true, references: 'terms'}, 
                definition: { type: 'text', notNull: true}
            });
    
    run();
};

exports.down = false;
