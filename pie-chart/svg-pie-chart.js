const pieChartTemplate = document.createElement('template');
pieChartTemplate.innerHTML = `
<div class="container">
  <svg viewBox="-10 -10 120 120">
    <defs>
      <mask id="donut-mask">
        <circle cx="50" cy="50" r="50" fill="white" />
        <circle cx="50" cy="50" r="5" fill="black" />
      </mask>
    </defs>
    <g id="arcs" mask="url(#donut-mask)">
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
    this._mask = this._root.querySelector('#donut-mask circle:nth-child(2)');
    this._info= this._root.querySelector('#info');

    // data 
    this._labels = [];
    this._values = [];
    this._valuesColor = ['#bca18d', '#f2746b', '#f14d49', 'green', 'blue', 'yellow'];
    this._size = 0;
  }

  connectedCallback() {
    this._mask.setAttribute('r', 20);

    this._svgContainer.addEventListener('click', e => this._displayInfo(e), false );
    this._svgContainer.addEventListener('mouseover', e => this._revealLabel(e), false);
    this._svgContainer.addEventListener('mouseleave', () => this._resetLabels(), false);

    this._labelsContainer.addEventListener('mouseover', e => this._revealSector(e), false);
    this._labelsContainer.addEventListener('mouseleave', () => this._resetSectors(), false)
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldValue, newValue) {

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

  
  _render() {
    let accumulatedAngle = 0;
    this._values.forEach((value, index) => {
      let newArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      let targetIndex = index % this._valuesColor.length;
      newArc.setAttribute('fill', this._valuesColor[targetIndex]);
      let newArcPath = this._describeArc(accumulatedAngle, value.angle + accumulatedAngle);
      newArc.setAttribute('id', value.label);
      newArc.setAttribute('d', newArcPath);
      this._arcsContainer.appendChild(newArc);

      let miniLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      miniLabel.textContent = value.label;
      let coords = this._setTextPosition(value.angle / 2 + accumulatedAngle);
      miniLabel.setAttribute('x', coords.x);
      miniLabel.setAttribute('y', coords.y);
      miniLabel.setAttribute('text-anchor', 'middle');
      
      
      accumulatedAngle += value.angle;
      this._arcsContainer.appendChild(miniLabel);


      let newLabel = document.createElement('li');
      let colorRef = document.createElement('div');
      colorRef.style.width = '15px';
      colorRef.style.height = '15px';
      colorRef.style.background = this._valuesColor[targetIndex];
      colorRef.style.display = 'inline-block';
      let textRef = document.createElement('span');
      textRef.innerText = value.label;
      newLabel.appendChild(colorRef);
      newLabel.appendChild(textRef);
      newLabel.setAttribute('data-ref', value.label);
      newLabel.style.marginBottom = '0.8rem';

      this._labelsContainer.appendChild(newLabel);


    });


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
    this._render();
  }

  get valuesColor() {
    return this._valuesColor;
  }

  set valuesColor(value) {
    this._valuesColor = value;
  }

}

customElements.define('pie-chart', PieChart);