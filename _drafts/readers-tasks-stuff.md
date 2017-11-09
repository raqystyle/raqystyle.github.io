0. Setup
```js
const Task = require('data.task');
const Either = require('data.either');
const Reader = require('fantasy-readers');
const { lift, curry } = require('ramda');

// Int -> String -> Task () String
const gimmiTask = (delay, data) =>
    new Task((rej, res) => setTimeout(res, delay, data));

// Int -> Reader Env (Task () String)
const gimmiReader = (delay) =>
    new Reader(env => gimmiTask(delay, env.pref + ' task reader'));

// String -> String -> String
const join = curry((s1, s2) => s1 + ' : ' + s2);

// implementation of "app"

app.run({ pref: 'TR:' })
   .fork(console.error, console.log);
```
1.
```js
app =
    gimmiReader(100) // Reader Env (Task () String)
        .chain(t1 => // t1 :: Task () String
            gimmiReader(1000) // Reader Env (Task () String)
                .map(t2 => // t2 :: Task () String
                    t1.chain(s1 => // s :: String
                        t2.map(s2 =>
                            join(s1, s2)
                        ) // Task () (String -> String)
                    )
                )
        )
``` 
2.
```js
app =
    gimmiReader(100) // Reader Env (Task () String)
        .chain(t1 => // t1 :: Task () String
            gimmiReader(1000) // Reader Env (Task () String)
                .map(t2 => // t2 :: Task () String
                    lift(join)(t1, t2) // Task () String
                )
        )
```
3.
```js
app =
    lift(lift(join))(gimmiReader(100), gimmiReader(1000))
```

or

```js
app =
    compose(lift, lift)(join)(gimmiReader(100), gimmiReader(1000))
```

Anyway, we've got to the point where we have composition of lifts. This code will work just fine. However, if you stick more monads together, you need to lift as many times as many monads you have. In order to avoid this, we can use Monad Transformers. Don't mind the name, only sounds complicated.

```js
// this is a new type, new monad!
const ReaderEither = Reader.ReaderT(Either);
```

It is like a normal `Reader`, the only difference is that `map` and `chain` takes you straight to the data that "inner" either holds. However, if you `run` it you'll get `Either` back.

As such we can do now something like this:

```
// -- validateRequest :: ReaderT Env (Either String) String
const validateRequest = () =>
  ReaderEither(env =>
    env.someData && env.someData.length
      ? Either.Right(env.someData)
      : Either.Left('The request should contain some data...')
);
```



### Reading list

* [Monad Transformers Explained](https://wiki.haskell.org/Monad_Transformers_Explained)
* [A Gentle Introduction to Monad Transformers](https://github.com/kqr/gists/blob/master/articles/gentle-introduction-monad-transformers.md)
* PDF: [Monad Transformers Step by Step](https://page.mi.fu-berlin.de/scravy/realworldhaskell/materialien/monad-transformers-step-by-step.pdf)
* [WikiBooks: Monad transformers](https://en.wikibooks.org/wiki/Haskell/Monad_transformers)















































































































































