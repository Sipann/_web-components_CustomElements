const pieChartTemplate = document.createElement('template');
pieChartTemplate.innerHTML = `
<div class="container">
  <svg viewBox="-10 -10 120 120">
    <g id="arcs">
    </g>
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

#arcs path {
  
  transition: all 0.4s;
}

#arcs path:hover,
#arcs path.revealed {
  fill: var(--hover-bg);
}

.container {
  width: 100%;
  position: relative;
}

svg {
  width: 100%;
  border: 2px blue solid;
}

svg text {
  stroke: none;
  fill: blue;
  font-size: .4rem;
}


ul {
  list-style: none;
  width: 120px;
  border: 2px solid black;
  border-radius: 10px;
  padding: 1rem;
}

li:hover span,
li.revealed span {
  color: yellow;
}

li {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

li span {
  display: inline-block
}

</style>`;


class PieChart extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: 'open' });
    this._root.appendChild(pieChartTemplate.content.cloneNode(true));
    this._root.appendChild(pieChartStyle);

    // DOM elements
    this._svgContainer = this._root.querySelector('svg');
    this._arcsContainer = this._root.querySelector('#arcs');
    this._labelsContainer = this._root.querySelector('#labels ul');
    this._info= this._root.querySelector('#info');

    // data 
    this._labels = [];
    this._values = [];
    this._valuesColor = ['#bca18d', '#f2746b', '#f14d49', 'green', 'grey', 'yellow'];
    this._size = 0;
    this._circleLength = 2 * Math.PI * 25;
    this._animation = null;
    this._animDuration = 0;
    this._labelsRendered = false;
  }

  connectedCallback() {
    
    this._animation = this.getAttribute('animation') || null;
    this._animDuration = parseInt(this.getAttribute('anim-duration')) || 0;

    this._svgContainer.addEventListener('click', e => this._displayInfo(e), false );
    this._svgContainer.addEventListener('mouseover', e => this._revealLabel(e), false);
    this._svgContainer.addEventListener('mouseleave', () => this._resetLabels(), false);

    this._labelsContainer.addEventListener('mouseover', e => this._revealSector(e), false);
    this._labelsContainer.addEventListener('mouseleave', () => this._resetSectors(), false)
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
      this._resetSectors();
      let targetSector = this._root.querySelector(`#${e.target.dataset.ref}`);
      targetSector.classList.add('revealed');
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
    // console.log('this._values', this._values);
    let accumulatedAngle = -90;
    let accumulatedValue = 0;
    
    this._values.forEach((value, index) => {
    
        let newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        let targetIndex = index % this._valuesColor.length;
        newCircle.classList.add('animated');
        newCircle.setAttribute('stroke', this._valuesColor[targetIndex]);
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
  
        this._renderLabels(value, targetIndex);
        this._labelsRendered = true;

    });

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
      let targetIndex = index % this._valuesColor.length;
      newArc.setAttribute('fill', this._valuesColor[targetIndex]);
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

      if(!this._labelsRendered) {
        this._renderLabels(value, targetIndex);
      }
      


    });


  }

  _renderLabels(value, index) {
    let newLabel = document.createElement('li');
    let colorRef = document.createElement('div');
    colorRef.style.width = '15px';
    colorRef.style.height = '15px';
    colorRef.style.background = this._valuesColor[index];
    colorRef.style.display = 'inline-block';
    let textRef = document.createElement('span');
    textRef.innerText = value.label;
    newLabel.appendChild(colorRef);
    newLabel.appendChild(textRef);
    newLabel.setAttribute('data-ref', value.label);
    newLabel.style.marginBottom = '0.8rem';

    this._labelsContainer.appendChild(newLabel);
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

  get valuesColor() {
    return this._valuesColor;
  }

  set valuesColor(value) {
    this._valuesColor = value;
  }

}

customElements.define('pie-chart', PieChart);