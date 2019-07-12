# Custom Element \<list-rich>

* Container for list-items with data set from main document's script. 
___



## Attributes
* anim-dur: duration of animation in ms 
  * Number
  * default: 0 (no animation)


## Properties
* set from index.html
* list items based on it are appended on the \<ul>


## Use
```
<section>
  <form>
    <input type="text" placeholder="New Todo" />
    <button id="btn">Add</button>
  </form>
  <ul></ul>
</section>
```

* No slot


## CSS

* CSS Variables
  * --btn-color: font color / background (on hover) color of input button
    * String
    * default to: #fff
  * --btn-bg-color: background / border (on hover) color of input button
    * String
    * default to: #5aa382
  * --comp-bg: component background color
    * String
    * default to: #78d6ac
  * [... all CSS variables applicable to nested component (e.g. \<list-item>)]

* Component width set from light DOM style
 