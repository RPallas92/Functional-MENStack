var express = require('express')
var mongoskin = require('mongoskin')
var bodyParser = require('body-parser')
var logger = require('morgan')
var R = require('ramda')


var GetPagedAnimals = require('../domain/interactor/GetPagedAnimals.js')

var app = express()

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(logger())



//API
app.get('/', function(req, res, next) {
  sendDataTo(res, 'Get Animals e.g. /animals/0, or insert one')
})


app.get('/animals/:pageNumber', function(req, res, next) {
  	GetPagedAnimals.execute(req.params.pageNumber).fork(sendErrorTo(res), sendDataTo(res))
})


//Helper functions
var sendErrorTo = R.curry(function(res, err){
  	res.status(500).send('Internal Server Error');
})

var sendDataTo = R.curry(function(res, data){
	res.send(data)
})


app.listen(3000, function(){
  console.log ('Server is running')
})