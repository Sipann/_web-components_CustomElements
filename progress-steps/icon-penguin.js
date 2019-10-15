class IconPenguin extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._root.innerHTML = `
    <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :host {
      display: inline-block;
      --penguin-stroke-primary: #333;
      --penguin-fill-primary: #fff;
      --penguin-fill-secondary: #f9b87b;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    #penguin {
      stroke-width: 2px;
      stroke: var(--penguin-stroke-primary);
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    #penguin-arms {
      fill: var(--penguin-stroke-primary);
    }
  
    #penguin-body {
      fill: var(--penguin-fill-primary);
    }
  
    #penguin-black {
      fill: var(--penguin-stroke-primary);
    }
  
    #penguin-nose,
    #penguin-feet {
      fill: var(--penguin-fill-secondary);
    }

    </style>
    <svg viewBox="-10 -10 120 120">
      <g id="penguin">
        <g id="penguin-feet">
          <path d="M32 84 l -5 12 l 15 -10 z" />
          <path d="M68 84 l 5 12 l -15 -10 z" />
        </g>
        <g id="penguin-body">
          <path d="M50 10 q -15 0 -15 15 q 0 3 3 15 c -15 10 -15 40 -8 45 c 1 2 10 5 20 5 c 10 0 19 -3 20 -5 c 7 -5 7 -35 -8 -45 q 3 -9 3 -15 q 0 -15 -15 -15" />
        </g>
        <g id="penguin-black">
          <path d="M50 10 q -15 0 -15 15 q 0 3 3 15 q 0 -20 2 -22 q 5 -5 10 0 q 5 -5 10 0 q 2 2 2 22 q 3 -9 3 -15 q 0 -15 -15 -15" />
          <path d="M38 40 c -15 10 -15 40 -8 45 q -6 -20 8 -45"  />
          <path d="M70 85 c 7 -5 7 -35 -8 -45 q 14 25 8 45" />
        </g>
        <g id="penguin-nose">
          <path d="M47 30 h 6 q 2 4 -3 14 q -6 -10 -3 -14" /> 
        </g>
        <g id="penguin-eyes">
          <path d="M45 25 a 1,1.3 0 0 1 2 0 a 1,1.3 0 0 1 -2 0" />
          <path d="M53 25 a 1,1.3 0 0 1 2 0 a 1,1.3 0 0 1 -2 0" />
        </g>
        <g id="penguin-arms">
          <path d="M30 50 l -15 15 l 12 -5 z" />
          <path d="M70 50 l 15 15 l -12 -5 z" />
        </g>
      </g>
    </svg>`;
  }
}

customElements.define('icon-penguin', IconPenguin);