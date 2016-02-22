//Imports
var animalDataStoreFactory = require('./datasource/AnimalDataStoreFactory.js');
var animalDataStore = animalDataStoreFactory.create();

//Repository API
var getPagedAnimalsByPage = animalDataStore.getPagedAnimalsByPage; //Params pageNumber, pageSize
var addAnimal = animalDataStore.addAnimal; //Params animal

//Exports
module.exports.addAnimal = addAnimal;
module.exports.getPagedAnimalsByPage = getPagedAnimalsByPage;
