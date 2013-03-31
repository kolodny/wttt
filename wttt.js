// When This Then That (WTTT)

// Copyright 2013 Moshe Kolodny
// Released under the MIT license
(function(undefined) {
	
	var justReturnThis = false;
	var wttt = function() {
		if (!(this instanceof wttt)) {
			justReturnThis = true;
			var newInstance = new wttt();
			justReturnThis = false;
			wttt.apply(newInstance, arguments);
			return newInstance;
		}
		if (justReturnThis) { return this; }
		var 
			args = arguments,
			argsLength = args.length,
			queue = [],
			waitTicks = 0,
			errorFlag = false,
			lastReturned,
			currentlyExecuting,
			contextForFunctions,
			Api = function() {
				this.waitFor = function waitFor(numberOfTicks) {
					waitTicks += +(numberOfTicks || 1);
				}
				this.ok = function ok() {
					waitTicks--;
					lastReturned = arguments;
					popQueueWhenDone();
				}

				this.err = function err() {
					errorFlag = true;
					this.ok.apply(this, arguments);
				}
			};
			
		Api.prototype = this;
		contextForFunctions = new Api()
			
		contextForFunctions.waitFor(argsLength);
		currentlyExecuting = true;
		for (var i = 0; i < argsLength; i++) {
			args[i].call(contextForFunctions);
		}
		currentlyExecuting = false;
		
		this.then = function then(ok, err) {
			queue.push({ok: ok, err: err });
			popQueueWhenDone();
			return this;
		}
		
		function popQueueWhenDone() {
			if (!currentlyExecuting && waitTicks <= 0 && queue.length) {
				if (!errorFlag) {
					currentlyExecuting = true;
					queue.shift().ok.apply(contextForFunctions, lastReturned);
					currentlyExecuting = false;
				} else {
					var err;
					while (queue.length && (err = queue.shift().err) !== undefined) { /* do nothing */ }
					if (err) {
						currentlyExecuting = true;
						err.apply(contextForFunctions, lastReturned);
						currentlyExecuting = false;
						errorFlag = false;
					}
				}
				popQueueWhenDone();
			}
		}
		
	}
	window.wttt = wttt;
})();
