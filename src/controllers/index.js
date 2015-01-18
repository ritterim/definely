import HomeController from './HomeController'
import TermsController from './TermsController'
import DefinitionApiController from './api/DefinitionApiController'
import TermApiController from './api/TermApiController'

export default function setup(server) {
	
	// Views
	new HomeController(server)
	new TermsController(server)
	
	// Api
	new DefinitionApiController(server)
	new TermApiController(server)
};
