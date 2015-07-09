/**
 * Stand-alone Promise
 * - then() must work independently if the promise is settled either before or after it is called
 * - You can only resolve or reject it once
 */

function DemoPromise() {
  this.fulfillReactions = [];
  this.rejectReactions = [];
  this.promiseResult = undefined;
  this.promiseState = 'pending';
}

DemoPromise.prototype.then = function (onFulfilled, onRejected) {
  var self = this;

  var fulfilledTask = function () {
    onFulfilled(self.promiseResult);
  };

  var rejectedTask = function () {
    onRejected(self.promiseResult);
  };

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
};

DemoPromise.prototype.resolve = function (value) {
  if (this.promiseState !== 'pending') {
    // Makes sure the promise is resolved only once
    return;
  }

  this.promiseState = 'fulfilled';
  this.promiseResult = value;
  this._clearAndEnqueueReactions(this.fulfillReactions);
  return this;  // Returning 'this' enables chaining.
};

DemoPromise.prototype.reject = function (error) {
  if (this.promiseState !== 'pending') {
    // Makes sure the promise is resolved only once
    return;
  }

  this.promiseState = 'rejected';
  this.promiseResult = error;
  this._clearAndEnqueueReactions(this.rejectReactions);
  return this;  // Returning 'this' enables chaining.
};

DemoPromise.prototype._clearAndEnqueueReactions = function (reactions) {
  this.fulfillReactions = undefined;
  this.rejectReactions = undefined;
  reactions.map(addToTaskQueue);
};

function addToTaskQueue(taks) {
  setTimeout(task, 0);
}