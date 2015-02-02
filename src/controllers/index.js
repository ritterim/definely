import HomeController from './HomeController'
import TermsController from './TermsController'
import TermApiController from './api/TermApiController'
import RouteRegister from './RouteRegister'

export default function register(server) {
    var r = RouteRegister.hapi(server)
    r.register(HomeController, TermsController, TermApiController)
};
