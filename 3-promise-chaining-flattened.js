/**
 * Flattened Promise chaining
 * - resolve() “flattens” parameter `value` if it is a promise (the state of`this` becomes locked in on `value`)
 */

function FlattenedChainingPromise() {
  this.fulfillReactions = [];
  this.rejectReactions = [];
  this.promiseResult = undefined;
  this.promiseState = 'pending';
  // Settled of locked-in?
  this.alreadyResolved = false;
}

FlattenedChainingPromise.prototype.then = function (onFulfilled, onRejected) {
  var returnValue = new FlattenedChainingPromise();  // [new]
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

FlattenedChainingPromise.prototype.resolve = function (value) { // [new]
  if (this.alreadyResolved) {
    return;
  }

  this.alreadyResolved = true;
  this._doResolve(value);
  return this;  // enable chaining
};

FlattenedChainingPromise.prototype._doResolve = function (value) { // [new]
  var self = this;
  // Is `value` thenable?
  if (value !== null && typeof value === 'object' && 'then' in value) {
    // Forward fulfillments and rejections from `value` to `this`.
    // Added as a test (vs. done immediately) to preserve asunc semantics.
    addToTaskQueue(function () {
      value.then(
        function onFulfilled(result) {
          self._doResolve(result);
        },
        function onRejected(error) {
          self._doReject(error);
        }
      );
    });
  } else {
    this.promiseState = 'fulfilled';
    this.promiseResult = value;
    this._clearAndEnqueueReactions(this.fulfillReactions);
  }
};


FlattenedChainingPromise.prototype.reject = function (error) {  // [new]
  if (this.alreadyResolved) {
    return;
  }

  this.alreadyResolved = true;
  this._doReject(error);
  return this;  // enable chaining
};

FlattenedChainingPromise.prototype._doReject = function (error) {  // [new]
  this.promiseState = 'rejected';
  this.promiseResult = error;
  this._clearAndEnqueueReactions(this.rejectReactions);
};


FlattenedChainingPromise.prototype._clearAndEnqueueReactions = function (reactions) {
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

var pr = new FlattenedChainingPromise();
pr.resolve('abc');
pr.then(function (val) {
  console.log(val); // abc
});