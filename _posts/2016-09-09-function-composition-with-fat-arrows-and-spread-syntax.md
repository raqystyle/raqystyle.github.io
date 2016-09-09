---
layout:      post
title:       "The implementation of function composition using spread operator and fat-arrow syntax"
date:        2016-09-09 22:20
author:      Ivan Demchenko
categories:  fp
keywords:    "functional programming, javascript, es6, function composition, spread operator, refactoring, fat arrow"
description: "This article is about the way you can simplify your code using spread operator and fat-arrow functions"
permalink:   function-composition-with-fat-arrows-and-spread-syntax
---

In this note, I would like to demonstrate code refactoring of my implementation of the function that does function composition. We're going to use spread operator and fat-arrow functions.

First of all, it is not about writing shorter code or hacking around so that nobody understands it afterwards. If you don't understand it, just read about [fat-arrow functions](http://www-db.deis.unibo.it/courses/TW/DOCS/JS/developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions.html) and [spread syntax](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator).

I'll start with the initial, "old-school" implementation of `comp` function:

```js
function comp() {
  var fns = Array.prototype.slice.call(arguments);
  return function runComp() {
    var args = Array.prototype.slice.call(arguments);
    return fns.reduceRight(function reducer(res, fn) {
      return Array.isArray(res) ? fn.apply(this, res) : fn.call(this, res);
    }, args);
  };
}
```

It should take `N` function and produce function composition:

```js
const inc = x => x + 1;
comp(inc, inc)(4);
// > 4 + 1 + 1 = 6
```

Okay, what can be improved here? First of all, spread operator frees us from calling `slice` on `arguments`:

```js
function comp() {
  var fns = [...arguments];
  return function runComp() {
    var args = [...arguments]
    return fns.reduceRight(function reducer(res, fn) {
      return Array.isArray(res) ? fn.apply(this, res) : fn.call(this, res);
    }, args);
  };
}
```

Right. Next, take a look at `reducer` function. We either `apply` or `call` our `fn` function in there. However, in this case, `apply` is exactly what we need -- for the first time `args` will be an array and after that just a value. Having this in mind, we are coming to this:

```js
function comp() {
  var fns = [...arguments];
  return function runComp() {
    var args = [...arguments]
    return fns.reduceRight(function reducer(res, fn) {
      return fn.apply(this, [].concat(res));
    }, args);
  };
}
```

Okay, even better. Now, time to recall that wanted to use spread operator. Thus, this:

```js
fn.apply(this, [].concat(res))
```

becomes this:

```js
fn(...[].concat(res))
```

As the result of this transformation we have:

```js
function comp() {
  var fns = [...arguments];
  return function runComp() {
    var args = [...arguments]
    return fns.reduceRight(function reducer(res, fn) {
      return fn(...[].concat(res));
    }, args);
  };
}
```

Time for fat arrow syntax:

```js
function comp() {
  var fns = [...arguments];
  return function runComp() {
    var args = [...arguments]
    return fns.reduceRight((res, fn) => fn(...[].concat(res)), args);
  };
}
```

A small note about fat-arrow syntax: Such functions don't have their own `arguments` object, instead they refer to the one from the parent scope. But we don't care because we have spread operator:

```js
const comp = (...fns) => (...args) => fns.reduceRight((res, fn) => fn(...[].concat(res)), args);
```

Let's run our unit tests. We have them, right?

```js
const inc = x => x + 1;
comp(inc, inc)(4);
// > 4 + 1 + 1 = 6
```

Very nice. Thanks for reading and I hope it was useful.
