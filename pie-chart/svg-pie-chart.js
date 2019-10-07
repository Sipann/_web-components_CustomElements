const pieChartTemplate = document.createElement('template');
pieChartTemplate.innerHTML = `
<div class="container">
  <svg viewBox="-10 -10 120 120">
    <rect x="-10" y="-10" width="120" height="120" />
    <g id="arcs">
    </g>
    <circle id="donut" cx="50" cy="50" r="0" />
  </svg>
  <div id="infos">
    <span>&times;</span>
    <p id="value"></p>
    <p id="proportion"></p>
  </div>
  <div id="labels">
    <ul></ul>
  </div>
</div>
`;

const pieChartStyle = document.createElement('style');
pieChartStyle.innerHTML = `
<style>
:host {
  display: inline-block;
  width: 100%;
  font-family: sans-serif;
}

rect,
#donut {
  fill: var(--svg-bg, #fff);
}

#arcs path {
  transition: all 0.4s;
}

#arcs path:hover,
#arcs path.revealed {
  fill: var(--hover-bg, #babadc);
}

.container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container.vertical {
  flex-direction: column;
}

svg circle.animated {
  fill: none;
  stroke-width: 0px;
  pointer-events: none;
  transform-origin: 50px 50px;
}

svg path {
  cursor: pointer;
}

svg text {
  stroke: none;
  fill: var(--text-color, #333);
  font-size: var(--text-size, .26rem);
  font-weight: var(--text-weight, 900);
  font-family: var(--text-family, sans-serif);
  pointer-events: none;
  user-select: none;
}

#infos {
  position: absolute;
  min-width: fit-content;
  display: none;
  padding: .8rem;
  background: var(--tooltip-bg, #333);
  color: var(--tooltip-color, #fff);
  border-radius: 5px;
  flex-direction: column;
  align-items: center;
  user-select: none;
  transform: translate(-50%, calc(-100% - 15px));
}

#infos.show {
  display: flex
}

#infos::after {
  content: '';
  position: absolute;
  top: 100%;
  left: calc(50% - 12px);
  display: block;
  width: 0;
  height: 0;
  border-top: 12px solid var(--tooltip-bg, #333);
  border-bottom: 12px solid transparent;
  border-right: 12px solid transparent;
  border-left: 12px solid transparent;
}

#infos span {
  position: absolute;
  top: 0;
  right: 10px;
}

#infos span:hover {
  cursor: pointer;
}

#infos p {
  margin: 0;
  margin-bottom: 0.3rem;
}

.vertical #labels ul {
  width: 80%;
}

ul {
  width: var(--width-label, 120px);
  margin: 1rem;
  padding: var(--border-label-padding, 1rem);
  list-style: none;
  border: var(--border-label, 2px solid #333);
  border-radius: var(--border-label-radius, 10px);
}

li {
  display: var(--display-list-item, flex);
  justify-content: space-around;
  align-items: center;
  margin-right: var(--margin-list-item, 0);
  margin-bottom: .8rem;
}

.vertical li {
  display: inline-flex;
  margin-right: .8rem;
}

li:hover span,
li.revealed span {
  color: var(--hover-label-color, #333);
  background: var(--hover-label-bg, #babadc);
}

li span {
  display: inline-block;
  pointer-events: none;
}

li div {
  width: 15px;
  height: 15px;
  margin-right: .3rem;
  display: inline-block;
  pointer-events: none;
}

</style>`;


class PieChart extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: 'open' });
    this._root.appendChild(pieChartTemplate.content.cloneNode(true));
    this._root.appendChild(pieChartStyle);

    // DOM elements
    this._arcsContainer = this._root.querySelector('#arcs');
    this._componentContainer = this._root.querySelector('.container');
    this._donut = this._root.querySelector('#donut');
    this._infos= this._root.querySelector('#infos');
    this._labelsContainer = this._root.querySelector('#labels ul');
    this._svgContainer = this._root.querySelector('svg');

    // data 
    this._animDuration = 0;   // set from attribute on component
    this._animation = '';   // set from attribute on component
    this._animationIsValid = false;   // computed
    this._circleLength = 2 * Math.PI * 25;    //constant = 2 * Math.PI * svg circle radius
    this._labelIsValid = false;     // computed
    this._labels = 'none';   // set from attribute on component
    this._labelsRendered = false;   // computed
    this._offsetLeft = 0;   // computed
    this._offsetTop = 0;   // computed
    this._pieColors = [];   // set from .pieColors property setter
    this._tags = false;   // set from attribute on component
    this._values = [];    // set from .values property setter
  }

  connectedCallback() {
    // animation data
    this._animDuration = parseInt(this.getAttribute('anim-duration')) || 0;
    this._animation = this.getAttribute('animation') || null;
    this._animationIsValid = this._animation === 'all' || this._animation === 'seq';
    
    // tags data
    this._tags = this.hasAttribute('tags');

    // labels data
    this._labels = this.getAttribute('labels') || null;
    this._labelIsValid = this._labels === 'bottom' || this._labels === 'top' || this._labels === 'left' || this._labels === 'right';
    if (this._labelIsValid) {
      if (this._labels === 'bottom' || this._labels === 'top') {
        this._componentContainer.classList.add('vertical');
      } 
      if (this._labels === 'left' || this._labels === 'top') {
        this._root.querySelector('#labels').style.order = -1;
      }
    } 

    // compute svg size attributes
    let totalWidth = getComputedStyle(this).width;
    if (!this._labels || this._labels === 'top' || this._labels === 'bottom') {
      this._svgContainer.setAttribute('width', totalWidth);
      this._svgContainer.setAttribute('height', totalWidth);
    } else {
      let labelsContainerSize = parseInt(getComputedStyle(this._labelsContainer).width);
      let svgSize = parseInt(totalWidth) - labelsContainerSize;
      this._svgContainer.setAttribute('width', svgSize);
      this._svgContainer.setAttribute('height', svgSize);
    }

    // donut circle radius
    if (this.hasAttribute('donut-radius')) {
      this._donut.setAttribute('r', this.getAttribute('donut-radius'));
    }
  }

  disconnectedCallback() {
    this._svgContainer.removeEventListener('mouseover', this._revealLabel);
    this._svgContainer.removeEventListener('mouseleave', this._reset);
    this._svgContainer.removeEventListener('click', this._displayInfo);
    this._labelsContainer.removeEventListener('mouseover', this._revealSector);
    this._labelsContainer.removeEventListener('mouseleave', this._reset);
    this._infos.querySelector('span').removeEventListener('click', this._hideInfo);
  }


  _animate() {
    if (this._animationIsValid) {
      let accumulatedAngle = -90;  // align starting arc with y axis instead of x.
      let accumulatedDuration = 0;
      
      this._values.forEach((value, index) => {
        let delay, duration;
        let strokeDashTo = value.proportion * this._circleLength;
        let strokeGapTo = this._circleLength - strokeDashTo;

        let newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        newCircle.classList.add('animated');
        newCircle.setAttribute('stroke', this._setColor(index));
        newCircle.setAttribute('cx', 50);
        newCircle.setAttribute('cy', 50);
        newCircle.setAttribute('r', 25);
        newCircle.setAttribute('transform', `rotate(${accumulatedAngle})`);

        accumulatedAngle += value.angle;
    
        this._arcsContainer.appendChild(newCircle);
  
        if (this._animation === 'all') {
          delay = 0;
          duration = this._animDuration;
        } else if (this._animation === 'seq') {
          delay = this._animDuration * accumulatedDuration;
          duration = this._animDuration * value.proportion;
          accumulatedDuration += value.proportion;
        }
  
        newCircle.animate([
          { strokeWidth: 50, strokeDasharray: `0 ${this._circleLength.toFixed(2)}`},
          { strokeWidth: 50, strokeDasharray: `${strokeDashTo.toFixed(2)} ${strokeGapTo.toFixed(2)}`},
        ], {
          delay: delay,
          duration: duration,
          fill: 'forwards'
        });
         
      });
  
      this._renderLabels();
  
      setTimeout(() => {
        this._render();
      }, this._animDuration + 500);
    }

  }

  // based on: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
  _describeArc(startAngle, endAngle) {
    let start = this._polarToCartesian(startAngle, 50);
    let end = this._polarToCartesian(endAngle, 50);
    let arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    return `M50 50 L ${start.x} ${start.y} A 50,50 0, ${arcSweep} 1 ${end.x} ${end.y}`;
  }

  
  _displayInfo(e) {

    if (e.target.nodeName === 'path') {
      // hightlight currently clicked sector
      this._reset('path');
      e.target.classList.add('revealed');

      // find info relative to this sector & display them
      let target = this._values.find(el => {
        return el.label === e.target.id
      });
      this._infos.classList.add('show');
      this._infos.querySelector('span').addEventListener('click', this._hideInfo.bind(this));
      this._infos.querySelector('#value').innerText = `value: ${target.value}`;
      this._infos.querySelector('#proportion').innerText = `proportion: ${parseInt(target.proportion * 100)}%`;

      // get svg container size
      this._offsetTop = this._svgContainer.getBoundingClientRect().top;
      this._offsetLeft = this._svgContainer.getBoundingClientRect().left;
      
      // get labels container size
      let labelsContainerWidth = this._labelIsValid ? parseInt(getComputedStyle(this._root.querySelector('#labels')).width) : 0;
      let labelsContainerHeight = this._labelIsValid ? parseInt(getComputedStyle(this._root.querySelector('#labels')).height) : 0;

      // set display tooltip position relative to mouse cursor
      let positionTop = e.clientY - this._offsetTop; 
      let positionLeft = e.clientX - this._offsetLeft;

      let normalizedPositionTop = this._labels === 'top' ? positionTop + labelsContainerHeight : positionTop;
      let normalizedPositionLeft = this._labels === 'left' ? positionLeft + labelsContainerWidth : positionLeft;

      this._infos.style.top = `${normalizedPositionTop}px`;
      this._infos.style.left = `${normalizedPositionLeft}px`;
    }
  }

  _hideInfo() {
    this._infos.classList.remove('show');
    this._reset('path');
  }

  _polarToCartesian(angleInDegrees, radius) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
      x: 50 + (radius * Math.cos(angleInRadians)),
      y: 50 + (radius * Math.sin(angleInRadians))
    };
  }

  _render() {
    // clean up animation circles when _render() is called from _animate()
    let animationCircles = document.querySelectorAll('.animated');
    animationCircles.forEach(circle => {
      document.removeChild(circle);
    });

    // add event listeners to _svgContainer and _labelsContainer
    this._svgContainer.addEventListener('click', e => this._displayInfo(e), false );
    if (this._labelIsValid) {
      this._labelsContainer.addEventListener('mouseover', e => this._revealSector(e), false);  // TBU
      this._labelsContainer.addEventListener('mouseleave', () => this._reset('path'), false);
      this._svgContainer.addEventListener('mouseover', e => this._revealLabel(e), false);
      this._svgContainer.addEventListener('mouseleave', () => this._reset('li'), false);
    }

    // set pie-chart's final arcs
    let accumulatedAngle = 0;
    this._values.forEach((value, index) => {
      let newArcPath = this._describeArc(accumulatedAngle, value.angle + accumulatedAngle);
      let newArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      newArc.setAttribute('fill', this._setColor(index));
      newArc.setAttribute('d', newArcPath);
      newArc.setAttribute('id', value.label);
      this._arcsContainer.appendChild(newArc);
      
      if (this._tags) {
        this._renderTag(value, accumulatedAngle);
      }

      accumulatedAngle += value.angle;
    });

    this._renderLabels();
  }

  _setColor(index) {
    if (this._pieColors.length === this._values.length -1) {
      return index < this._pieColors.length ? this._pieColors[index % this._pieColors.length] : this._pieColors[(index % this._pieColors.length) + 1];
    } else {
      return this._pieColors[index % this._pieColors.length]
    }
  }

  _renderLabels() {
    if (this._labelIsValid) {
      if (!this._labelsRendered) {
        this._values.forEach((value, index) => {
          let newLabel = document.createElement('li');
          newLabel.setAttribute('data-ref', value.label);

          let colorRef = document.createElement('div');
          colorRef.style.background = this._setColor(index);

          let textRef = document.createElement('span');
          textRef.innerText = value.label;

          newLabel.appendChild(colorRef);
          newLabel.appendChild(textRef);
      
          this._labelsContainer.appendChild(newLabel);
        });
        this._labelsRendered = true;
      }
    } else {
      this._root.querySelector('#labels').parentElement.removeChild(this._root.querySelector('#labels'));
    }
  }

  _renderTag(value, accumulatedAngle) {
    let miniLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    miniLabel.textContent = value.label;
    let coords = this._polarToCartesian(value.angle / 2 + accumulatedAngle, 40);
    miniLabel.setAttribute('x', coords.x);
    miniLabel.setAttribute('y', coords.y);
    miniLabel.setAttribute('text-anchor', 'middle');
    this._arcsContainer.appendChild(miniLabel);
  }

  _reset(nodeName) {
    let allNodes = this._root.querySelectorAll(nodeName);
    allNodes.forEach(node => {
      node.classList = [];
    });
  }

  _revealLabel(e) {
    if (e.target.nodeName === 'path') {
      let target = e.target.id;
      this._reset('li');
      let targetLabel = this._root.querySelector(`[data-ref="${target}"]`);
      targetLabel.classList.add('revealed');
    }
  }

  _revealSector(e) {
    if (e.target.nodeName === 'LI') {
      this._reset('path');
      let targetSector = this._root.querySelector(`#${e.target.dataset.ref}`);
      targetSector.classList.add('revealed');
    } 
  }


  // getters and setters

  get values () {
    return this._values;
  }

  set values(data) {
    let total = data.reduce(function (acc, current) {
        return acc + current[Object.keys(current)[0]];
    }, 0);

    data.forEach(item => {
      let label = Object.keys(item)[0];
      let value = item[Object.keys(item)[0]];
      let proportion = value / total;
      this._values.push({
        label,
        value,
        proportion,
        angle: 360 * proportion
      });
    });
    if (this._animation) { this._animate(); } 
    else { this._render(); }
  }

  set pieColors(value) {
    this._pieColors = value;
  }

}

customElements.define('pie-chart', PieChart);