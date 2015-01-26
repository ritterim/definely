import assert from 'assert'
import sut from './sanitize'

suite('Sanitize', function() {
    suite('#htmlSanitize()', function() {
        test('should encode all lt and gt-symbols', function() {
            var result = new sut()
                .sanitizeHtml('<test></test>');

            assert.equal('&lt;test&gt;&lt;/test&gt;', result);
        });
    });
});
