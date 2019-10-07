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
    <p id="label"></p>
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
  fill: var(--hover-bg, green);
}

.container {
  width: 100%;
  // height: var(--computed-height);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container.vertical {
  flex-direction: column;
}

svg {
  // width: 100%;
  border: 2px blue solid;
}

svg circle.animated {
  transform-origin: 50px 50px;
  fill: none;
  stroke-width: 0px;
  pointer-events: none;
}

svg path {
  cursor: pointer;
}


svg text {
  stroke: none;
  fill: var(--text-color, #333);
  font-size: var(--text-size, .4rem);
  font-weight: var(--text-weight, 900);
  pointer-events: none;
}

#infos {
  position: absolute;
  display: none;
  background: yellow;
  border-radius: 5px;
  padding: .8rem;
  flex-direction: column;
  align-items: center;
  min-width: fit-content;
  transform: translate(-50%, calc(-100% - 15px));
}

#infos::after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-top: 12px solid green;
  border-bottom: 12px solid transparent;
  border-right: 12px solid transparent;
  border-left: 12px solid transparent;
  position: absolute;
  top: 100%;
  left: calc(50% - 12px);
}

#infos span {
  position: absolute;
  top: 0;
  right: 10px;
}

#infos span:hover {
  cursor: pointer;
}

#infos.show {
  display: flex
}

#infos p {
  margin: 0;
}

.vertical #labels ul {
  width: 80%;
}

ul {
  list-style: none;
  margin: 1rem;
  width: var(--width-label, 120px);
  border: var(--border-label, 2px solid #333);
  border-radius: var(--border-label-radius, 10px);
  padding: var(--border-label-padding, 1rem);
}

li {
  display: var(--display-list-item, flex);
  margin-right: var(--margin-list-item, 0);
  justify-content: space-around;
  align-items: center;
  
}

.vertical li {
  display: inline-flex;
  margin-right: .8rem;
}

li:hover span,
li.revealed span {
  color: var(--hover-label, deeppink);
}

li span {
  display: inline-block;
  pointer-events: none;
}

li div {
  pointer-events: none;
  margin-right: .3rem;
}

</style>`;


class PieChart extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: 'open' });
    this._root.appendChild(pieChartTemplate.content.cloneNode(true));
    this._root.appendChild(pieChartStyle);

    // DOM elements
    this._componentContainer = this._root.querySelector('.container');
    this._arcsContainer = this._root.querySelector('#arcs');
    this._donut = this._root.querySelector('#donut');
    this._infos= this._root.querySelector('#infos');
    this._labelsContainer = this._root.querySelector('#labels ul');
    this._svgContainer = this._root.querySelector('svg');

    // data 
    this._animDuration = 0;
    this._animation = '';
    this._circleLength = 2 * Math.PI * 25;
    
    this._labels = 'none';
    this._labelsRendered = false;
    this._pieColors = [];
    this._size = 0;
    this._values = [];
    this._labelIsValid = false;
    this._animationIsValid = false;
    this._tags = false;
    this._offsetTop = 0;
    this._offsetLeft = 0;
    this._labelsContainerWidth = 0;
    this._labelsContainerHeight = 0;
  }

  connectedCallback() {

    
    this._animation = this.getAttribute('animation') || null;
    this._animationIsValid = this._animation === 'all' || this._animation === 'seq';
    if (this._animationIsValid) {
      this._animDuration = parseInt(this.getAttribute('anim-duration')) || 0;
    }

    this._tags = this.hasAttribute('tags');

    

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

    this._svgContainer.addEventListener('click', e => this._displayInfo(e), false );
    
    // set SVG size
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

    
    

    if (this.hasAttribute('donut-radius')) {
      this._donut.setAttribute('r', this.getAttribute('donut-radius'));
    }

  }

  disconnectedCallback() {
    this._svgContainer.removeEventListener('mouseover', this._revealLabel);
    this._svgContainer.removeEventListener('mouseleave', this._resetLabels);
    this._svgContainer.removeEventListener('click', this._displayInfo);
    this._labelsContainer.removeEventListener('mouseover', this._revealSector, true);
    this._labelsContainer.removeEventListener('mouseleave', this._resetSectors);
    this._infos.querySelector('span').removeEventListener('click', this._hideInfo);
  }




  _animate() {
    if (this._animationIsValid) {
      let accumulatedAngle = -90;  // to align starting arc with y axis
      let accumulatedDuration = 0;
      
      this._values.forEach((value, index) => {
      
          let newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          let targetIndex = index % this._pieColors.length;
          newCircle.classList.add('animated');
          newCircle.setAttribute('stroke', this._setColor(index));
          newCircle.setAttribute('cx', 50);
          newCircle.setAttribute('cy', 50);
          newCircle.setAttribute('r', 25);
          newCircle.setAttribute('transform', `rotate(${accumulatedAngle})`);
  
          accumulatedAngle += value.angle;
    
          let strokeDashTo = value.proportion * this._circleLength;
          let strokeGapTo = this._circleLength - strokeDashTo;
          let duration;
          let delay = 0;
    
          this._arcsContainer.appendChild(newCircle);
    
          if (this._animation === 'all') {
            duration = this._animDuration;
          } else if (this._animation === 'seq') {
            duration = this._animDuration * value.proportion;
            delay = this._animDuration * accumulatedDuration;
            accumulatedDuration += value.proportion;
          }
    
          newCircle.animate([
            { strokeWidth: 50, strokeDasharray: `0 ${this._circleLength.toFixed(2)}`},
            { strokeWidth: 50, strokeDasharray: `${strokeDashTo.toFixed(2)} ${strokeGapTo.toFixed(2)}`},
          ], {
            delay: delay,
            duration: duration,
            fill: 'forwards'
          })
         
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

    //
    _displayInfo(e) {

      let componentRect = this.getBoundingClientRect();
      this._offsetTop = this._svgContainer.getBoundingClientRect().top;
      this._offsetLeft = this._svgContainer.getBoundingClientRect().left;
  
  
      if (e.target.nodeName === 'path') {
        let target = this._values.find(el => {
          return el.label === e.target.id
        });
        this._infos.classList.add('show');
        this._infos.querySelector('span').addEventListener('click', this._hideInfo.bind(this));
        this._infos.querySelector('#value').innerText = `value: ${target.value}`;
        this._infos.querySelector('#proportion').innerText = `proportion: ${parseInt(target.proportion * 100)}%`;
  
        // get labels container size
        let labelsContainerWidth = this._labelIsValid ? parseInt(getComputedStyle(this._root.querySelector('#labels')).width) : 0;
        let labelsContainerHeight = this._labelIsValid ? parseInt(getComputedStyle(this._root.querySelector('#labels')).height) : 0;
  
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

    if (this._labelIsValid) {
      this._labelsContainer.addEventListener('mouseover', e => this._revealSector(e), true);
      this._labelsContainer.addEventListener('mouseleave', () => this._resetSectors(), false);
      this._svgContainer.addEventListener('mouseover', e => this._revealLabel(e), false);
      this._svgContainer.addEventListener('mouseleave', () => this._resetLabels(), false);
    }

    // set pie-chart's final arcs
    let accumulatedAngle = 0;
    this._values.forEach((value, index) => {
      let newArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      let targetIndex = index % this._pieColors.length;
      
      newArc.setAttribute('fill', this._setColor(index));


      let newArcPath = this._describeArc(accumulatedAngle, value.angle + accumulatedAngle);
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
          let colorRef = document.createElement('div');
          colorRef.style.width = '15px';
          colorRef.style.height = '15px';
          colorRef.style.background = this._setColor(index);
          colorRef.style.display = 'inline-block';
          let textRef = document.createElement('span');
          textRef.innerText = value.label;
          newLabel.appendChild(colorRef);
          newLabel.appendChild(textRef);
          newLabel.setAttribute('data-ref', value.label);
          newLabel.style.marginBottom = '0.8rem';
      
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

  _resetLabels() {
    let allLabels = this._labelsContainer.querySelectorAll('li');
    allLabels.forEach(item => {
      item.classList = [];
    });
  }

  _resetSectors() {
    let allSectors = this._root.querySelectorAll('path');
    allSectors.forEach(sector => {
      sector.classList = [];
    });
  }

  _revealLabel(e) {
    if (e.target.nodeName === 'path') {
      let target = e.target.id;
      this._resetLabels();
      let targetLabel = this._root.querySelector(`[data-ref="${target}"]`);
      targetLabel.classList.add('revealed');
    }
  }

  _revealSector(e) {
    if (e.target.nodeName === 'LI') {
      this._resetSectors();
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
    if (this._animation) {
      this._animate();
    } else {
      this._render();
    }
    
  }

  set pieColors(value) {
    this._pieColors = value;
  }

}

customElements.define('pie-chart', PieChart);