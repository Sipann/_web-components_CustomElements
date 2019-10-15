const iconWhaleTemplate = document.createElement('template');
iconWhaleTemplate.innerHTML = `
<svg viewBox="-10 -10 120 120">
  <g id="whale" fill="none" stroke="#333" stroke-width="2">
    <g id="whale-body">
      <path d="M5 50 a 1,1 0 0 1 60 -5 q 3 10 8 -10 q -12 -7 -7 -17 q 8 -3 12 7  q 5 -7 12 -7  q 4 14 -7 17 q -5 30 -32 40 a 1.5,1 0 0 1 -10 2 q -16 5 -30 -7 q 0 -2 3 -2 l -5 -9  q -3 1 -3 -2 q 0 0 -1 -6" />
    </g>
    <g id="whale-mouth">
      <path id="mouth" d="M 10 58.7 q 15 0 30 -7 q -15 20 -27 16 l -3.5 -8 z" />
      <path id="smile" d="M38 48 q 0 2.5 5 5" />
    </g>
    <g id="whale-eye">
      <path d="M30 40 a 1 2 0 0 1 2.5 0 a 1 2 0 0 1 -2.5 0" />
    </g>
    <g id="whale-paddle">
      <path d="M41 77 q -5 -3 -5 -10" />
      <path d="M51.1 75 c 0 -5 -3 -6 -5 -10" />
    </g>
    <g id="drops">
      <path d="M 25 15 q -4 0 -5 -3 q 2 -5 5 3" />
      <path d="M 30 12 q -3 -4 -1 -5 q 3 1 1 5" />
      <path d="M 35 15 q 0 -5 5 -5 q 4 2 -5 5" />
    </g>
  </g>
</svg>`;

const iconWhaleStyle = document.createElement('style');
iconWhaleStyle.innerHTML = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:host {
  display: inline-block;
  // --stroke-primary: #333;
  // --fill-primary: rgb(15, 238, 211);
  // --fill-secondary: #ddd;
}

#whale {
  stroke: var(--stroke-primary);
  stroke-width: 2px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

#whale-eye {
  stroke: none;
  fill: var(--stroke-primary);
}

#whale-mouth {
  fill: var(--fill-secondary);
}

`;

class IconWhale extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    // this._root.appendChild(iconWhaleTemplate.content.cloneNode(true));
    // this._root.appendChild(iconWhaleStyle);
    this._root.innerHTML = `
    <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :host {
      display: inline-block;
      --stroke-primary: #333;
      --fill-primary: rgb(15, 238, 211);
      --fill-secondary: #ddd;
      position: relative;
      width: 100%;
      height: 100%;
    }

    svg {
      width: 100%;
      height: 100%;
    }
    
    #whale {
      stroke: var(--stroke-primary);
      stroke-width: 2px;
      fill: var(--fill-primary);
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    
    #whale-eye {
      stroke: none;
      fill: var(--stroke-primary);
    }
    
    #whale-mouth {
      fill: var(--fill-secondary);
    }
    </style>
    <svg viewBox="-10 -10 120 120">
      <g id="whale" stroke="#333" stroke-width="2">
        <g id="whale-body">
          <path d="M5 50 a 1,1 0 0 1 60 -5 q 3 10 8 -10 q -12 -7 -7 -17 q 8 -3 12 7  q 5 -7 12 -7  q 4 14 -7 17 q -5 30 -32 40 a 1.5,1 0 0 1 -10 2 q -16 5 -30 -7 q 0 -2 3 -2 l -5 -9  q -3 1 -3 -2 q 0 0 -1 -6" />
        </g>
        <g id="whale-mouth">
          <path id="mouth" d="M 10 58.7 q 15 0 30 -7 q -15 20 -27 16 l -3.5 -8 z" />
          <path id="smile" d="M38 48 q 0 2.5 5 5" />
        </g>
        <g id="whale-eye">
          <path d="M30 40 a 1 2 0 0 1 2.5 0 a 1 2 0 0 1 -2.5 0" />
        </g>
        <g id="whale-paddle">
          <path d="M41 77 q -5 -3 -5 -10" />
          <path d="M51.1 75 c 0 -5 -3 -6 -5 -10" />
        </g>
        <g id="drops">
          <path d="M 25 15 q -4 0 -5 -3 q 2 -5 5 3" />
          <path d="M 30 12 q -3 -4 -1 -5 q 3 1 1 5" />
          <path d="M 35 15 q 0 -5 5 -5 q 4 2 -5 5" />
        </g>
      </g>
    </svg>`
  }

}


customElements.define('icon-whale', IconWhale);