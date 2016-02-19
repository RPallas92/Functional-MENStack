//Imports
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://@localhost:27017/farm', {safe:true})
var Task = require("data.task");
var R = require('ramda');
db.bind('vaccines');
db.bind('owners');
db.bind('animals');


//Datastore API
var getAnimals = function(){

}
var getPagedAnimalsByPage = function(pageNumber, pageSize){

}

var addAnimal = function(animal){

	getOwnerById(1).concatenated.fork(
  function(error) { console.log("EERORRR" + error) }
, function(data)  { console.log(data) }
)
 console.log('hack')
}

//Private functions

var getVaccinesByIds = function(vaccioneIds){

  return new Task(function(reject, resolve) {

	db.vaccines.find({ _id: { $in : vaccioneIds } }).toArray(function(err, items) {
		db.close();
		if(err) {
			reject(err)
		} else {
			resolve(items)
		}
	})
  })

}

var getOwnerById = function(ownerId){

	return new Task(function(reject, resolve) {
		db.owners.find({ _id: ownerId }).toArray(function(err, item) {
			db.close();
			if(err) {
				reject(err)
			} else {
				resolve(item)
			}
		})
  	})

}


var populateAnimal = R.curry(function(animal, owner, vaccines){
	var setOwner = R.set(R.lensProp('owner'), owner); 
	var setVaccines = R.set(R.lensProp('vaccines'), vaccines); 
	return R.compose(setOwner, setVaccines)(animal)
})

//Exports
module.exports.getAnimals = getAnimals;
module.exports.addAnimal = addAnimal;
module.exports.getPagedAnimalsByPage = getPagedAnimalsByPage;
module.exports.hack = hack;


