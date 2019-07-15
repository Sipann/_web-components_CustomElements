# Custom Element \<icon-rating>

* Icon Rating with icons from Font Awesome, Material Icons or custom (Icomoon generated)
___



## Attributes
* icon-family: font-family of icon used (e.g. "Font Awesome 5 Free", "Material Icons", or any other custom family name for icons generated with Icomoon)
  * String
  * required
* icon: icon reference (e.g "f005" for the Font Awesome star, "link" for Material Icons link)
  * String
  * required
* max: max grade allowed 
  * Number (Integer)
  * default: 5
* num: display the actual numerical value?
  * Boolean
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




## Use - Font Awesome
```
<link href="https://use.fontawesome.com/releases/v5.0.8/css/all.css" rel="stylesheet">

<icon-rating icon-family="Font Awesome 5 Free" icon="f005" rating=4.2 rounding="full" num></icon-rating>
```

## Use - Material Icons
```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<icon-rating icon-family="Material Icons" icon="link" max="4" rating=3.2 rounding="half-floor" num></icon-rating>
```

## Use - Custom Icon (eg yeIcon, generated with Icomoon)
```
<style>
  @font-face {
    font-family: 'yeIcon';
    src:
      url('yeIcon/fonts/yeIcon.ttf?r8xcxu') format('truetype'),
      url('yeIcon/fonts/yeIcon.woff?r8xcxu') format('woff'),
      url('yeIcon/fonts/yeIcon.svg?r8xcxu#yeIcon') format('svg');
    font-weight: normal;
    font-style: normal;
  }
</style>

<icon-rating icon-family="yeIcon" icon="e900" max="4" rating=3.2 rounding="half-floor" num></icon-rating>
```

* no slots


## CSS

* CSS Variables 
  * --font-family: font-family of numerical value (if displayed with num attribute)
    * String 
    * default to: sans-serif
  * --frame-color: color of icons "below" (all icons)
    * \<color>
    * default to : #ccc 
  * --icon-align: vertical alignement of icons in case of need
    * allowed values: according to official specification
  * --num-color: font color of numerical value (if displayed with num attribute)
    * \<color>
    * default to: #333
  * --num-size: font-size of numerical value (if displayed with num attribute)
    * \<length>
    * default to: 3rem
  * --rating-color: color of icons "above" (icons representing the rating)
    * \<color>
    * default to: #f44336

* Other CSS Variables - set from JS
  * --icon
  * --icon-family
  * --rating-width


* CSS
  * font-size of icons set from light DOM on icon-rating selector