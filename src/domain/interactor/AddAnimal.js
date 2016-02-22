var AnimalRepository = require('../../data/AnimalRepository.js')

var execute = function(animal){
	return AnimalRepository.addAnimal(animal)
}

module.exports.execute = execute