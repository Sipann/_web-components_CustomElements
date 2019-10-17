const oneStepHTML = `
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:host {
  display: inline-block;
  position: relative;
  --current-color: rgba(0, 0, 255, 0.25);
  --done-stroke-color: #f30458;
  --done-fill-color: #dea9b4;
}

path {
  stroke-width: 4px;
  fill: none;
}

path.frame {
  stroke: #333;
}

path.animate {
  stroke: var(--done-stroke-color);
}

:host([current]) path.frame {
  fill: var(--current-color);
}

:host([disabled]) path.overlay {
  stroke: #333;
  fill: rgba(0, 0, 0, .5);
}

path.frame.done {
  fill: var(--done-fill-color);
  opacity: 0.5;
}
</style>
<svg></svg>
`;

class OneStep extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._root.innerHTML = oneStepHTML;

    // DOM elements
    this._svg = this._root.querySelector('svg');

    // data
    this._branch = false;
    this._circleDim = 0;
    this._height = 0;
    this._hook = 0;
    this._pathDim = 0;
    this._position = 0;
    this._width = 0;
  }

  connectedCallback() {
    this._branch = this.getAttribute('branch') || false;
    this._hook = parseFloat(this.getAttribute('hook')) || 0;
    this._width = parseFloat(this.getAttribute('width'));
    this._height = parseFloat(this.getAttribute('height'));
    this._circleDim = parseFloat(this.getAttribute('circle-dim'));
    this._pathDim = parseFloat(this.getAttribute('path-dim'));
    this._position = this.getAttribute('position');

    this._svg.setAttribute('width', this._width);
    this._svg.setAttribute('height', this._height);
    this._svg.setAttribute('viewBox', `0 0 ${this._width} ${this._height}`);

    this._renderPaths();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'branch' && newValue) {
      this._branch = parseInt(newValue);
    }

    if (name === 'done' && newValue) {
      this._animate();
    }
  }

  static get observedAttributes() {
    return ['branch', 'done'];
  }

  //

  _animate() {
    let path;
    if (this._branch) {
      let paths = this._root.querySelectorAll('path.animate');
      path = paths[this._branch];
      paths.forEach((path, index) => {
        if (index !== this._branch) {
          path.parentElement.removeChild(path);
        }
      });
    } else {
      path = this._root.querySelector('path.animate');
    }

    let pathLength = path.getTotalLength();
    
    const animation = path.animate([
      { strokeDasharray: `0 ${pathLength}` },
      { strokeDasharray: `${pathLength} 0`}
    ], {
      duration: 1500,
      fill: 'forwards'
    });
    animation.onfinish = () => {
      this._root.querySelector('path.frame').classList.add('done');
      this._emitDoneEvent();
    }

    // send playing event before the animation finishes to launch button animation @ same time
    const playingEvent = new Event('playing', { bubbles: true, composed: true });
    this.dispatchEvent(playingEvent);

  }

  _attachIcon() {
    let foreign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreign.setAttribute('width', this._circleDim);
    foreign.setAttribute('height', this._circleDim);
    foreign.setAttribute('transform', `translate(${this._hook}, 0)`);
    let icon = document.createElement(this.getAttribute('icon'));
    foreign.appendChild(icon);
    this._svg.appendChild(foreign);
  }

  _createPath(pathD, className, index) {
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.classList.add(className);
    if (index) {
      path.classList.add(`branch${index}`);
    }
    if (className === 'animate') {
      let pathLength = path.getTotalLength();
      path.style.strokeDasharray = `0 ${pathLength}`;
      this._attachIcon();
    }
    this._svg.appendChild(path);
  }

  _emitDoneEvent() {
    const doneEvent = new Event('done', { bubbles: true, composed: false });
    this.dispatchEvent(doneEvent);
  }

  _renderPaths() {
    let pathsFrame = [];
    let pathsAnim = [];
    let basePath = `M ${this._hook + (this._circleDim / 2) + 2} ${this._circleDim + 2} a 1,1 0 0 1 0 ${-this._circleDim} a 1,1 0 0 1 0 ${this._circleDim}`;

    if (this.hasAttribute('last')) {
      let hooks = this.getAttribute('last').split(',');

      hooks.forEach(hook => {
        let endPathFrame = `v ${this._pathDim / 2} l ${hook - (this._hook)} 0 v ${this._pathDim / 2} v ${-this._pathDim / 2} l ${-(hook - (this._hook))} 0 v ${-this._pathDim / 2}`;
        pathsFrame.push(basePath + endPathFrame);
      });

      pathsFrame.forEach((path, index) => {
        this._createPath(path, 'frame', index);
      });

      hooks.forEach(hook => {
        let endPathAnim = `v ${this._pathDim / 2} l ${hook - (this._hook)} 0 v ${this._pathDim / 2}`;
        pathsAnim.push(basePath + endPathAnim);
      });

      pathsAnim.forEach((path, index) => {
        this._createPath(path, 'animate', index);
      });
      
    } else {
      let endPath = this.hasAttribute('final') ? '' : `v ${this._pathDim}`;
      let path = basePath + endPath;
      this._createPath(path, 'frame');
      this._createPath(path, 'animate');
      this._createPath(basePath, 'overlay');
    }
  }


}

customElements.define('one-step', OneStep);