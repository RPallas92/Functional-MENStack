//Imports
var animalDataStoreFactory = require('./mongoAnimalDataStore');
var animalDataStore = animalDataStoreFactory.create();

//Repository API
var getAnimals = animalDataStore.getAnimals;
var getPagedAnimalsByPage = animalDataStore.getPagedAnimalsByPage; //Params pageNumber, pageSize
var addAnimal = animalDataStore.addAnimal; //Params animal

//Exports
module.exports.getAnimals = getAnimals;
module.exports.addAnimal = addAnimal;
modele.expots.getPagedAnimalsByPage = getPagedAnimalsByPage;
