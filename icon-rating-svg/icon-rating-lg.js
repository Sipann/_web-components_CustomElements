const templateIconRatingLg = document.createElement('template');
templateIconRatingLg.innerHTML = `
<style>
  :host {
    display: inline-block;
  }
  #container {
    width: 100%;
  }
</style>
<div id="container">
  <svg>
    <defs>
      <linearGradient id="gradient">
        <stop id="color1" offset="0%" stop-color="green" />
        <stop id="color2" offset="50%" stop-color="gold" />
        <stop id="color3" offset="100%" stop-color="red" />
      </linearGradient>
      <mask id="mask">
        <rect y="0" fill="black" />
      </mask>
    </defs>
    <g></g>
    <rect id="color-container" x="0" y="0" fill="url(#gradient)" mask="url(#mask)" />
  </svg>
</div>
`;

class IconRatingLg extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: 'open' });
    this._root.appendChild(templateIconRatingLg.content.cloneNode(true));

    // DOM elements
    this._container = this._root.querySelector('#container');
    this._svgContainer = this._root.querySelector('#container > svg');
    this._stopColor1 = this._root.querySelector('#color1');
    this._stopColor2 = this._root.querySelector('#color2');
    this._stopColor3 = this._root.querySelector('#color3');
    this._maskContainer = this._root.querySelector('#mask');
    this._maskRect = this._root.querySelector('#mask rect');
    this._containerOuter = this._root.querySelector('#container g');
    this._colorContainer = this._root.querySelector('#color-container');

    // data
    this._boxWidth = 100;
    this._boxHeight = 100;
    this._max = 5;
    this._rating = 0;
    this._rounding = '';
    this._color1 = 'red';
    this._color2 = 'gold';
    this._color3 = 'green';
    this._frameColor = '#ddd';
    this._totalWidth = 0;
  }

  connectedCallback() {
    this._boxWidth = parseInt(this.getAttribute('box-width')) || 100;
    this._boxHeight = parseInt(this.getAttribute('box-height')) || 100;
    this._max = parseInt(this.getAttribute('max')) || 5;
    this._rounding = this.getAttribute('rounding') || '';
    this._frameColor = this.getAttribute('frame') || '#ddd';
    this._color1 = this.getAttribute('color1') || 'red';
    this._color2 = this.getAttribute('color2') || 'gold';
    this._color3 = this.getAttribute('color3') || 'green';
    this._icon = this.getAttribute('icon-name');

    this._rating = this._normalizeRating(parseFloat(this.getAttribute('rating')));

    this._render();

  }

  _normalizeRating(rating) {
    if (!rating) return  0;
    else if (rating < 0) return 0;
    else if (rating > this._max) return this._max;
    else return this._roundRating(rating)
  }

  _roundRating(rating) {
    let grade, float;
    switch(this._rounding) {
      case 'full':
        grade = Math.round(rating);
        break;
      case 'floor':
        grade = Math.floor(rating);
        break;
      case 'ceil':
        grade = Math.ceil(rating);
        break;
      case 'half-floor':
        float = rating % 1;
        if (float < 0.5) { grade = Math.floor(rating); }
        else { grade = Math.floor(rating) + 0.5; }
        break;
      case 'half-ceil':
        float = rating % 1;
        if (float < 0.5) { grade = Math.floor(rating) + 0.5; }
        else { grade = Math.ceil(rating); }
        break;
      default:
        grade = rating;
    } 
    return grade;
  }

  _render() {
    // set component dimensions
    let componentWidth = parseInt(getComputedStyle(this._container).width);
    this._totalWidth = componentWidth;
    let componentHeight = componentWidth / this._max;
    this._container.style.height = componentHeight + 'px';

    // set svg dimensions
    this._svgContainer.setAttribute('width', componentWidth);
    this._svgContainer.setAttribute('height', componentHeight);
    this._svgContainer.setAttribute('viewBox', `0 0 ${this._boxWidth * this._max} ${this._boxHeight}`);

    // set linear-gradient
    this._stopColor1.setAttribute('stop-color', this._color1);
    if (this.hasAttribute('mono')) {
      this._stopColor2.setAttribute('stop-color', this._color1);
      this._stopColor3.setAttribute('stop-color', this._color1)
    } else {
      this._stopColor2.setAttribute('stop-color', this._color2);
      this._stopColor3.setAttribute('stop-color', this._color3)
    }

    this._containerOuter.setAttribute('fill', this._frameColor);
    this._maskContainer.setAttribute('fill', 'white');

    let icon = document.createElement(this._icon);
    let iconHTML = icon.shadowRoot.innerHTML;

    // set base icons
    for (let i = 0; i < this._max; i++) {
      let group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
      group.innerHTML = iconHTML;
      group.classList.add('frame-icon');
      group.style.transform = `translate(${i * this._boxWidth}px, 0)`;
      
      this._containerOuter.appendChild(group);
      let outerSVG = this._containerOuter.querySelectorAll('svg');
      outerSVG.forEach(svg => {
        svg.setAttribute('width', this._totalWidth / this._max);
        svg.setAttribute('height', componentHeight);
      })
    }

    // set mask icons
    for (let i = 0; i < this._max; i++) {
      let group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
      group.classList.add('color-icon');
      group.innerHTML = iconHTML;
      group.style.transform = `translate(${i * this._boxWidth}px, 0)`;
      
      this._maskContainer.prepend(group);
      let maskSVG = this._maskContainer.querySelectorAll('svg');
      maskSVG.forEach(svg => {
        svg.setAttribute('width', this._totalWidth / this._max);
        svg.setAttribute('height', componentHeight);
      })
    }

    // set linear gradient target
    this._colorContainer.setAttribute('width', this._boxWidth * this._max);
    this._colorContainer.setAttribute('height', this._boxHeight);

    this._setMaskSize()

  }

  _setMaskSize() {
    let ratingSized = this._rating * this._boxWidth;
    let maskSized = this._boxWidth * this._max - ratingSized;

    this._maskRect.setAttribute('x', ratingSized);
    this._maskRect.setAttribute('width', maskSized);
    this._maskRect.setAttribute('height', this._boxHeight);
  }

}

customElements.define('icon-rating-lg', IconRatingLg);