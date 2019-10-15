class IconMonkey extends HTMLElement {
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
      --monkey-stroke-primary: #333;
      --monkey-fill-primary: #c46f07;
      --monkey-fill-secondary: #b4c707;
      --monkey-fill-tertiary: #c19c07;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    #monkey {
      stroke: var(--monkey-stroke-primary);
      stroke-width: 2px;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: var(--monkey-fill-primary);
    }

    .monkey-body-supp,
    #monkey-mouth {
      fill: none;
    }

    #monkey-nose,
    .monkey-feet {
      fill: var(--monkey-fill-tertiary);
    }

    .monkey-ears {
      fill: var(--monkey-fill-secondary);
    }
    </style>
    <svg viewBox="-10 -10 120 120">
      <g id="monkey">
        <g class="monkey-feet">
          <path d="M35 84 q 0 0 -7 7 q 15 10 14 -4 l -4 -7 z" />
          <path d="M72 91 q -15 10 -14 -4" /> -->
          <path d="M65 84 q 0 0 7 7 q -15 10 -14 -4 l 4 -7 z" />
        </g>
        <g id="monkey-body">
          <path d="M35 25 q -15 15 -5 55 q -6 2 0 9 l 5 -5 q 15 8 30 0 l 5 5 q 6 -7 0 -9 q 10 -40 -5 -55 z"/>
        </g>
        <g class="monkey-body-supp">
          <path d="M35 84 q -5 -20 3 -50" />
          <path d="M65 84 q 5 -20 -3 -50" />
        </g>
        <g class="monkey-ears">
          <path d="M44 12 c -18 -10 -18 20 0 10" />
          <path d="M56 12 c 18 -10 18 20 0 10" />
          <path d="M37 15 c -5 -5 -5 10 0 5" />
          <path d="M63 15 c 5 -5 5 10 0 5" />
        </g>
        <g id="monkey-head">
          <path d="M40 15 a 2,1.7 0 0 1 20 0 a 2,1.7 0 0 1 -20 0" />
        </g>
        <g class="monkey-eyes">
          <path d="M46 12 a 1,5 0 0 1 1 0 a 1,5 0 0 1 -1 0" />
          <path d="M53 12 a 1,5 0 0 1 1 0 a 1,5 0 0 1 -1 0" />
        </g>
        <g id="monkey-nose">
          <circle cx="50" cy="26.5" r="10" />
        </g>
        <g id="monkey-mouth">
          <path d="M45 30 a 2,1.3 0 0 0 10 0" />
        </g>
        <g class="monkey-nostrils">
          <path d="M48 22 a 1,1 0 0 1 1 0 a 1,1 0 0 1 -1 0" />
          <path d="M51 22 a 1,1 0 0 1 1 0 a 1,1 0 0 1 -1 0" />
        </g>
      </g>
    </svg>`;
  }
}

customElements.define('icon-monkey', IconMonkey);