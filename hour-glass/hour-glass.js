class HourGlass extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });

    // DOM elements
    this._container = null;
    this._drop = null;

    // data
    this._size = null;;
    this._timeLeft = 1 ;
    this._bgColor = '#aba6bf';
    this._bgColorOver = '#f1e0d6';
    this._sandColor = '#595775';
    this._sandColorOver = '#bf988f';
    this._styleAttributes = ['bgColorOver', 'sandColorOver', 'bgColor', 'sandColor' ];

  }

  connectedCallback() {
    this._root.innerHTML = `
      <style>
      
      :host {
        display: inline-block;
        width: 100%;
        position: relative;
      }

      :host .hour-glass-container {
        width: 100%;
        height: 100%;
      }

      .hour-glass-container {
        position: absolute;
        border-radius: 10px;
        clip-path: polygon(0 0, 100% 0, 54% 50%, 100% 100%, 0 100%, 46% 50%);
        -webkit-clip-path: polygon(0 0, 100% 0, 52% 50%, 100% 100%, 0 100%, 48% 50%);
      }
      
      .hour-glass-container span {
        position: absolute;
        top: 48%;
        left: 49%;
        width: 2%;
        height: 50%;
      }
      
      </style>
      <div class="hour-glass-container">
        <span></span>
      </div>
    `;

    this._styleAttributes.forEach(attr => {
      this._setAttributes(attr);
    });

    this._container = this._root.querySelector('.hour-glass-container');
    this._drop = this._root.querySelector('.hour-glass-container span');

    if (this.getAttribute('timeleft')) {
      this._timeLeft = this._normalizeTimeLeft(+this.getAttribute('timeleft'));
    }
    
    this._render();
  }

  static get observedAttributes() {
    return ['timeleft', 'bgColor', 'bgColorOver', 'sandColor', 'sandColorOver'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'timeleft') {
        this._timeLeft = this._normalizeTimeLeft(+newValue);
      }
      else {
        this[`_${name}`] = newValue;
      }
      this._render();
  }

  _convertTimeToHeight(timeLeft) {
    if (timeLeft === 0) return 50;
    
    this._size = parseInt(window.getComputedStyle(this).width);
    let initialTimeHeight, initialTimeArea, leftTimeArea, spentTimeHeight;
    initialTimeHeight = this._size / 2;
    initialTimeArea = Math.pow(this._size/2, 2) / 2;
    leftTimeArea = timeLeft * initialTimeArea;
    spentTimeHeight = initialTimeHeight - Math.sqrt((2 * leftTimeArea));
    return Math.floor(spentTimeHeight);
  }

  _normalizeTimeLeft(timeleft) {
    if (timeleft <= 0) { return 0; } 
    else if (timeleft >= 1) { return 1; } 
    else { return timeleft }
  }

  _render() {
    let height = this._convertTimeToHeight(+this._timeLeft);
    let inverseHeight = (100 - height);
    if (+this._timeLeft === 0) {
      this._sandColor = this._sandColorOver;
      this._bgColor = this._bgColorOver;
    } 
    if (this._container && this._drop) {
      this._container.style.background = `linear-gradient(180deg,
        ${this._bgColor} 0,
        ${this._bgColor} ${height}%,
        ${this._sandColor} ${height}%,
        ${this._sandColor} 50%,
        ${this._bgColor} 50%,
        ${this._bgColor} ${inverseHeight}%,
        ${this._sandColor} ${inverseHeight}%,
        ${this._sandColor} 100%)`;

        if ((+this._timeLeft < 1) && (+this._timeLeft > 0.12)) {
          this._drop.style.display = 'inline-block';
          this._drop.style.backgroundColor = this._sandColor;
        } else {
          this._drop.style.display = 'none';
        }
    }
  }

  _setAttributes(color) {
    if (this.getAttribute(color)) {
      this[`_${color}`] = this.getAttribute(color);
    }
  }

}

customElements.define('hour-glass', HourGlass);
