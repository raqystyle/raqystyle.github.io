### Using Object.keys

Very often developers write a lot of unnecessary code. This makes the whole codebase very polluted with functions-wrappers, nested loops, nested conditions, etc. But all of this could have been omitted. Most of the time this happens because people do not know how to write cleaner code. Here I want to present a few examples from the real projects and propose a way of cleaning up a dirty solution.

Let's start with, perhaps, the most common and prominent candidate for refactoring:

```js
element.addEventListener('click', e => process(e.target));

// ...

let y = '...';
[1, 2, 3].map(function(x) {
  return process(x, y);
});

// ...

let btns = Array.from(document.querySelectorAll('.button'));
btns.forEach(btn => btn.addEventListener('click', e => doAction(e.target)))
```

Can you see what is common among all of these examples? There is always an intermediate function. It does not matter whether it is a fat function of ES6 or an old-school `function`.

Let's start with the first example. Here it is again:

```js
element.addEventListener('click', evt => process(evt.target));
```

This is what happens in it:

 * we call `addEventListener` on `element`.
 * in the callback we:
    * get the `target` property from the event
    * and pass it to the `process` function

*Note: For the sake of simplicity, let's assume the `process` function alerts the value of a certain attribute of a DOM element*

These are the problems I can see in it:

 * The callback is very specific to DOM event. Nobody stops us from having `target` in other objects.
 * There is an unnecessary anonymous function

Let's start from retrieving an arbitrary property from an arbitrary object. The implementation of such function is quite straightforward:

```js
function prop(propName, obj) {
  return obj[propName];
}

prop('target', evt) //> a DOM element
```

Also, we have to extract the value of the DOM element:

```js
function getAttr(attrName, elem) {
  return elem.getAttribute(attrName);
}

getAttr('href', linkEl) //> http://...
```

Good! Let's think again about what is happening in the callback. This time step by step:

 * get property `target` of the `evt`,
 * read a value of the specified attribute of the target element of the event,
 * process the value (`alert` it).

We can see there is something like a conveyor where we have to provide `evt` at the beginning and at the end something will be alerted. In functional programming this is called `function composition`. Here is how it works:

`x => f(g(x)) === compose(f, g)`
`x => f(g(b(x))) === compose(f, g, b)`
`x => f(...(z(x))...) === compose(f, ..., z)`

You can probably see that there's no `x` on the right hand of the equations. The `compose` function returns another function that is waiting for the arguments for the outer right one.


```js
public isValid():boolean {
    var vocabulary = this.getVocabulary();

    for (var name in vocabulary) {
        if (!vocabulary[name]) {
            return false;
        }
    }

    return true;
}
```

Can be simplified to this:

```typescript
public isValid():boolean {
    var vocabulary = this.getVocabulary();
    return Object.keys(vocabulary).every((key:string) => !!vocabulary[key]);
}
```

### Functional way

From here

```typescript
private filterAvailableTemplates():Template[] {
    var selectedTopics:{id:TopicId}[] = this.eventHandler.getSelectedTopics();
    var selectedActivityTypeId:ActivityTypeId = this.eventHandler.getSelectedActivityTypeId();

    // return all templates except...
    return _.filter(this.availableTemplates, (template:Template) => {
        // ... the ones with mismatching related activity type ...
        if (!_(template.activityTypes).contains(selectedActivityTypeId)) {
            return false;
        }

        // ... and the ones with mismatching related topics.
        var templateTopics = _.pluck(template.topics, 'id');
        for (var i = 0; i < selectedTopics.length; i++) {
            // one matching topic is enough the have the two arrays matching
            if (_(templateTopics).contains(selectedTopics[i].id)) {
                return true;
            }
        }

        return false;
    });
}
```

To here


```typescript
export function allTrue(...fns) {
    return (x) => fns.reduce((acc, fn) => acc && (acc = fn(x)), true);
}

export function inArray<a>(xs:a[], y:a):boolean {
    return xs.indexOf(y) > -1;
}

export function props(id:string, xs:any[]) {
    return xs.map((x) => x[id]);
}

private templateBoundedToActivity(providedId:any):Function {
    return (template:Template):boolean => template.activityTypes.some(eq(providedId));
}

private templateBoundedToTopics(providedIds:any[]):Function {
    let ids = curry(props)('id');
    let inArr = curry(inArray);
    return (template:Template):boolean => ids(template.topics).some(inArr(providedIds));
}

private filterAvailableTemplates():Template[] {
    let ids = curry(props)('id');

    let selectedTopicsIds:TopicId[] = ids(this.eventHandler.getSelectedTopics());
    let selectedActivityTypeId:ActivityTypeId = this.eventHandler.getSelectedActivityTypeId();
    let checkTemplate = allTrue(this.templateBoundedToActivity(selectedActivityTypeId), this.templateBoundedToTopics(selectedTopicsIds));

    return this.availableTemplates.filter(checkTemplate);
}
```
