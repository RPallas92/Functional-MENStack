var AnimalRepository = require('../../data/AnimalRepository.js')

var execute = function(pageNumber){
	var PAGE_SIZE = 2;
	var DEFAULT_PAGE_NUMBER = 1
	var cleanPageNumber = pageNumber >= 1 ? pageNumber : DEFAULT_PAGE_NUMBER
	return AnimalRepository.getPagedAnimalsByPage(cleanPageNumber, PAGE_SIZE)
}

module.exports.execute = execute
