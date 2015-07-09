/**
 * Promise chaining
 * - then() returns a promise that is resolved with what either onFulfilled or onRejected return.
 * - If onFulfilled or onRejected are missing, whatever they would have received is passed on to the promise returned by then().
 *
 * Only then() changes, when compared to promise-stand-alone.
 */

function ChainingPromise() {
  this.fulfillReactions = [];
  this.rejectReactions = [];
  this.promiseResult = undefined;
  this.promiseState = 'pending';
}

ChainingPromise.prototype.then = function (onFulfilled, onRejected) {
  var returnValue = new ChainingPromise();  // [new]
  var self = this;

  var fulfilledTask;
  if (typeof onFulfilled === 'function') {
    fulfilledTask = function () {
      var r = onFulfilled(self.promiseResult);
      returnValue.resolve(r); // [new]
    };
  } else {  // [new]
    fulfilledTask = function () {
      returnValue.resolve(self.promiseResult);
    };
  }

  var rejectedTask;
  if (typeof onRejected === 'function') {
    rejectedTask = function () {
      var r = onRejected(self.promiseResult);
      /// The result of onRejected is used to resolve (not reject!) returnValue
      returnValue.resolve(r);  // [new]  - Note: We resolve it!
    }
  } else { // [new]
    rejectedTask = function () {
      // Important: we must reject here!
      // Normally, the result of 'onRejected' is used to resolve.
      returnValue.reject(self.promiseResult);
    }
  }

  switch (this.promiseState) {
    case 'pending':
      this.fulfillReactions.push(fulfilledTask);
      this.rejectReactions.push(rejectedTask);
      break;
    case 'fulfilled':
      addToTaskQueue(fulfilledTask);
      break;
    case 'rejected':
      addToTaskQueue(rejectedTask);
      break;
  }
  return returnValue;
};

ChainingPromise.prototype.resolve = function (value) {
  if (this.promiseState !== 'pending') {
    // Makes sure the promise is resolved only once
    return;
  }

  this.promiseState = 'fulfilled';
  this.promiseResult = value;
  this._clearAndEnqueueReactions(this.fulfillReactions);
  return this;  // Returning 'this' enables chaining.
};

ChainingPromise.prototype.reject = function (error) {
  if (this.promiseState !== 'pending') {
    // Makes sure the promise is resolved only once
    return;
  }

  this.promiseState = 'rejected';
  this.promiseResult = error;
  this._clearAndEnqueueReactions(this.rejectReactions);
  return this;  // Returning 'this' enables chaining.
};

ChainingPromise.prototype._clearAndEnqueueReactions = function (reactions) {
  this.fulfillReactions = undefined;
  this.rejectReactions = undefined;
  reactions.map(addToTaskQueue);
};

function addToTaskQueue(task) {
  setTimeout(task, 0);
}

/**
 *  USAGE
 */

var pr = new ChainingPromise();
pr.resolve('abc');
pr.then(function (val) {
  console.log(val); // abc
});