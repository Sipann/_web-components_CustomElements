# Custom Element \<list-item>

* List item (animated or not)
___



## Attributes
* anim-dur: duration of animation in ms 
  * Number
  * Set from parent component \<list-rich> attribute 
  * default: 0 (no animation)
* text: text content of \<li> tag
  * String
  * Set from parent component \<list-rich> input value


## Use
```
<li>
  <span id="content"></span>
  <slot id="remove" name="icon">
    <svg viewBox="0 0 100 100">
      <path stroke-width="5" d="M 25 25 L 75 75 M 25 75 L 75 25" />
    </svg>
  </slot>
</li>
```

* 1 available slot
  * slot="icon" : icon triggering removal of list item. Default provided (svg cross)


## CSS

* CSS Variables (customization from parent component (\<list-rich> light DOM))
  * --font-family:
    * String 
    * default to: sans-serif
  * --icon-size: icon width & height
    * String
    * default to: 30px
  * --list-item-bg: list item background-color
    * String
    * default to: #fff
  * --list-item-color: list item font color
    * String
    * default to: #333
  * --remove-color: icon stroke color
    * String
    * default: #333


 