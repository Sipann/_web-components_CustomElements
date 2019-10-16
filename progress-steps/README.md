# progress-steps

A Web Component displaying steps advancement with possible choice along the way (forking). 

When going down a certain forked branch, the other one(s) is(are) greyed out.

Steps are represented as icons imported as Web Components as well.

___

## Usage

html
```html
<progress-steps currentstep=0></progress-steps>
```

Steps are to be added programmatically with setters (see API below).


## API

**steps** property setter:

type: [ [String] ]


```js
let progressSteps = document.querySelector('progress-steps');
  let steps = [
    ['icon-cat', 'icon-turtle', 'icon-rabbit'],
    ['icon-monkey', 'icon-elephant'],
    ['icon-whale', 'icon-bear', 'icon-penguin'],
  ];
  progressSteps.steps = steps;
```

* Each string refers to a Web Component defined as such.
```js
  // e.g. 'icon-cat' has been defined as a Web Component itself.
  class IconCat extends HTMLElement {...}
  customElements.define('icon-cat', IconCat);
```

* First array of arrays stands for steps on common/main branch:

```js
  ['icon-cat', 'icon-turtle', 'icon-rabbit'],
```

* Following array of arrays stand for steps on forked branches:
```js
  // branch fork 1 
  ['icon-monkey', 'icon-elephant'],
  // branch fork 2
  ['icon-whale', 'icon-bear', 'icon-penguin'],
```


## Attributes

**currentstep**: set current step.
* type: Number
* Required

**ratio**: path between steps length / diameter of step circle.
* type: Number
* Default: 1 


```html
<progress-steps 
  currentstep=0 
  ratio=0.4></progress-steps>
```


```js
// programmatic update of currentstep attribute example.
progressSteps.setAttribute('currentstep', parseInt(progressSteps.getAttribute('currentstep')) + 1);
```


## CSS

```css
progress-steps {
  width: 250px;
  height: 600px;
}
```


## Demo
Available on https://codepen.io/sipann/pen/ExxyWZd
