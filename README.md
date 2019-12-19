# Moodal

A pure JavaScript library for *modal dialog.*  
[> examples]()


---

## Get Started

### 1. Install

Using npm, install moodal


```bash
$ npm install moodal --save
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
<!-- ES modue in browsee -->
<script type=module src=moodal/lib/esm/moodal.mjs></script>
```
```html
<!-- iife(stndalone) -->
<script src="moodal/lib/stndalone/moodal.js"></script>
```

### 3. Load CSS

OR write to html
```html
<!-- iife(stndalone) -->
<link rel="stylesheet" href="moodal/lib/css/moodal-core.css">
```

### 4. Add markup

Add container
```html
<div class="c-moodal" tabindex="-1" aria-hidden="true">
    <div class="c-moodal__bg"></div>
    <div class="c-moodal__loader">...Loading</div>
    <div class="c-moodal__container">
        <div class="c-moodal__overlay" data-moodal-close></div>
        <div class="c-moodal__inner">
            <div class="c-moodal__body">
                <button class="c-moodal__close" type="button" aria-label="Close" data-moodal-close >
                    ❌
                </button>
                <div class="c-moodal__content" data-moodal-content>
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
const modalContainer = document.querySelector('.c-moodal');
const myModal = new Moodal(modalContainer);
```
```js
// Init Core with options
const modalContainer = document.querySelector('.c-moodal');
const myModal = new Moodal(
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
<button type="button" data-moodal-target-id="myContent">
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
    controllerAttr: 'data-moodal-target-id',
    getContent: (arg) => {
        // `arg` is value of attribute `data-moodal-target-id`
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
| contentAttr         | string   | "data-moodal-content"              | Data attribute for the element appended content                                                    |
| modalHideAttr  | string   | "data-moodal-close" | Data attribute for elements                                                                             |
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
