# Moodal

A pure JavaScript library for _modal dialog._

[![NPM](https://nodei.co/npm/moodal.png?compact=true)](https://nodei.co/npm/moodal/)

## [![npm version](https://badge.fury.io/js/moodal.svg)](https://badge.fury.io/js/moodal)

## Get Started

### 1. Install

Using npm

```bash
npm install moodal --save
# or
yarn add moodal
```

### 2. Load JavaScript

#### ES modules

```js
import Moodal from 'moodal';
```

Or write in html

```html
<!-- ES modue in browser -->
<script type=module src=node_modules/moodal/lib/esm/moodal.mjs></script>
```

```html
<!-- CDN -->
<script
    src="https://unpkg.com/moodal/lib/standalone/moodal.min.js"
    defer
></script>
```

### 3. Load CSS

Load into your scss

```scss
@import 'node_modules/moodal/lib/scss/moodal-core.scss';
```

Or write in html

```html
<!-- Node modules -->
<link rel="stylesheet" href="node_modules/moodal/lib/css/moodal-core.css" />
```

```html
<!-- CDN -->
<link
    rel="stylesheet"
    href="https://unpkg.com/moodal/lib/css/moodal-core.css"
/>
```

### 4. Add markup

-   `[data-moodal-container]` element is requied. And this shoud be left empty. (will be rewrited innerHTML)
-   `[data-moodal-close]` elements can be anywhere. The modal is close on it clicked.

```html
<div class="c-moodal" tabindex="-1" aria-hidden="true">
    <div class="c-moodal__bg"></div>
    <div class="c-moodal__loader">...Loading</div>
    <div class="c-moodal__container">
        <!-- close modal on `data-moodal-close` element clicked -->
        <div class="c-moodal__overlay" data-moodal-close></div>
        <div class="c-moodal__inner">
            <div class="c-moodal__body">
                <button class="c-moodal__close" type="button" data-moodal-close>
                    Close
                </button>
                <div class="c-moodal__content" data-moodal-container>
                    <!-- Will be appended content here -->
                </div>
            </div>
        </div>
    </div>
</div>
```

Minimum

```html
<div class="c-moodal" tabindex="-1" aria-hidden="true">
    <div class="c-moodal__container">
        <div class="c-moodal__inner">
            <div class="c-moodal__body">
                <div class="c-moodal__content" data-moodal-container></div>
            </div>
        </div>
    </div>
</div>
```

### 5. Initialize Core
`new Moodal( wrapperElement: string|HTMLElement, <options>)`;

```js
// Init Core
const myModal = new Moodal('.c-modal'); // selector or HTMLElement
```

```js
// Init Core with options
const myModal = new Moodal('.c-moodal', {
    noBackgroundScroll: true,
    backgroundElement: document.querySelector('.page-wrapper'),
    waitContentLoaded: true,
    stateClasses: {
        isVissible: 'is-vissible',
        isLoading: 'is-loading'
    }
});
```

### 6. Add Controller
`moodal.addController(<params>)`
-   **Example 1:** Get content from DOM element in the page.

```html
<!-- controller -->
<button type="button" data-moodal-anchor="myContent">
    Show Modal of `myContent`
</button>
<!-- template for content -->
<template id="myContent" style="display:none;">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit,...</p>
</template>
```

```js
const modalCtrl = myModal.addController({
    controllerAttr: 'data-moodal-anchor',
    getContent: trigger => {
        // `trigger` is value of attribute `data-moodal-anchor`.
        const targetEl = document.getElementById(trigger);
        if (!targetEl) return;
        const content = document.createElement('div');
        content.innerHTML = targetEl.innerHTML;
        // Must return a HTMLElement
        return content;
    }
});

// You can show/hide modal by JavaScript
modalCtrl.show('myContent');
modalCtrl.hide();
```

-   **Example 2:** Get content from page by Ajax / axios

```html
<!-- controller -->
<button data-moodal-ajax="target.html">
    Show Modal of `target.html`
</button>
```

```js
import axios from 'axios';

const modalCtrlAjax = myModal.addController({
    controllerAttr: 'data-moodal-ajax',
    getContent: trigger => {
        // If you want async function, return Promise object
        return new Promise( (resolve, rejects) => {
           (async () => {
                try {
                    const res = await axios.get(trigger, {
                        responseType: 'document'
                    });
                    const content = res.data.querySelector('main');
                    if (content) {
                        resolve(content);
                    } else {
                        throw new Error('No Content!');
                    }
                } catch (error) {
                    rejects(error);
                }
            })();
        });
    }
});
```

## Life cycle
![life cycle diagram](./assets/lifecycle.png)


---

## Core Params


| Param Name              | Type               | Default                   | Desc                                                                                                                                 |
| ----------------------- | ------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| containerSelector         | string             | "\[data-moodal-container\]" | Selector for the element appended content                                                                                            |
| hideOnClickSelector     | string             | "\[data-moodal-close\]"   | Selector for elements that close modal when clicked                                                                                  |
| noBackgroundScroll      | boolean            | false                     | if true, fix scrolling element                                                                                                       |
| backgroundElement       | HTMLElement        | undefined                 | The element you want to stop scrolling. ex. `document.querySelector(".page-wrapper")` <br>\* require if `noBackgroundScroll` is true |
| waitContentLoaded       | boolean            | true                      | if true, the modal is shown after `<img>` or `<iframe>` element is loaded.                                                           |
| stateClasses            | Object             |                           | Classes for showing / loading state                                                                                                  |
| stateClasses.isVissible | string \| string[] | is-vissible               | Class on showing modal                                                                                                               |
| stateClasses.isLoading  | string \| string[] | is-loading                | Class on loading modal                                                                                                               |
| logLevel  | number | 2                  | 0 = off, 1 = error, 2 = warning, 3 = info, 4 = debug                                                                                                           |
## Controller Params

```js
myModal.addController({
    getContent: trigger => {
        // You must make content element form `trigger`
        // ...some code
        return content; // return HTMLElement
    },
    controllerAttr: 'data-modal-control'
});
```

| Param Name        | Type                                                       | Default                        | Desc                                                |
| ----------------- | ---------------------------------------------------------- | ------------------------------ | --------------------------------------------------- |
| getContent        | (trigger: string) => Promise\<HTMLElement\> \| HTMLElement | undefind **\* required**       | Get the content(HTMLElement) from `trigger` argment |
| controllerAttr    | string                                                     | ""                             | Data attribute name for button elements.            |
| waitContentLoaded | boolean                                                    | initialParam.waitContentLoaded | Overide the core option                             |
| manualShow        | boolean                                                    | false                          | if true, you need show the modal manualy            |

## Lifecycle Hooks

```js
myModal.addController({
    getContent: (target)=> {
        ...
    },
    beforeAppend: (context) => {
        // context argment is object  { content: HTMLElement, trigger:string }
        console.log('on before append:',context);
    },
    afterAppend: ({content,trigger}) => {
        // if this return `Promise`, proccess wait for resolve.
       return new Promise((resolve, rejects) => {
           console.log('content:',content,'trigger:',trigger);
            setTimeout(() => {
                console.log('1000ms later after appending');
                resolve();
            }, 1000);
        });
    }

})
```

### Hooks

| Hook Name    | Type                                  | Desc                              |
| ------------ | ------------------------------------- | --------------------------------- |
| beforeAppend | (context) => Promise\<void\> \| void; | Hook before appending the content |
| afterAppend  | (context) => Promise\<void\> \| void; | Hook after appending the content  |
| beforeShow   | (context) => Promise\<void\> \| void; | Hook before showing the modal     |
| afterShow    | (context) => Promise\<void\> \| void; | Hook after showing the modal      |
| beforeHide   | (context) => Promise\<void\> \| void; | Hook before hiding the modal      |
| afterHide    | (context) => Promise\<void\> \| void; | Hook after hiding the modal       |

### Filter

| Hook Name        | Type                                                                     | Desc                                                |
| ---------------- | ------------------------------------------------------------------------ | --------------------------------------------------- |
| contentCreated() | (content: HTMLElement) => HTMLElement \| Promise\<HTMLElement\> \| void; | Filtering the content before `beforeAppend` running |

---

## Browser support

Moodal is using Promose. [Can I use](https://caniuse.com/#feat=promises)  
If you need support legacy browser like IE11, use [polyfill](https://www.npmjs.com/package/promise-polyfill)

---

## License

[MIT](./LICENSE.txt)
