wttt
====

When This Then That
(My implementation of a javascript promise)

---

I wrote a rough draft of this in about an hour so not much thought went into it, 
but since then it's come along niecly.

Simple usage is something like

```javascript
wttt(function() {
    var that = this;
    
    console.log('waiting for something to happen');
    setTimeout(function() {
        console.log('that something happened')
        that.ok("here's", 'some', 'args');
    }, 100);
}).then(
    function(h, s, a) {
        console.log(h);
        console.log(s);
        console.log(a);
    }
).then(
    function() {
        var that = this;

        this.waitFor();
        console.log('waiting again...');
        setTimeout(function() {
            console.log('done waiting');
            that.ok();
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
            console.log('when using synchronously finished current function first');
        }
    }
).then(
    function(id) { console.log('good id:', id); },
    function(msg, id) { console.log(msg, id); }
).then(
    function() {
        console.log('this will fire unless the last `then` had a waitFor without a `this.ok()` or `this.err()`');
    }
);
 ```