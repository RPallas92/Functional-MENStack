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
	return saveAnimal(animal)
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
	return PagedAnimals(pageNumber, pageSize, numberOfItems, animals)
})

//Private functions for adding and animal

var getNextIdFor = function(collection){
	return new Task(function(reject, resolve) {
		collection.find({}, { sort: [['_id', -1]], limit: 1 }).toArray(function(err, item) {
			if(err) {
				reject(err)
			} else {
				resolve((R.head(item)._id + 1))
			}
		})
  	})
}

var addIdToObject = R.curry(function(object, id){
	var setId = R.set(R.lensProp('_id'), id)
	return setId(object)
})

var saveObjectFor = R.curry(function(collection, object){
	return new Task(function(reject, resolve) {
		collection.insert(object, function(err, item){
			if(err){
				reject(err)
			} else {
				resolve(R.head(item.insertedIds))
			}
		})
  	})
})

var saveObjectAndIdFor = R.curry(function(collection, object){
	var getNextId = getNextIdFor(collection)
	var addId = addIdToObject(object)
	var saveObject = saveObjectFor(collection)

	return R.compose(R.chain(saveObject), R.map(addId))(getNextId)
})

var saveObjectsAndIdsFor = function(collection, objects){
	var saveObjectAndId = saveObjectAndIdFor(collection)
	var saveObjects = R.map(saveObjectAndId, objects)
	return R.traverse(Task.of, R.identity, saveObjects)
}

var getFlatAnimal = function(animal, ownerId, vaccineIds){
	var setOwner = R.set(R.lensProp('owner'))
	var setVaccines = R.set(R.lensProp('vaccines'))
	return R.compose(setOwner(ownerId), setVaccines(vaccineIds))(animal)

}

var saveAnimal = function (animal){
		var getOwner = R.view(R.lensProp('owner'))
		var getVaccines = R.view(R.lensProp('vaccines'))

		var saveOwnerTask = saveObjectAndIdFor(db.owners, getOwner(animal))
		var saveVaccinesTask = saveObjectsAndIdsFor(db.vaccines, getVaccines(animal))

		var getFlatAnimalTask = R.lift(getFlatAnimal)(Task.of(animal), saveOwnerTask, saveVaccinesTask)
		var saveFlatAnimal = saveObjectAndIdFor(db.animals)

		return getFlatAnimalTask.chain(saveFlatAnimal)
}






//Exports
module.exports.addAnimal = addAnimal;
module.exports.getPagedAnimalsByPage = getPagedAnimalsByPage;
