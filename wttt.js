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
			api,
			Api = function() {
				this.waitFor = function waitFor(numberOfTicks) {
					waitTicks += +(numberOfTicks || 1);
				}
				this.ok = function() {
					waitTicks--;
					lastReturned = Array.prototype.slice.call(arguments);
					popQueueWhenDone();
				}

				this.err = function() {
					errorFlag = true;
					this.ok.apply(this, arguments);
				}
			};
			
		Api.prototype = this;
		api = new Api()
			
		api.waitFor(argsLength);
		currentlyExecuting = true;
		for (var i = 0; i < argsLength; i++) {
			args[i].call(api, api);
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
					queue.shift().ok.apply(api, [api].concat(lastReturned));
					currentlyExecuting = false;
				} else {
					var err;
					while (queue.length && !(err = queue.shift().err)) {} // do nothing
					if (err) {
						currentlyExecuting = true;
						err.apply(api, [api].concat(lastReturned));
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
