//Imports
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://@localhost:27017/farm', {safe:true})
var Task = require("data.task");
var R = require('ramda');
var PagedAnimals = require('../../Domain/PagedAnimals.js')
db.bind('vaccines');
db.bind('owners');
db.bind('animals');


//Datastore API
var getPagedAnimalsByPage = function(pageNumber, pageSize){
	return getRealPageNumberTask(pageNumber, pageSize).chain(function(realPageNumber){
		return R.lift(createPagedAnimals)(Task.of(realPageNumber), getRealPageSizeTask(pageSize), getNumberOfAnimals(), getAnimalsByPage(realPageNumber, pageSize))
	})
}

var addAnimal = function(animal){

	getOwnerById(1).concatenated.fork(
  function(error) { console.log("EERORRR" + error) }
, function(data)  { console.log(data) }
)
 console.log('hack')
}




//Private functions
var getNumberOfPages = function (pageSize){
	return getNumberOfAnimals().map(R.compose(ceil, R.divide(R.__, pageSize)))
}

var getNumberOfAnimals = function(){
  return new Task(function(reject, resolve) {
	db.animals.count(function(err, count) {
		if(err) {
			reject(err)
		} else {
			resolve(count)
		}
	})
  })
}

var getRealPageNumberTask = function(pageNumber, pageSize){
	return getNumberOfPages(pageSize).map(function(number){
		return pageNumber > number ? number : pageNumber
	})
}


var getRealPageSizeTask  = function(pageSize){
	return getNumberOfAnimals().map(function(numberOfAnimals){
		return pageSize > numberOfAnimals ? numberOfAnimals : pageSize
	})
}

var getFlatAnimalsByPage =  function (pageNumber, pageSize){

  return new Task(function(reject, resolve) {
	db.animals.find({}, {_id: 0}, {
    	limit: pageSize,
    	skip: pageSize*(pageNumber-1),
    	sort: [['_id', 1]]
  	}).toArray(function(err, items) {
		if(err) {
			reject(err)
		} else {
			resolve(items)
		}
	})
  })

}

var getVaccinesByIds = function(vaccineIds){

  return new Task(function(reject, resolve) {

	db.vaccines.find({ _id: { $in : vaccineIds } }, {_id: 0}).toArray(function(err, items) {
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
		db.owners.find({ _id: ownerId }, {_id: 0}).toArray(function(err, item) {
			if(err) {
				reject(err)
			} else {
				resolve(R.head(item))
			}
		})
  	})

}

var populateAnimal = R.curry(function(animal, owner, vaccines){
	var setOwner = R.set(R.lensProp('owner'), owner);
	var setVaccines = R.set(R.lensProp('vaccines'), vaccines);
	return R.compose(setOwner, setVaccines)(animal)
})

var animalFromFlatAnimal = function(animal){
 	return getOwnerById(animal.owner).chain(function(owner){
		return getVaccinesByIds(animal.vaccines).map(function(vaccines){
			return populateAnimal(animal, owner, vaccines)
		})
	})
}

var getAnimalsByPage = function(pageNumber, pageSize) {
	return getFlatAnimalsByPage(pageNumber, pageSize).chain(R.compose(R.traverse(Task.of, R.identity), R.map(animalFromFlatAnimal)))
}

var ceil = R.curry(Math.ceil)

var createPagedAnimals = R.curry(function(pageNumber, pageSize, numberOfItems, animals) {
	debugger;
	return PagedAnimals(pageNumber, pageSize, numberOfItems, animals)
})

var getNextAnimalId = function(){

}


//Exports
module.exports.addAnimal = addAnimal;
module.exports.getPagedAnimalsByPage = getPagedAnimalsByPage;
