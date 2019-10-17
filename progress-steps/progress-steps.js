const progressStepsHTML = `
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:host {
  display: inline-block;
  position: relative;
}

</style>
<div id="container">
  <svg></svg>
</div>
`;


class ProgressSteps extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._root.innerHTML = progressStepsHTML;

    // DOM elements
    this._svgContainer = this._root.querySelector('svg');

    // data
    this._blockDim = 0;
    this._branchesHooks = [];
    this._branchesNumber = 1;  
    this._circleDim = 0;
    this._commonHook = 0; 
    this._commonLength = 1; 
    this._componentHeight = 0;
    this._componentWidth = 0;
    this._currentStep = 0;
    this._longestLength = 1; 
    this._pathDim = 0;
    this._ratio = 0.1;
    this._steps = [];
  }

  connectedCallback() {
    // get dimensions set on parent
    this._componentHeight = parseInt(getComputedStyle(this).height);
    this._componentWidth = parseInt(getComputedStyle(this).width);

    // set dimensions for svg container: component width / height + 4px on both dimensions to adjust for stroke-width.
    this._svgContainer.setAttribute('viewBox', `0 0 ${this._componentWidth + 4} ${this._componentHeight + 4}`);
    //
    this._svgContainer.addEventListener('playing', () => { this._emitButtonsEvent() });

    // get ratio attribute
    this._ratio = parseFloat(this.getAttribute('ratio')) || 1;
  }


  attributeChangedCallback(name, oldValue, newValue) {
    this._currentStep = this._root.querySelector('one-step[current]');
    if (name === 'branch' && newValue != oldValue) {
      this._branch = newValue;
      this._currentStep.setAttribute('branch', newValue);
    }

    if (name === 'currentstep' && oldValue) {
      this._currentStep.setAttribute('done', !!true);
    }
  }

  static get observedAttributes() {
    return ['currentstep', 'branch'];
  }

  // Methods

  _createListItem(step,) {
    let listItem = document.createElementNS('http://www.w3.org/1999/xhtml', 'one-step');
    listItem.setAttribute('icon', step);
    listItem.setAttribute('circle-dim', this._circleDim);
    listItem.setAttribute('path-dim', this._pathDim);
    listItem.setAttribute('height', this._blockDim);
    listItem.addEventListener('done', () => {
      this._stepForwards();
    });
    return listItem;
  }

  _emitButtonsEvent() {
    let buttonsEvent;
    let currentPosition = parseInt(this._currentStep.getAttribute('position'));
    if (currentPosition === this._commonLength - 2) {
      buttonsEvent = new Event('fork', { bubbles: true, composed: true });
    } else if (currentPosition === this._commonLength - 1) {
      buttonsEvent = new Event('unfork', { bubbles: true, composed: true })
    }
    if (buttonsEvent) {
      this.dispatchEvent(buttonsEvent);
    }
  }

  _findLongest(arr) {
    let max = 0;
    let maxLength = arr[max].length;
    arr.forEach((item, index) => {
      if (item.length > maxLength) {
        max = index;
        maxLength = item.length;
      }
    });
    return max;
  }

  _renderUI() {
    this._renderUICommon();
    this._renderUIBranches();
  }

  _renderUIBranches() {
    let branches = this._steps.slice(1);
    for (let i=0; i<branches.length; i++) {
      let branch = branches[i];
      branch.forEach((step, index) => {
        let listItem = this._createListItem(step);
        listItem.setAttribute('width', this._componentWidth / 2);
        listItem.setAttribute('position', index + this._commonLength);
        listItem.classList.add(`branch-${i}`);
        if (index === branch.length - 1) {
          listItem.setAttribute('final', !!true);
        }

        let newG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        let translationY = (index + this._commonLength) * this._blockDim;
        newG.setAttribute('transform', `translate(${this._branchesHooks[i]}, ${translationY})`);

        let foreign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        foreign.setAttribute('width', this._componentWidth / branches.length);
        foreign.setAttribute('height', this._blockDim);
        foreign.appendChild(listItem);
        newG.appendChild(foreign);
        this._svgContainer.appendChild(newG);
      });
    }
  }

  _renderUICommon() {
    this._steps[0].forEach((step, index) => {
      // Create listItem
      let listItem = this._createListItem(step);
      listItem.setAttribute('width', this._componentWidth);
      listItem.setAttribute('position', index);
      listItem.setAttribute('hook', this._commonHook - this._circleDim / 2);
      if (this._steps[0].length - 1 === index) {
        listItem.setAttribute('last', this._branchesHooks);
      }
      if (parseInt(this.getAttribute('currentstep')) === index) {
        listItem.setAttribute('current', !!true);
      }

      
      let newG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      newG.setAttribute('transform', `translate(0, ${index * this._blockDim })`);
      
      let foreign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      foreign.setAttribute('width', this._componentWidth);
      foreign.setAttribute('height', this._blockDim);
      foreign.appendChild(listItem);
      newG.appendChild(foreign);
      this._svgContainer.appendChild(newG);
    });
  }

  _setUpUI() {
    // find max number of steps
    let maxSteps = this._commonLength + this._longestLength;
    // find max number of steps including paths between them
    let maxItems = maxSteps + (maxSteps - 1) * this._ratio;
    
    // set circle, path, and circle + path (block) dimensions
    this._circleDim = this._componentHeight / maxItems;
    this._pathDim = this._circleDim * this._ratio;
    this._blockDim = this._circleDim * (1 + this._ratio);

    // find hook position of common branch
    this._commonHook = this._componentWidth / 2;
    // width available for forks/branches (component width - 2 * 1/2 circle)
    let forkAvailableWidth = this._componentWidth - this._circleDim;
    // number of white spaces between forks/branches
    let forkSpaces = this._branchesNumber - 1;
    // width of each fork/branch
    let forkWidth = forkAvailableWidth / forkSpaces;
    // set x hooks for each fork/branch
    for (let i=0; i<this._branchesNumber; i++) {
      this._branchesHooks.push(i * forkWidth);
    }
    this._renderUI();
  }

  _stepForwards() {
    let newStep, nextPosition, disabled;
    this._currentStep.removeAttribute('current');

    nextPosition = parseInt(this._currentStep.getAttribute('position')) + 1;
    
    if (this._branch) {
      for (let i=0; i<this._branchesNumber; i++) {
        if (i !== parseInt(this._branch)) {
          disabled = this._root.querySelectorAll(`one-step.branch-${i}`);
        }
      }
      disabled.forEach(step => {
        step.setAttribute('disabled', !!true);
      });
    }

    newStep = this._branch ?
      this._root.querySelector(`one-step.branch-${this._branch}[position="${nextPosition}"]`) || null :
      this._root.querySelector(`one-step[position="${nextPosition}"]`) || null;
    

    if (newStep) {
      newStep.setAttribute('current', !!true);
      const enabledEvent = new Event('enabled', { bubbles: true, composed: true });
      this.dispatchEvent(enabledEvent);
    } else {
      let allDoneEvent = new Event('end', { bubbles: true, composed: true });
      this.dispatchEvent(allDoneEvent);
    }
  }

  

  // Getters && Setters

  get steps() {
    return this._steps;
  }

  set steps(value) {
    this._steps = value;
    this._branchesNumber = value.length - 1;
    this._commonLength = value[0].length;
    let longestBranch = this._findLongest(value.slice(1)) + 1;
    this._longestLength = value[longestBranch].length;
    this._setUpUI();
  }

}

customElements.define('progress-steps', ProgressSteps);