---
layout:     post
title:      "Import Sass modules from NPM"
author:     Ivan Demchenko
date:       2016-05-06 11:53
categories: sass
keywords:   "sass, node_modules, npm, loader, node-sass"
desc:       "In this short note I will share my way of loading Sass modules from NPM"
permalink:  import-sass-modules-from-npm
---

When writing Sass code, you can't just do `@import "some-npm-module"`. However, there's a trick how to make it work with the little effort.

The preface is that I'm working on an internal library. Our users want to use our Sass code as well as compiled CSS. Thus, the problem is that Sass can not resolve npm-dependency when doing `@import`.

So, Instead of doing `@import "some-npm-module"`, I do `@import "npm:some-npm-module"`. Then, in grunt-sass config I have this:

```js
  options: {
    // your option in here,
    // This is a new feature in here in https://www.npmjs.com/package/node-sass#importer--v200---experimental
    importer: function(url, _, done) {
      switch(url.split(':')[0].toLowerCase()) {
        case 'npm':
          return done({ file: require.resolve(url.split(':')[1]) });
          break;
        default:
          return done(null);
          break;
      }
    }
  }
```

Now you can specify that this particular module should be loaded from `node_modules`. The downside, however, is that others, who use your library (which contains npm dependency) should add this function in their config as well. But I think, this is just a matter of documentation.
