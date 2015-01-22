import HomeController from './HomeController'
import TermsController from './TermsController'
import TermApiController from './api/TermApiController'

export default function register(server) {

    // Views
    new HomeController(server)
    new TermsController(server)

    // Api
    new TermApiController(server)
};
