var mongoAnimalDataStore = require('./MongoAnimalDataStore.js');

function create(){
	return mongoAnimalDataStore;
}

module.exports.create = create;
