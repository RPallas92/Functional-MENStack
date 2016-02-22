# Functional-MENStack
REST API application with Node, Express, MongoDB, Ramda and Mocha

## Quick start

First, start mongo in a shell:

```
mongod
```
Then, import the data:

```
sh db_scripts/importData.sh
```

Finally, run the tests:

```
npm test
```

Or run the server:

```
npm start
```

And navigate to http://localhost:3000/animals/1

You can also post new animals.
POST to http://localhost:3000/animal

And the body:
```
{
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
 }
```


## Architecture

The server is divided in 3 layers, following Martin Fowler's Presentation Domain Data Layering.
http://martinfowler.com/bliki/PresentationDomainDataLayering.html

### Domain layer

Here are the Use Cases. There are only plain Javascript objets. It's framework agnostic and pure (has no side effects).

### Data layer

All data needed for the application comes from this layer through a Animalrepository,
that uses a Repository Pattern, whose datasource can be changed through a factory. This layer is also pure, it has no side effects.
All async operations are done with a Task or Future, that are like a promise but pure.

### Api layer or presentation layer

This layer exposes a public REST API and executes the Use Cases. It's impure and executes the side effects from the Tasks.

