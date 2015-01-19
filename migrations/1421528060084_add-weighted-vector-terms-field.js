var fs = require('fs');
var Path = require('path');

exports.up = function(pgm, run) {
    fs.readFile(Path.join(__dirname + '/1421528060084_up_add-weighted-vector-terms-field.sql'), 'utf8', function(err, data) {
        if (err) {
            return console.error(err);
        }

        pgm.sql(data);

        run();
    });
};

exports.down = function(pgm, run) {
    fs.readFile(Path.join(__dirname + '/1421528060084_down_add-weighted-vector-terms-field.sql'), 'utf8', function(err, data) {
        if (err) {
            return console.error(err);
        }

        pgm.sql(data);

        run();
    });
};
