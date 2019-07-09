# Custom Element \<responsive-navbar>

(customization fully JS - no light DOM CSS variable)

* On small screen: logo and each nav link displayed on center / column
* On medium screen: logo displayed above navlinks / nav links displayed on whole width (row)
* On large screen: logo displayed on the left / nav links displayed on the right (row)
___



## Attributes
* medium: min-width (px) breakpoint for media query 'medium size'
  * Number
  * default: 769 
* large: min-width (px) breakpoint for media query 'large size'
  * Number
  * default: 1025
* bg-color: background color of navbar (applied to \<header>)
  * String
  * default: 'transparent'
* logo-small: width size of logo on small screen
  * String
  * default: '110px'
* logo-medium: width size of logo on medium screen
  * String
  * default: '130px'
* logo-large: width size of logo on large screen
  * String
  * default: '140px'
* color: Nav links font color
  * String
  * default: '#797e83'
* border-color: Color of line under nav links
  * String
  * default: '#ebecec'
* color-hover: Nav links font color on hover
  * String
  * default: '#0b0b0b'
* border-color-hover: Color of line under nav links on hover
  * String
  * default: '#52bab3'
* border-size: Width of line under nav links
  * String
  * default: '2px'
* font-size: Nav links font size
  * String
  * default: '1.2rem'
* font-weight: Nav links font weight
  * Number
  * default: 400
* nav-padding: Nav links padding
  * String
  * default: '0.8rem'

## Use
```
<responsive-navbar>
    <a slot="logo-home" href="/">
      <img src="" />
    </a>
    <fragment slot="navigation">
      <li><a href="#">Item 1</a></li>
      <li><a href="#">Item 2</a></li>
      <li><a href="#">Item 3</a></li>
      <li><a href="#">Item 4</a></li>
      <li><a href="#">Item 5</a></li>
    </fragment>
</responsive-navbar>
```

* 2 available slots
  * slot="logo-home" within a \<a> tag
  * slot="navigation" within a \<fragment> tag


## CSS

* No CSS set from outside

