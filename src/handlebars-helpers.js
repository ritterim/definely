import marked from 'marked'
import Sanitize from './sanitize'

export default class HandlebarsHelpers {
    constructor(handlebars) {
        this.handlebars = handlebars;
    }

    /**
     * Singular call to register any available helpers.
     */
    register() {
        this.registerCurrentYear(this.handlebars);
        this.registerSanitizeHtml(this.handlebars);
        this.registerMarked(this.handlebars);
    }

    /**
     * Registers a helper which returns the current year.
     */
    registerCurrentYear(handlebars) {
        handlebars.registerHelper("currentYear", function() {
            return new Date().getFullYear();
        });
    }

    /**
     * Registers a helper which converts any HTML-brackets to their
     * entity-versions.
     */
    registerSanitizeHtml(handlebars) {
        handlebars.registerHelper('sanitizeHtml', function(input) {
            return new Sanitize().sanitizeHtml(input);
        });
    }

    /**
     * Registers a helper for converting markdown into HTML via
     * `marked` NPM.
     */
    registerMarked(handlebars) {
        handlebars.registerHelper('marked', function(input) {
            return marked(input);
        });
    }
}
