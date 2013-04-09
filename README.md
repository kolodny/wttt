wttt
====

When This Then That
(My implementation of a javascript promise)

---

I wrote a rough draft of this in about an hour so not much thought went into it, 
but since then it's come along niecly.

Sample usage is something like this:

```javascript
wttt(function(api) {
    console.log('waiting for something to happen');
    setTimeout(function() {
        console.log('that something happened')
        api.ok("here's", 'some', 'args');
    }, 100);
}).then(
    function(api, h, s, a) {
        console.log(h);
        console.log(s);
        console.log(a);
    }
).then(
    function(api) {
        this.waitFor();
        console.log('waiting again...');
        setTimeout(function() {
            console.log('done waiting');
            api.ok();
        }, 100);
    }
).then(
    function() {
        var id = false

        this.waitFor();
        if (id) {
            // ...
            this.ok(id);
        } else {
            console.log('about to `this.err();`');
            this.err('invalid id', id); // uh oh
            console.log('when using synchronously finish current function first');
        }
    }
).then(
    function(api, id) { console.log('good id:', id); },
    function(api, msg, id) { console.log(msg, id); }
).then(
    function() {
        console.log('this will fire unless the last `then` had a waitFor without a `this.ok()` or `this.err()`');
    }
);
 ```