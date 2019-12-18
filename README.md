# Layrs

A pure JavaScript library for *modal dialog.*  
[> examples]()


---

## Get Started

### 1. Install

Using npm, install layrs


```bash
$ npm install layrs --save
# or
yarn add layrs
```

### 2. Load JavaScript

#### ES modules
```js
import Layrs from 'layrs';
```
OR write to html
```html
<!-- ES modue in browsee -->
<script type=module src=layrs/lib/esm/layrs.mjs></script>
```
```html
<!-- iife(stndalone) -->
<script src="layrs/lib/stndalone/layrs.js"></script>
```

### 3. Load CSS

OR write to html
```html
<!-- iife(stndalone) -->
<link rel="stylesheet" href="layrs/lib/css/layrs-core.css">
```

### 4. Add markup

Add container
```html
<div class="c-layrs" tabindex="-1" aria-hidden="true">
    <div class="c-layrs__bg"></div>
    <div class="c-layrs__loader">...Loading</div>
    <div class="c-layrs__container">
        <div class="c-layrs__overlay" data-layrs-close></div>
        <div class="c-layrs__inner">
            <div class="c-layrs__body">
                <button class="c-layrs__close" type="button" aria-label="Close" data-layrs-close >
                    ❌
                </button>
                <div class="c-layrs__content" data-layrs-content>
                    <!-- Will be appended content here -->
                </div>
            </div>
        </div>
    </div>
</div>
```

### 5. Initialize Core
```js
// Init Core
const modalContainer = document.querySelector('.c-layrs');
const myModal = new Layrs(modalContainer);
```
```js
// Init Core with options
const modalContainer = document.querySelector('.c-layrs');
const myModal = new Layrs(
    modalContainer,
    {
        noBackgroundScroll:true,
        backgroundElement: document.querySelector('.page-wrapper'),
        waitContentLoaded: true
    }
);
```

### 6. Add Controller
- Example for getting content from DOM element  
```html
<!-- controller -->
<button type="button" data-layrs-target-id="myContent">
    Show Modal
</button>
<!-- template for content -->
<template id="myContent">
    <p>
        irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat<br />
        cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
    </p>
</template>
```
```js
const modalCtrl = myModal.addController({
    controllerAttr: 'data-layrs-target-id',
    getContent: (arg) => {
        // `arg` is value of attribute `data-layrs-target-id`
        const wrapper = document.getElementById(arg);
        if (!wrapper) return;
        const content = document.createElement('div');
        content.innerHTML = wrapper.innerHTML;
        return content;
    }
});
```
Show/Hide by JavaScript
```js
modalCtrl.show("myContent")
modalCtrl.hide()
```

---

## Core Options

| Option Name       | Type     | Default           | Desc                                                                                                           |
| ----------------- | -------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| contentAttr         | string   | "data-layrs-content"              | Data attribute for the element appended content                                                    |
| modalHideAttr  | string   | "data-layrs-close" | Data attribute for elements                                                                             |
| noBackgroundScroll | boolean   | false | if true, fix scrolling element                                                                            |
| backgroundElement       | HTMLElement   | undefined       | The element you want to stop scrolling. ex. `document.querySelector(".page-wrapper")` <br>* require if `noBackgroundScroll` is true |
| waitContentLoaded        | boolean  | true              | if true, the modal is shown after `<img>` or `<iframe>` element is loaded.                                                                                                |
| stateClasses       | Object  |               | Classes for showing / loading state                                                                                          |
| stateClasses.isVissible     | string \| string[]   | is-vissible               | Class on showing modal                                                                                  |
| stateClasses.isLoading     | string \| string[]   | is-loading               | Class on loading modal                                                                |


## Controller Options

| Option Name       | Type     | Default           | Desc                                                                                                           |
| ----------------- | -------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| controllerAttr         | string   | ""              | Data attribute for the element                                                    |
| getContent      | Function | undefind * require             | Callback on Open/Close Animation Start <br> @param {Boolean} isOpen <br> @param {String} contentID \* Don't ID Attribute |
| waitContentLoaded        | boolean  | initialParam.waitContentLoaded              | Overide the core option                                                                                               |
| manualShow        | boolean  | false            | if true, you need show the modal manualy                                                                                               |



---

## License

[MIT](./LICENSE.txt)
