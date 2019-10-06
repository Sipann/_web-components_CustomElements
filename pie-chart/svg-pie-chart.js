const pieChartTemplate = document.createElement('template');
pieChartTemplate.innerHTML = `
<div class="container">
  <svg viewBox="-10 -10 120 120">
    <rect x="-10" y="-10" width="120" height="120" />
    <g id="arcs">
    </g>
    <circle id="donut" cx="50" cy="50" r="0" />
  </svg>
  <div id="info"></div>
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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  width: 100%;
  border: 2px blue solid;
}

svg text {
  stroke: none;
  fill: var(--text-color, #333);
  font-size: var(--text-size, .4rem);
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
    this._info= this._root.querySelector('#info');
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
  }

  connectedCallback() {
    
    let size = parseInt(window.getComputedStyle(this).width);

    this._animation = this.getAttribute('animation') || null;
    this._animDuration = parseInt(this.getAttribute('anim-duration')) || 0;

    this._svgContainer.addEventListener('click', e => this._displayInfo(e), false );

    this._labels = this.getAttribute('labels') || 'none';
    this._labelIsValid = this._labels === 'bottom' || this._labels === 'top' || this._labels === 'left' || this._labels === 'right';

    if (this._labelIsValid) {
      if (this._labels === 'bottom' || this._labels === 'top') {
        this._componentContainer.style.flexDirection = 'column';
        this._labelsContainer.style.width = `${0.8 * size}px`;
        this._root.host.style.setProperty('--display-list-item', 'inline-flex');
        this._root.host.style.setProperty('--margin-list-item', '.8rem');
      } 
      if (this._labels === 'left' || this._labels === 'top') {
        this._root.querySelector('#labels').style.order = -1;
      }
      this._labelsContainer.addEventListener('mouseover', e => this._revealSector(e), true);
      this._labelsContainer.addEventListener('mouseleave', () => this._resetSectors(), false);
      this._svgContainer.addEventListener('mouseover', e => this._revealLabel(e), false);
      this._svgContainer.addEventListener('mouseleave', () => this._resetLabels(), false);

    }

    if (this.hasAttribute('donut-radius')) {
      this._donut.setAttribute('r', this.getAttribute('donut-radius'));
    }

  }

  static get observedAttributes() {
    return [];
  }

  _displayInfo(e) {
    let target = this._values.find(el => {
      return el.label = e.target.id
    });
    let infos = target;
    this._info.innerHTML = `
    <span>label: ${infos.label}</span>
    <span>proportion: ${infos.proportion * 100}%</span>
    <span>value: ${infos.value}</span>
    `;
  }

  _resetLabels() {
    let allLabels = this._labelsContainer.querySelectorAll('li');
    allLabels.forEach(item => {
      item.classList = [];
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

  _resetSectors() {
    let allSectors = this._root.querySelectorAll('path');
    allSectors.forEach(sector => {
      sector.classList = [];
    });
  }

  _revealSector(e) {
    if (e.target.nodeName === 'LI') {
      console.log('revealSector, targeting LI');
      this._resetSectors();
      let targetSector = this._root.querySelector(`#${e.target.dataset.ref}`);
      targetSector.classList.add('revealed');
    } else {
      console.log('revealSector', e.target.nodeName);
    }
  }

  



  // based on: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
  _describeArc(startAngle, endAngle) {
    let start = this._polarToCartesian(startAngle);
    let end = this._polarToCartesian(endAngle);
    let arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    return `M50 50 L ${start.x} ${start.y} A 50,50 0, ${arcSweep} 1 ${end.x} ${end.y}`;

  }

  _setTextPosition(angle) {
    var angleInRadians = (angle - 90) * Math.PI / 180.0;
    return {
      x: 50 + (40 * Math.cos(angleInRadians)),
      y: 50 + (40 * Math.sin(angleInRadians))
    }
  }

  _polarToCartesian(angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
      x: 50 + (50 * Math.cos(angleInRadians)),
      y: 50 + (50 * Math.sin(angleInRadians))
    };
  }

  _animate() {
    console.log('this._values', this._values);
    let accumulatedAngle = -90;
    let accumulatedValue = 0;
    
    this._values.forEach((value, index) => {
    
        let newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        let targetIndex = index % this._pieColors.length;
        newCircle.classList.add('animated');
        newCircle.setAttribute('stroke', this._pieColors[targetIndex]);
        newCircle.setAttribute('stroke-width', 0);
        newCircle.setAttribute('cx', 50);
        newCircle.setAttribute('cy', 50);
        newCircle.setAttribute('r', 25);
        newCircle.setAttribute('fill', 'none');
        newCircle.style.transformOrigin = '50px 50px';
        newCircle.setAttribute('transform', `rotate(${accumulatedAngle})`);

        accumulatedAngle += value.angle;
  
        let strokeDash = value.proportion * this._circleLength;
        let strokeGap = this._circleLength - strokeDash;
        let strokeDashFrom = 0;
        let strokeDashTo = strokeDash;
        let strokeGapFrom = this._circleLength;
        let strokeGapTo = strokeGap;
        let duration;
        let delay = 0;
        
  
  
        this._arcsContainer.appendChild(newCircle);
  
        if (this._animation === 'all') {
          duration = this._animDuration;
        } else if (this._animation === 'seq') {
          duration = this._animDuration * value.proportion;
          delay = this._animDuration * accumulatedValue;
          accumulatedValue += value.proportion;
        }
  
        newCircle.animate([
          { strokeWidth: 50, strokeDasharray: `${strokeDashFrom.toFixed(2)} ${strokeGapFrom.toFixed(2)}`},
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

  
  
  _render() {
    console.log('this._values', this._values);

    let animationCircles = document.querySelectorAll('.animated');
    animationCircles.forEach(circle => {
      document.removeChild(circle);
    });

    let accumulatedAngle = 0;
    this._values.forEach((value, index) => {
      let newArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      let targetIndex = index % this._pieColors.length;
      newArc.setAttribute('fill', this._pieColors[targetIndex]);
      let newArcPath = this._describeArc(accumulatedAngle, value.angle + accumulatedAngle);
      
         
      newArc.setAttribute('d', newArcPath);
      newArc.setAttribute('id', value.label);
      this._arcsContainer.appendChild(newArc);


      let miniLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      miniLabel.textContent = value.label;
      let coords = this._setTextPosition(value.angle / 2 + accumulatedAngle);
      miniLabel.setAttribute('x', coords.x);
      miniLabel.setAttribute('y', coords.y);
      miniLabel.setAttribute('text-anchor', 'middle');
      
      
      accumulatedAngle += value.angle;
      this._arcsContainer.appendChild(miniLabel);

    });

    if(!this._labelsRendered) {
      this._renderLabels();
    }

  }

  _renderLabels() {
    if (this._labelIsValid && !this._labelsRendered) {
      this._values.forEach((value, index) => {
        let newLabel = document.createElement('li');
        let colorRef = document.createElement('div');
        colorRef.style.width = '15px';
        colorRef.style.height = '15px';
        colorRef.style.background = this._pieColors[index];
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
    } else {
      this._root.querySelector('#labels').parentElement.removeChild(this._root.querySelector('#labels'));
    }
  }

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