# ye-hour-glass

An Hourglass component reflecting remaining time.
Can be static or animated.

___

## Usage

**static**

html
```html
<ye-hour-glass timeleft="0.4" bgColor="grey" bgColorOver="pink" sandColor="green" sandColorOver="red"></ye-hour-glass>
```

**dynamic**

html
```html
<ye-hour-glass></ye-hour-glass>
```

js
```js
let hourGlass = document.querySelector('hour-glass');
let startTime = Date.now();
let endTime = startTime + 10000;
let totalTime = endTime - startTime;
const interval = setInterval(() => {
  let remaining = (endTime - Date.now()) / totalTime;
  if (remaining > 0) {
    hourGlass.setAttribute('timeleft', remaining);
  } else {
    hourGlass.setAttribute('timeleft', 0);
    clearInterval(interval); 
  }
}, 1000);
```


## Attributes

**bgColor**: background color ('glass color')
* type: String
* default: "#aba6bf"

**bgColorOver**: background color ('glass color') when time is over
* type: String
* default: "#f1e0d6"

**sandColor**: 
* type: String
* default: "#595775"

**sandColorOver**: sand color when time is over
* type: String
* default: "#bf988f"

**timeleft**:
* type: Number
* required: true
* allowed range: [0, 1] - values are clamped.


## CSS

Component **dimensions** must be set from parent
```css
hour-glass {
  width: 150px;
  height: 150px;
}
```
**width** is the value used by the component to set the 'glass' (background) and sand positions.

**height** must be equal to width;


## Demo
Available on https://codepen.io/sipann/pen/eYOarBj
