exports.up = function(pgm, run) {
    pgm.addColumns('terms', 
        {   definition: { type: 'text', notNull: true, default: '' } });
    
    run();
};

exports.down = false;