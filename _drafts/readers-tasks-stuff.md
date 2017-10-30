0. Setup
```js
const Task = require('data.task');
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
3.1
```js
app =
    compose(lift, lift)(join)(gimmiReader(100), gimmiReader(1000))
```





















































































































































