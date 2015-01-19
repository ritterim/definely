import HomeController from './HomeController'
import DefinitionController from './DefinitionController'
import TermController from './TermController'
import DefinitionApiController from './api/DefinitionApiController'
import TermApiController from './api/TermApiController'

export default function setup(server) {
	
	// Views
	new HomeController(server)
	new DefinitionController(server)
	new TermController(server)
	
	// Api
	new DefinitionApiController(server)
	new TermApiController(server)
};