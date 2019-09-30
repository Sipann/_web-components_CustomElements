# list-dynamic

An animated list Web Component.

___

## Usage

html
```html
<list-dynamic anim-dur=500 icon="icon-bin" identical=true></list-dynamic>
```


To add items to the list programmatically, use the setter (see API below).

## Customization

The input can be customized through **slot** named **input**.

The button text content can be customized through **slot** named **add**.

html
```html
<list-dynamic>
  <input slot="input" placeholder="new item" />
  <span slot="add">Go</span>
</list-dynamic>
```

The **list items** can also be customized through CSS variables declared on \<list-dynamic> (see CSS section below);




## Attributes

**anim-dur**: set animation duration of entering and leaving items.
* type: Number
* default: 0 (no animation)

**icon**: set icon displayed on list item.
* type: String refering to a WebComponent
* default: 
```html
<svg viewBox="0 0 100 100">
  <path stroke-width="5" d="M 25 25 L 75 75 M 25 75 L 75 25" />
</svg>
```

**identical**: does the list accept identical list-items titles?
* type: Boolean
* default: false


## API
items property getter:

js
```js
let list = document.querySelector('list-dynamic');
let items = list.items;
```

items property setter:

js
```js
let list = document.querySelector('list-dynamic');
let items = [ 'item1', 'item2' ];
list.items = items;
```

## CSS

Component **style** can be customized from parent.

**--component-bg**: 
* component theme color 
* default: '#78d6ac'

**--btn-bg-color**:
* 'add button' background color
* default: #5aa382

**--btn-color**:
* 'add button' text color
* default: #fff;

```css
list-dynamic {
  --component-bg: #333;
  --btn-bg-color: pink;
  --btn-color: #333;
}
```

**Customize list items**

**--item-bg**:
* list item background color
* default: #fff

**--item-color**:
* list item text color
* default: #333

**font**:
* list item font family
* default: sans-serif

**--icon-width**
* action icon size
* default: 30px

**icon-color**
* default action content stroke color
* default: #333;


css
```css
list-dynamic {
  --item-bg: blue;
  --item-color: orange;
  --font: sans-serif;
  --icon-width: 40px;
  --icon-color: green;
}
```


## Demo
Available on https://codepen.io/sipann/pen/eYOwNPN
