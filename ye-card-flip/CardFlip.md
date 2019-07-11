# Custom Element \<card-flip>

(customization fully JS - no light DOM CSS variable)

* Width & height of \<card-flip> container auto from width & height of card children.
* Flipping triggered by 'flip' event. 
___



## Attributes
* flip-dur: transition duration of flip effect
  * String
  * default: .8s
* flipped: is the card container flipped (showing back) or not (showing front)
  * Boolean


## Use
```
<card-flip flip-dur="1s">
  <card-basic slot="front" bg-color="salmon">Front</card-basic>
  <card-basic slot="back" bg-color="orangered">Back</card-basic>
</card-flip>
```

* 2 available slots
  * slot="front" 
  * slot="back" 


## CSS

* No CSS set from outside for this component (width & height resolved from its children)
