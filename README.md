Yongo [![TypeScript definitions on DefinitelyTyped](http://definitelytyped.org/badges/standard.svg)](http://definitelytyped.org)
=========
*A ECMAScript 7 Decorator-Based Model Library for server and browser*

**This library is a work in progress and will likely change before the first major release.**

Are you tired of having to manage your state all through your APP with non friendly codes? Are you tired of doing the same work for every model your server gives to you (make the request, parse, save at the state, validate...)? Are you using diverse services to retrieve your models (REST, firebase...)? Tired of having no structure on your client?

Yongo gives you a great interface to deal with all this problems. Now with a simple class with decorators, you can manage associations, rest connections, manage reactivity and solid structure taking advantage of ES2016 proposals.

The main focus is to taking advantage of ECMAScript 2017 and giving you a simple and powerful interface. As ES2017 decorators are in an early stage, this library is meant to be used with [BabelJS](https://babeljs.io/) or [TypeScript](http://www.typescriptlang.org/). We recomend BabelJS for browser and Typescript for serverside. We'll give you a proper BabelJS config to take advantage of this. Typescript should work out of the box if you have a node version superior to 7. If you have a prior version of nodejs, you can try also babelJS for node!

# Getting Started

Get the library via yarn using the following command:

```sh
$ yarn add yongo
```
*We use [Yarn](https://yarnpkg.com/) as it's a fast, reliable and useful pkg manager alternative to npm*



# Why Model-Based Validations?

Some client-side libraries opt to put validations directly in markup. This is fine when you're working with a relatively small code-base or on a relatively small team. However, in larger projects, this can quickly become unmaintainable. Here are a few pitfalls with this approach:

1. If the model is reused across multiple pages (i.e. in an [AngularJS](https://angularjs.org/) or [KnockoutJS](http://knockoutjs.com/) app), you'll now have to duplicate the markup.
2. Users can easily modify markup using whatever dev tools their browsers provide to remove validation attributes.
3. It's much more difficult to test the DOM than it is to test JavaScript.
4. What if you're working on an [isomorphic application](http://isomorphic.net/) in [NodeJS](https://nodejs.org/en/) where you want to share model code across the server-side and client-side? Are you going to copy and paste validation logic across the two layers?
5. Defining validations in markup can become quite verbose.

With **decorum**, addressing those concerns becomes quite simple and straight forward.

# Documentation
*All examles are in plain JavaScript as they are compatible with TypeScript*

* [Yongo Configuration](#yongo-configuration)

**Note:** Decorator syntax is implemented, but the package import semantics are still a work in progress. The library is currently only available as a global variable off of `window.decorum`.

## Yongo configuration

Is as easy as, wherever you

```js
import Yongo from 'yongo';
import Vue from 'vue'; // in case you

Yongo.setConfig({
  baseUrl: 'https://localhost:8080', // for REST connections. Optional
  framework: Vue, // in case you use some reactive framework. Optional
});
```
| Configuration | Explanation                                                                   | Exaple              |
|---------------|-------------------------------------------------------------------------------|---------------------|
| baseUrl       | This is the baseUrl to be used with axios. Axios creates a connection object to allow us to make connections to the server, and this url is the baseUrl for your connection. | `https://my-dev.server.com/root/dir` |
| framework     | As our aim is to be used in client and server, we allow you to specify the framework you use and we'll find the reactivity function that has to be used. For now we only allow Vue to be used in this configuration field. If you want some reactivity system that is not supported, feel free to open a issue. | `Vue`                                |
