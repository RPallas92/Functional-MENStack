var mongoAnimalDataStore = require('./mongoAnimalDataStore');

function create(){
	return mongoAnimalDataStore;
}

module.exports.create = create;
