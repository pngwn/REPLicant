# REPLicant - Svelte Summit 2020

This is the source code for a talk I gave at Svelte Summit 2020. This is actual code I wrote during the talk with a few later additions to clean things up. I will add a link to the video when it is published.

## Table of Contents

- [Differences from the talk](#differences-from-the-talk)
- [Usage](#usage)
- [Commits](#commits)
  - [Initial setup and config](#initial-setup-and-config)
  - [REPL code editor](#repl-code-editor)
  - [Tabbed interface](#tabbed-interface)
  - [New component creation](#new-component-creation)
  - [Web Worker setup](#web-worker-setup)
  - [Svelte package imports](#svelte-package-imports)
  - [Local package imports](#local-package-imports)
  - [Iframe setup](#iframe-setup)
  - [Evaluate and render](#evaluate-and-render)
  - [NPM module imports](#npm-module-imports)
- [What next?](#what-next)
- [Further reading](#further-reading)

## Differences from the talk

The only thing this app does that the version in the talk doesn't is resolve npm module imports to a CDN. So `import x from 'randommodule'` works in this app too. You can read more details about this [here](#npm-module-imports).

## Usage

_Note: I use `pnpm` but this will probably work fine with `yarn` or `npm` depsite the lockfile warnings._

Clone and install

```bash
git clone https://github.com/pngwn/REPLicant.git && cd REPLicant

pnpm i # or yarn or npm i
```

Run the dev server and play around:

```bash
pnpm dev
```

## Commits

### initial setup and config

This commit setups the basics. It is the [svelte-template]() after running the `setupTypescript` script with a few extra config files (`.prettierrc.yaml` and `.gitignore`).

We also add some basic typescript interfaces and data structures for the REPL.

[Browse the repo at this point](https://github.com/pngwn/REPLicant/tree/534b9fe0527fc14c58a7551a9a8196c4468a1040)\
[View the commit](https://github.com/pngwn/REPLicant/commit/534b9fe0527fc14c58a7551a9a8196c4468a1040)

### repl code editor

This commit adds an input, which is our rudimentary code editor and keeps the contents of the input in sync with the component state we setup earlier.

[Browse the repo at this point](https://github.com/pngwn/REPLicant/tree/a26696c2ce634979d9481fa36b44d1529d7f6890)\
[View the diff](https://github.com/pngwn/REPLicant/commit/a26696c2ce634979d9481fa36b44d1529d7f6890)

### tabbed interface

This commit adds a tabbed UI allowing us to switch between the different components, marking them as active. The 'active' component is the component we are currently editing in the REPL.

[Browse the repo at this point](https://github.com/pngwn/REPLicant/tree/f87252385b84b84daa7534353c04d8665dd32b60)\
[View the diff](https://github.com/pngwn/REPLicant/commit/f87252385b84b84daa7534353c04d8665dd32b60)

### new component creation

This commit adds a button allowing the creation of a new component in the REPL as well as accompanying logic. This only supports the creation of svelte components (`.svelte` files) and the name is automatically generated.

[Browse the repo at this point](https://github.com/pngwn/REPLicant/tree/fd783d86fefdf85847b2805d57887c569fa677ac)\
[View the diff](https://github.com/pngwn/REPLicant/commit/fd783d86fefdf85847b2805d57887c569fa677ac)

### web worker setup

This commit sets up the basic web worker boilerplate as well as some simple messaging to make sure things are working as expected.

It also adds another entrypoint in the rollup config, to bundle the worker file seperately.

[Browse the repo at this point](https://github.com/pngwn/REPLicant/tree/abd59742d41d68618d9b61945711429ae70b7515)\
[View the diff](https://github.com/pngwn/REPLicant/commit/abd59742d41d68618d9b61945711429ae70b7515)

### Svelte package imports

This commit setups the rollup basics that we need and resolves svelte imports to the CDN we are using (jsdelivr) as we have no file system. It resolve the follwing cases:

- plain 'svelte' imports: `import { onMount } from 'svelte';`
- svelte 'sub imports': `import { writable } from 'svelte/writable';`
- relative imports from a svelte package: `import x from './file.js';` where the importing module is module is a svelte module that we handled above.

In addition to resolving the paths, it also fetches the source code from the cdn and passes it to the bundler.

[Browse the repo at this point](https://github.com/pngwn/REPLicant/tree/1899a92812683bd12f3063ee51dae7f9f2795e15)\
[View the diff](https://github.com/pngwn/REPLicant/commit/1899a92812683bd12f3063ee51dae7f9f2795e15)

### Local package imports

This commit resolves local REPL imports that don't exist anywhere except in memory. These are the components that the user is creating live in the browser.

It also compiles svelte components to valid javascript and returns that to the bundler.

And finally it passes this final bundle back to the main thread.

[Browse the repo at this point](https://github.com/pngwn/REPLicant/tree/28f54dbd8af541374427b61d643b1729b88a4dad)\
[View the diff](https://github.com/pngwn/REPLicant/commit/28f54dbd8af541374427b61d643b1729b88a4dad)

### Iframe setup

This commit sets up the basic ifram boilerplate, giving it a valid `srcdoc`, listening for any posted messages inside. In the parent component (outside of the iframe) we pass a simple message down to check everything is working.

[Browse the repo at this point](https://github.com/pngwn/REPLicant/tree/e0362b500ee191c68aec9b9a0fa1c7f5fc3b8465)\
[View the diff](https://github.com/pngwn/REPLicant/commit/e0362b500ee191c68aec9b9a0fa1c7f5fc3b8465)

### Evaluate and render

This commit evaluates the bundle in the iframe via a dynamic import using blob urls and then renders the component to the page.

[Browse the repo at this point](https://github.com/pngwn/REPLicant/tree/9709717a52577d050a7eec5a53ba6c6ddbaf5196)\
[View the diff](https://github.com/pngwn/REPLicant/commit/9709717a52577d050a7eec5a53ba6c6ddbaf5196)

### NPM module imports

_This did not appear in the talk_

This is similar to the earlier resolution steps. This commit resolves npm module imports to the CDN. It does this by fetching the `package.json` and reading it to work out where teh entry point is. This enables `import x from 'any-random-package';`.

Unlike with the svelte packages, where we can easily workout what the structure looks like, the entrypoint for a given npm module can vary significantly. We just get the `package.json` to remove any ambiguity.

This also works for Svelte-specific packages that are using the `svelte` field to point to uncompile `.svelte` files.

[Browse the repo at this point](https://github.com/pngwn/REPLicant/tree/adc1028989503ace1cac410df2b5cfbc4b46f488)\
[View the diff](https://github.com/pngwn/REPLicant/commit/adc1028989503ace1cac410df2b5cfbc4b46f488)

## What next?

This is just the start, from here you can go on to add whatever features you like.

Maybe you want allow importing different file types, that would just require a new transform that convert that format into JavaScript, just like we did with `.svelte` files.

Perhaps you'd like to add additional UI features. Draggable tabs, more user feedback. Syntax highlighting and code completion could be added by using a dedicated code editor such as [monaco-editor](https://microsoft.github.io/monaco-editor/) or [codemirror](https://codemirror.net/)(which is used by the official Svelte REPL).

Maybe you want to improve the performance of the data-loading and compilation by adding some caching for those behaviours inside the web worker.

The list is endless, check the [repl on the Svelte site](https://svelte.dev/repl/) for inspiration but don't let that limit you!

## Further reading

- To understand the Svelte API itself - [tutorial](https://svelte.dev/tutorial/) - [docs](https://svelte.dev/docs/)
- [Svelte REPL](https://svelte.dev/repl/)
- [mdsvex Playground](https://mdsvex.com/playground)
- [Try Ruby](https://try.ruby-lang.org/)
- [Tour of Go](https://tour.golang.org/welcome/1)
- [Rust Playground](https://play.rust-lang.org/)
- [TypesScript Playground](https://www.typescriptlang.org/play)
- [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [Blobs](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [Blob URLS](https://javascript.info/blob)
- [Embedding content and iFrames](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Other_embedding_technologies)
- [Communicating with iFrames](https://javascript.info/cross-window-communication)

## Questions

If you have questions or feedback then feel to file an issue here, bug me on twitter ([@evilpingwin](https://twitter.com/evilpingwin)), or you can grab me on discord (@pngwn).
