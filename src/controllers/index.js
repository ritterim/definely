import DefinitionController from './DefinitionController'
import TermController from './TermController'

export default function setup(server) {
	new DefinitionController(server)
	new TermController(server)
};