# Custom Element \<icon-rating-lg-[mi||fa]>

* Icon Rating with icons from Material Icons [-mi] 
* Icon Rating with icons from Font Awesome [-fa] (pending)
___



## Attributes
* color1 && color2: colors for icon background linear-gradient
  * start @ left: color1
  * end @ right: color2
  * \<color>
  * color1 default: red
  * color2 default: color1 (if no color2 provided: solid color background)
* max: max grade allowed 
  * Number (Integer)
  * default: 5
* rating: actual grade
  * Number (Float allowed)
  * Must be >= 0 && \<= max
  * default: 0
* rounding: apply rounding to visual representation of the grade?
  * String
  * Possible values:
    * 'full': basic rounding - 4.2 becomes 4 / 4.7 becomes 5
    * 'floor': rounding to lower bound - 4.2 becomes 4 / 4.7 becomes 4 
    * 'ceil': rounding to higher bound - 4.2 becomes 5 / 4.7 becomes 5
    * 'half-floor': rounding to lower .5 bound - 4.2 becomes 4 / 4.7 becomes 4.5
    * 'half-ceil': rounding to higher .5 bound - 4.2 becomes 4.5 / 4.7 becomes 5 
    * when provided value is different or omitted => no rounding.



## Use - Material Icons
```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<style>
  icon-rating-lg-mi {
    font-family: "Material Icons";
  }
</style>

<icon-rating-lg-mi max=5 rating=3.4 icon-name="favorite" rounding="full" color1="blue"></icon-rating-lg-mi>

<icon-rating-lg-mi max=5 rating=3.4 icon-name="favorite" rounding="half-ceil" color1="red" color2="green"></icon-rating-lg-mi>
```

* no slots

## Use - Font Awesome (pending)




## CSS

* CSS Variables 
  * --icon-size: font size of icons
    * \<length>
    * default to: 5rem
  * --frame-color: color of frame icons (all icons "below")
    * \<color>
    * default to : #ccc 

* Other CSS Variables - set from JS
  * --color1
  * --color2
  * --rating-width

