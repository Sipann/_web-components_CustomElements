# pie-chart

A Pie Chart component connecting labels with corresponding sectors.

Can be static or animated on appear.

Can be full disk or donut shaped.

Hovering a label hightlights matching sector.

Hovering a sector highlights matching label.

Clicking a sector displays a tooltip with value provided as well as computed percentage of this value.

___

## Usage

html
```html
<pie-chart></pie-chart>
```

To add values and matching colors programmatically, use the setters (see API below).


## API

**pieColors** property setter:

type: [String]

```js
let pieChart = document.querySelector('pie-chart');
let pieColors = [
  'rgb(161,239,197)', 
  'rgb(79,249,159)', 
  'rgb(191,243,215)', 
  'rgb(130,247,185)', 
  'rgb(24,247,128)'
];
pieChart.pieColors = pieColors;
```

**values** property setter:

type: [objects]

Must be an array of key-value pairs as illustrated below .

```js
let pieChart = document.querySelector('pie-chart');
let values = [
  { 'working' : 75 },
  { 'reading' : 20 },
  { 'cooking' : 10 },
  { 'writing' : 10 },
  { 'walking' : 10 },
  { 'socializing' : 15 },
];
pieChart.values = values;
```

pieColors.length need not be the same as values.length.

pieColors **MUST** be set **BEFORE** values.

```js
pieChart.pieColors = pieColors;
pieChart.values = values;
```


## Attributes

**animation**: set animation type.
* type: String
* Possible values:
  * **seq**: each sector will be painted in **seq**uence (drawing a circle from start to finish);
  * **all**: all sectors paintings will start and finish at the same time (the bigger the longer).
* Default: none

**anim-duration**: animation total duration in ms
* type: Number
* Default: 0

**donut-radius**: set width of inner circle 
* type: Number
* Range: [0, 25] 
  * 0: no donut shape
  * 25: equivalent to 100% - will mask the piechart.
* Default: 0

**labels**: set position of labels (legend) relative to the pie chart.
* type: String
* Possible values:
  * 'top'
  * 'bottom'
  * 'right'
  * 'left'
* Default: no labels displayed

**tags**: Flag setting tags on pie charts.
* type: Boolean
* Default: false

```html
<!--
  animated in sequence
  over 2000ms
  donut shaped
  set labels at the top of the pie
  set tags on the pie -->
<pie-chart
  animation="seq"
  anim-duration=2000
  donut-radius=15
  labels="top"
  tags></pie-chart>
```

pie-chart disk shaped - not animated- showing tags - displaying labels at the right of the pie.

```html
<pie-chart
  labels="right"
  tags></pie-chart>
```


## CSS

```css
pie-chart {
  width: 400px;
  position: relative;
}
```

Component **style** can be customized from parent.

**--border-label**
* Legend container border
* default: 2px solid #333

**--border-label-padding**
* Legend container padding
* default: 1rem

**--border-label-radius**
* Legend container border radius
* default: 10px

**--display-list-item**
* Legend labels display property
* default: flex

**--hover-bg**
* Background color of sectors when hovered or when their label in legend is hovered (when applicable).
* default: '#babadc'

**--hover-label-bg**
* Legend labels background color when hovered or when their respective sector is hovered
* default: #babadc

**--hover-label-color**
* Legend labels colors when hovered or when their respective sector is hovered
* default: #333

**--margin-list-item**
* Legend labels margin-right
* default: 0

**--svg-bg** 
* svg background color 
* default: '#fff'

**--text-color**
* Tags color
* default: '#333'

**--text-family**
* Tags font family
* default: sans-serif

**--text-size**
* Tags font size
* default: .26rem;

**--text-weight**
* Tags font weight
* default: 900

**--tooltip-bg**
* Background color of tooltip displayed when clicking on a sector
* default: #333

**--tooltip-color**
* Text color of tooltip displayed when clicking on a sector
* default: #fff

**--width-label**
* Legend container width
* default: 120px

```css
pie-chart {
  /* ... */
  --border-label: 2px dashed red;
  --border-label-padding: 1rem;
  --border-label-radius: 20px;
  --hover-bg: #babadc;
  --hover-label: red;
  --text-color: #333;
  --width-label: 120px;
}
```


## Demo
Available on https://codepen.io/sipann/pen/dyyPXZX
