## Module flaw #########################################################
#
# Lightweight and simple way of creating errors in JS.
#
# 
# Copyright (c) 2013 Quildreen "Sorella" Motta <quildreen@gmail.com>
# 
# Permission is hereby granted, free of charge, to any person
# obtaining a copy of this software and associated documentation files
# (the "Software"), to deal in the Software without restriction,
# including without limitation the rights to use, copy, modify, merge,
# publish, distribute, sublicense, and/or sell copies of the Software,
# and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


### λ make-from
# Constructs an `Error` object from a given Error type.
#
# You can pass an optional object with additional properties that will
# be added to the error object.
#
# :: Fun -> String -> String -> Error
make-from = (type, name, message) -->
  options = arguments[3] or {}
  (type.call ^^type.prototype, message) <<< { name: name } <<< options


### λ make
# Constructs an `Error` object.
#
# :: String -> String -> Error
make = (name, message) --> make-from Error, name, message, arguments[2]


### λ raise
# Makes `throw` usable in an expression.
#
# :: Error -> ()
raise = (error) -> throw error



### -- Exports ---------------------------------------------------------
module.exports = make <<< { from: make-from, raise, make }
