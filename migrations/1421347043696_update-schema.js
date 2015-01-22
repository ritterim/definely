exports.up = function(pgm, run) {
    pgm.dropTable('definitions');
    pgm.addColumns('terms',
        {   definition: { type: 'text' } });

    run();
};

exports.down = false;