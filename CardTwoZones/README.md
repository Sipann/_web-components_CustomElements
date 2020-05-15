# Custom Element \<card-two-zones>

* "Flippable" card (emits 'flip' event). 
___



## Attributes
* flippable: can the card be flipped (when in a \<card-flip> custom element)?
  * Boolean
  * If true => flip icon is displayed
  * If false => flip icon is not displayed
* rounded: if present, set rounded border-radius (5%) 
  * Boolean
* top: set height of top container
  * Number
  * default: 2/3 of height as specified in light DOM CSS


## Use
```
<card-two-zones>
  <img slot="top" src="./Phuket.jpg" alt="" />
  <h3 slot="title">Card1</h3>
  <p slot="summary">my summary</p>
</card-two-zones>
```

* 4 available slots
  * slot="top" : image in top div (no default provided but not required since top div has background-color by default) - can also be an \<svg> element as commented in index.html
  * slot="icon" : flip icon (default provided)
  * slot="content-title": bottom div title
  * slot="content-summary": bottom div content


## CSS

* CSS Variables
  * --bg-bottom: 
    * background-color of bottom div
    * default to: #eee
  * --bg-top: 
    * background-color of top div
    * default to: #aba6bf
  * --flip-bg: 
    * background-color of flip icon
    * default to: #595775
  * --flip-icon: 
    * stroke & fill color of flip icon
    * default to: #fff
  * --font-family: 
    * applicable on :host
    * default to: sans-serif
  * --shadow:
    * offset-x, offset-y and blur-radius of shadow (same value for all 3)
    * default to: 5px
  * --shadow-color: 
    * color of shadow
    * default to: #bbb

  * width & height of card set on light DOM
  * width & height of top && bottom set in JS based on these values (by default top is 2/3 of total height, can be overriden through attribute 'top')