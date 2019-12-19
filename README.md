# Moodal

A pure JavaScript library for _modal dialog._


---

## Get Started

### 1. Install

Using npm, or [download here](https://github.com/sk-rt/moodal/archive/master.zip).

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

OR write to html

```html
<!-- ES modue in browser -->
<script type=module src=moodal/lib/esm/moodal.mjs></script>
```

```html
<!-- iife(stndalone) -->
<script src="moodal/lib/stndalone/moodal.js"></script>
```

### 3. Load CSS

- scss
```scss
@import "moodal/lib/scss/moodal-core.scss"
```
- html
```html
<link rel="stylesheet" href="moodal/lib/css/moodal-core.css" />
```

### 4. Add markup


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
                <div class="c-moodal__content" data-moodal-content>
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
                <div class="c-moodal__content" data-moodal-content></div>
            </div>
        </div>
    </div>
</div>
```
### 5. Initialize Core

```js
// Init Core
const modalContainer = document.querySelector('.c-moodal');
const myModal = new Moodal(modalContainer);
```

```js
// Init Core with options
const modalContainer = document.querySelector('.c-moodal');
const myModal = new Moodal(modalContainer, {
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

 - __Example 1:__   Get content from DOM element in the page.

```html
<!-- controller -->
<button type="button" data-moodal-anchor="myContent">
    Show Modal of `myContent`
</button>
<!-- template for content -->
<template id="myContent" style="display:none;">
    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit,
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
        // Must return HTMLElement
        return content;
    }
});

// You can show/hide modal by JavaScript
modalCtrl.show('myContent'); 
modalCtrl.hide();
```

-  __Example 2:__  Get content from page by Ajax / axios

```html
<!-- controller -->
<button data-moodal-ajax="target.html">
    Show Modal of `target.html`
</button>
```

```js

import axios from 'axios';

const modalCtrlAjsx = myModal.addController({
    controllerAttr: 'data-moodal-ajax',
    getContent: async trigger => {
        // If you want async function, return Promise object
        return new Promise(async (resolve, rejects) => {
            try {
                const res = await axios.get(trigger, {
                    responseType: 'document'
                });
                const content = res.data.querySelector('#content');
                if (!content) {
                    throw new Error('No Element');
                } 
                resolve(content);
            } catch (error) {
                rejects(error);
            }
        });
    }
});
```



---

## Core Params

| Param Name              | Type               | Default               | Desc                                                                                                                                 |
| ----------------------- | ------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| contentAttr             | string             | "data-moodal-content" | Data attribute for the element appended content                                                                                      |
| modalHideAttr           | string             | "data-moodal-close"   | Data attribute for elements                                                                                                          |
| noBackgroundScroll      | boolean            | false                 | if true, fix scrolling element                                                                                                       |
| backgroundElement       | HTMLElement        | undefined             | The element you want to stop scrolling. ex. `document.querySelector(".page-wrapper")` <br>\* require if `noBackgroundScroll` is true |
| waitContentLoaded       | boolean            | true                  | if true, the modal is shown after `<img>` or `<iframe>` element is loaded.                                                           |
| stateClasses            | Object             |                       | Classes for showing / loading state                                                                                                  |
| stateClasses.isVissible | string \| string[] | is-vissible           | Class on showing modal                                                                                                               |
| stateClasses.isLoading  | string \| string[] | is-loading            | Class on loading modal                                                                                                               |

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

| Param Name        | Type                                                    | Default                        | Desc                                                                                                                     |
| ----------------- | ------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| getContent        | (trigger: string) => Promise\<HTMLElement\> \| HTMLElement | undefind **\* required**       | Get the content(HTMLElement) from `trigger` argment |
| controllerAttr    | string                                                  | ""                             | Data attribute name for button elements.                                                                                 |
| waitContentLoaded | boolean                                                 | initialParam.waitContentLoaded | Overide the core option                                                                                                  |
| manualShow        | boolean                                                 | false                          | if true, you need show the modal manualy                                                                                 |

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


| Hook Name      | Type                                               | Desc                              |
| -------------- | -------------------------------------------------- | --------------------------------- |
| beforeAppend | (context) => Promise\<void\> \| void; | Hook before appending the content |
| afterAppend  | (context) => Promise\<void\> \| void; | Hook after appending the content  |
| beforeShow   | (context) => Promise\<void\> \| void; | Hook before showing the modal     |
| afterShow    | (context) => Promise\<void\> \| void; | Hook after showing the modal      |
| beforeHide   | (context) => Promise\<void\> \| void; | Hook before hiding the modal     |
| afterHide    | (modal: HTMLElement) => Promise\<void\> \| void;   | Hook after hiding the modal      |

### Filter

| Hook Name        | Type                                                                     | Desc                                                  |
| ---------------- | ------------------------------------------------------------------------ | ----------------------------------------------------- |
| contentCreated() | (content: HTMLElement) => HTMLElement \| Promise\<HTMLElement\> \| void; | Filtering the content before `beforeAppend` running |

---

## Browser support

Moodal is using [Promise](https://caniuse.com/#feat=promises).  
If you need support, use [polyfill](https://www.npmjs.com/package/promise-polyfill)

---

## License

[MIT](./LICENSE.txt)
