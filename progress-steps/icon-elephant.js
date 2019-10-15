class IconElephant extends HTMLElement {
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
      --elephant-stroke-primary: #333;
      --elephant-fill-primary: #fd6100;
      --elephant-fill-secondary: #f9b87b;
    }

    svg {
      width: 100%;
      height: 100%;
    }
    
    #elephant {
      stroke-width: 2px;
      stroke: var(--elephant-stroke-primary);
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    #elephant-feet,
    #elephant-body,
    #elephant-head {
      fill: var(--elephant-fill-primary);
    }

    .feet-inner,
    #elephant-ears {
      fill: var(--elephant-fill-secondary);
    }

    .elephant-tusks {
      fill: white;
    }
    
    </style>
    <svg viewBox="-10 -10 120 120">
    <g id="elephant">
      <g id="elephant-body">
        <circle cx="50" cy="60" r="30" />
      </g>
      
      <g id="elephant-ears">
        <path d="M40 20 c -15 -10 -30 -3 -30 3 q 2 10 2 15 c 0 15 10 10 30 0 z"  />
        <path d="M12 38 c 0 15 10 10 30 0"  /> 

        <path d="M60 20 c 15 -10 30 -3 30 3 q -2 10 -2 15 c 0 15 -10 10 -30 0 z" />
        <path d="M88 38 c 0 15 -10 10 -30 0" />
      </g>
      <g id="elephant-head">
        <circle cx="50" cy="30" r="20" />
        <g class="elephant-tusks">
          <path d="M58 42 c 0 -2 7 -5 7 -3 c 2 0 2 15 1 15 c -2 0 -9 -12 -8 -12" />
          <path d="M42 42 c 0 -2 -7 -5 -7 -3 c -2 0 -2 15 -1 15 c 2 0 9 -12 8 -12" />
        </g>
        <g id="elephant-trunk">
          <path d="M43 38 q 4 10 2 35" />
          <path d="M57 38 q -4 10 -2 35" />
          <path d="M55 73 c 0 8 -15 8 -15 0" />
          <path d="M40 73 q 0 -5 5 -8" />
          <!-- supp -->
          <path d="M48 55 q 2 -1 4 0" />
          <path d="M48 65 q 2 -1 4 0" />
          <path d="M48 45 q 2 -1 4 0" />
        </g>
        <g id="elephant-eyes">
          <circle cx="42" cy="28" r="1" fill="black" />
          <circle cx="58" cy="28" r="1" fill="black" />
        </g>
      </g>
      <g id="elephant-feet">
        <path d="M25 90 c 0 -17 17 -10 17 0 c 0 4 -17 4 -17 0"  />
        <!-- left -->
        <path class="feet-inner" d="M25 91 a 1,1 0 0 1 5 1 a 1,1 0 0 1 6 1 a 1,1 0 0 1 5 -2 c 0 3 -16 3 -16 0" />
        <!-- right -->
        <path d="M58 90 c 0 -10 17 -17 17 0 c 0 4 -17 4 -17 0" />
        <path class="feet-inner" d="M59 91 a 1,1 0 0 1 5 1 a 1,1 0 0 1 6 0 a 1,1 0 0 1 5 -2 c 0 4 -16 4 -16 1" />
      </g>
    </g>
    </svg>`;
  }
}

customElements.define('icon-elephant', IconElephant);