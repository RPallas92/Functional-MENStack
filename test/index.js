var superagent = require('superagent')
var expect = require('expect.js')

describe('Functional-MENStack', function(){
  var firstAnimalId, secondAnimalId, page, pageSize, count


  it('post animal', function(done){
    superagent.post('http://localhost:3000/animal')
      .send({
	    "name": "The Lion King",
	    "vaccines" : [{
	      "date": 123123213,
	      "name": "Vaccine #15"
	    },{
	      "date": 123123212,
	      "name": "Vaccine #16"
	    }],
	    "owner": {
	      "name": "Mufasa"
	    }
	 })
      .end(function(e,res){
        // console.log(res.body)
        expect(e).to.eql(null)
        firstAnimalId = res.body._id
        expect(firstAnimalId).to.be.a('number')
        done()
      })
  })

    it('post other animal and check is the last one plus 1', function(done){
    superagent.post('http://localhost:3000/animal')
      .send({
	    "name": "The Lion King 2",
	    "vaccines" : [{
	      "date": 123123213,
	      "name": "Vaccine #15"
	    },{
	      "date": 123123212,
	      "name": "Vaccine #16"
	    }],
	    "owner": {
	      "name": "Mufasa"
	    }
	 })
      .end(function(e,res){
        // console.log(res.body)
        expect(e).to.eql(null)
        secondAnimalId = res.body._id
         expect(firstAnimalId).to.be.a('number')
        expect(secondAnimalId).to.eql((firstAnimalId+1))
        done()
      })
  })


   it('retrieves all animals and checks an animal structure', function(done){
    superagent.get('http://localhost:3000/animals/1')
      .end(function(e, res){
        expect(e).to.eql(null)
        expect(res.body.data.length).to.be.above(0)
        expect(res.body.data[0]).to.only.have.keys('name', 'vaccines', 'owner');
        done()
      })
  })


  it('retrieves all animals with wrong page and checks an animal structure and first page is returned', function(done){
    superagent.get('http://localhost:3000/animals/jhggjhghjg')
      .end(function(e, res){
        expect(e).to.eql(null)
        expect(res.body.page).to.eql('1')
        expect(res.body.data.length).to.be.above(0)
        expect(res.body.data[0]).to.only.have.keys('name', 'vaccines', 'owner');
        done()
      })
  })


   it('retrieves all animals with big page numer and checks an animal structure and last page is returned', function(done){
    superagent.get('http://localhost:3000/animals/123132132')
      .end(function(e, res){
        expect(e).to.eql(null)
        pageSize = res.body.pageSize
        page = res.body.page
        count = res.body.count
        expect(page).to.eql(Math.ceil(count/pageSize)+"")
        expect(res.body.data.length).to.be.above(0)
        expect(res.body.data[0]).to.only.have.keys('name', 'vaccines', 'owner');
        done()
      })
  })



})