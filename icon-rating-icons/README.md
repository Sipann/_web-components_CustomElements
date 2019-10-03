# \<icon-rating-mi> - \<icon-rating-fa>

* **icon-rating-mi**: A Web Component displaying rating based on Material Icons.
* **icon-rating-fa**: A Web Component displaying rating based on Font Awesome icons.

* monochrome or linear-gradient colored.
___

## Usage

html
```html
<!-- Material Icons based  -->
<icon-rating-mi 
  color1="blue"
  icon-name="favorite"
  max=5 
  rating=3.4  
  rounding="full"></icon-rating-mi>

<!-- Font Awesome based -->
<icon-rating-fa 
  color1="red" 
  color2="green"
  icon-name="fas fa-heart"
  max=6 
  rating=4.7  
  rounding="half-ceil"></icon-rating-fa>
```


## Attributes

**color1**: linear-gradient starting color
* type: String
* default: 'red'

**color2**: linear-gradient ending color
* type: String
* default: 'red'

**icon-name**: set icon displayed.
* type: String icon as defined by Material Icon / Font Awesome libraries.
* required

**max**: maximum possible grade
* type: Number
* default: 5

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


## CSS

**Icons source** (either Material Icons or Font Awesome) **MUST** be set from parent:
```css
icon-rating-mi {
 font-family: "Material Icons";
}

icon-rating-fa {
  font-family: "Font Awesome 5 Free";
}
```

Component can be customized with CSS variables set from parent:

```css
icon-rating-fa {
  /* ... */
  --frame-color: blue;
  --icon-size: 3rem;
  --letter-spacing: 1rem;
}
```

**--frame-color**: color of "base" icons
* type: String
* default: #ccc

**--icon-size**: customize size of icons
* type: String
* default: 5rem

**--letter-spacing**: customize space between icons
* type: length
* default: initial


## Demo
Available on https://codepen.io/sipann/pen/wvvwJow?editors=0010
