# Simple promise library
A simple implementation of a promise library.

### Promise: Stand-alone
![Promise: Stand-alone](http://1.bp.blogspot.com/-YtdGXGH__gk/VDEiTAXcqtI/AAAAAAAAA3s/3IwMMkVJSps/s1600/promise1_simple.jpg)

### Promise: Chaining
![Promise: Chaining](http://2.bp.blogspot.com/-pZ2agjPL54Y/VDEiTUClecI/AAAAAAAAA30/3zAmth5qnrE/s1600/promise2_chaining.jpg)

### Promise: Chaining + Flattened
![Promise: Chaining + Flattened](http://2.bp.blogspot.com/-yuykRwpwHFw/VDEiT1k2s9I/AAAAAAAAA34/AN8IZI5uoGw/s1600/promise3_flattening.jpg)

### Promise: Chaining + Flattened
![Promise: Chaining + Flattened + Exceptions](http://2.bp.blogspot.com/-x6hBT5B_yw4/VDEiULOJwII/AAAAAAAAA4E/aUTml-VNKRk/s1600/promise4_exceptions.jpg)

If we wanted to turn this into an actual promise implementation, we’d still need to implement the [revealing constructor pattern](https://blog.domenic.me/the-revealing-constructor-pattern/):

ES6 promises are not resolved and rejected via methods, but via functions that are handed to the executor, the callback parameter of the constructor.

#### Reference Links: 
https://promisesaplus.com/

http://www.2ality.com/2014/10/es6-promises-api.html

http://www.html5rocks.com/en/tutorials/es6/promises/

https://www.promisejs.org/patterns/

http://www.html5rocks.com/en/tutorials/developertools/async-call-stack/