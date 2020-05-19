# Custom Element \<icon-rating-lg>

An Icon Rating component
* using imported SVG-based Web Components for icons
* monochrome or with linear-gradient
___

## Example

### Rating: 3.4 - half-ceil rounding applied (display 3.5 / 5)
![Rating with half ceil rounding](./readme_img/screenshot_half_ceil_rounding.png)


### Rating: 2.7 - No rounding applied (display: 2.7 / 5)
![Rating with no rounding](./readme_img/screenshot_no_rounding.png)

### No Rating
![Rating no grade](./readme_img/screenshot_no_rating.png)


## Usage


```html
<icon-rating-lg
  color1="blue"
  color2="pink"
  color3="deeppink"
  icon-name="icon-star"
  max=5
  rating=3.4
  rounding="half-ceil"></icon-rating-lg>
```


## Attributes


**box-height**: specify viewBox height of used icon SVG.
* type: Number
* default: 100

**box-width**: specify viewBox width of used icon SVG.
* type: Number
* default: 100

html
```html
<icon-rating-lg
  icon-name="icon-star"
  max=5
  rating=3.4
  box-height=120
  box-width=120></icon-rating-lg>
```

**color1**: linear-gradient starting color
* type: String
* default: 'red'

**color2**: linear-gradient middle color
* type: String
* default: 'gold'

**color3**: linear-gradient ending color
* type: String
* default: 'green'

**icon-name**: set icon displayed.
* type: String refering to a WebComponent
* required

**max**: maximum possible grade
* type: Number
* default: 5

**mono**: monochrome flag
* When set, all colors will be the same (no linear-gradient)


```html
<icon-rating-lg
  icon-name="icon-star"
  max=5
  rating=3.4
  mono></icon-rating-lg>
```

**rating**: current grade
* type: Number
* default: 0

**rounding**: apply rounding to visual display of provided rating
* type: String
* Possible values:
  * **full**: basic rounding
    * 4.2 is rounded to 4
    * 4.7 is rounded to 5
  * **floor**: rounding to lower bound
    * 4.2 is rounded to 4
    * 4.7 is rounded to 4
  * **ceil**: rounding to higher bound
    * 4.2 is rounded to 5
    * 4.7 is rounded to 5
  * **half-floor**: rounding to lower .5 bound
    * 4.2 is rounded to 4
    * 4.7 is rounded to 4.5
  * **half-ceil**: rounding to higher .5 bound
    * 4.2 is rounded to 4.5
    * 4.7 is rounded to 5
* default: no rounding.


## Component Styling with CSS

Component **dimensions** must be set from parent
```css
/* from light DOM */
icon-rating-lg {
  width: 500px;
  position: relative;
}
```

**height** of component is extrapolated from width - icons' SVG viewBox are assumed to be square.


## Demo
Available on https://codepen.io/sipann/pen/XWWrXoq?editors=0010
