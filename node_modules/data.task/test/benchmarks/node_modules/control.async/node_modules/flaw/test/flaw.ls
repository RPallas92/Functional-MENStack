global <<< require 'claire-mocha'
{ for-all, as-generator, choice, data: { Id, Str, Map } } = require 'claire'
{ expect } = require 'chai'
{ make, from, raise } = require '../'

all-errors = [ Error
             , Eval-error
             , Range-error
             , Reference-error
             , Syntax-error
             , Type-error
             , URI-error
             ]

Errors = (choice ...(all-errors.map (x) ->-> x))

keys = Object.keys
u = it

describe '{} Flaw' ->
  describe 'λ make-from' ->
    u 'Should be an instance of the given error type.' ->
       all-errors.map -> expect (from it, '', '') .instance-of it

    o 'Should have the message it\'s given.' ->
       for-all Errors, Id, Str
       .satisfy (e, n, m) -> (from e, n, m).message is m

    o 'Should have the name it\'s given.' ->
       for-all Errors, Id, Str
       .satisfy (e, n, m) -> (from e, n, m).name is n

    o 'Should have a proper stack trace.' ->
       for-all Errors, Id, Str
       .satisfy (e, n, m) -> (from e, n, m).stack != void

    o 'Should have the options it\'s given.' ->
       for-all Errors, Id, Str, (Map Str)
       .given (e,n,m,o) -> (keys o).length > 0
       .satisfy (e,n,m,o) -> expect (from e,n,m,o) .to.include.keys (keys o)


  describe 'λ make' ->
    u 'Should be an instance of Error.' ->
       expect (make '', '') .instance-of Error
       

  describe 'λ raise' ->
    o 'Should throw the error.' ->
       for-all Errors
       .satisfy (e,n,m,o) ->
         e = from e,n,m,o
         try
           raise e
           false
         catch x
           x is e
