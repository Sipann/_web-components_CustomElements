class IconRabbit extends HTMLElement {
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
      --rabbit-stroke-primary: #333;
      --rabbit-fill-primary: yellow;
      --rabbit-fill-secondary: pink;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    #rabbit {
      stroke: var(--rabbit-stroke-primary);
      stroke-width: 2px;
      stroke-linecap: round;
      stroke-linejoin: round;
      transform-origin: 50% 50%;
      transform: rotate(3deg) translate(1.2px, 0);
    }

    #rabbit-tail {
      fill: var(--rabbit-fill-secondary);
    }

    #rabbit-head,
    #rabbit-body {
      fill: var(--rabbit-fill-primary);
    }
    
    </style>
    <svg viewBox="-10 -10 120 120">
    <g id="rabbit">
      <g id="rabbit-tail">
        <circle cx="7" cy="80" r="5" />
      </g>
      <g id="rabbit-body">
        <path d="M55 46 a 1,1 0 0 0 -40 40 c -10 15 40 10 40 0 q 15 10 20 0 c 10 2 15 -8 10 -10 l -3 -2 z " />
        <!-- supp -->
        <path d="M55 86 c 0 -15 -17 -4 -17 -4" fill="none" />
        <path d="M75 86 c 2 -8 0 -5 -10 -10" fill="none" />
      </g>
      <g id="rabbit-head">
        <path d="M71 22 c 0 -10 -18 -28 -22 -15 l 5 15 z" />
        <path d="M52 32 c -20 20 22 55 38 35 c 20 -20 -9 -55 -25 -45 c -2 -7 -20 -28 -25 -17 q -2 15 12 27" />
        <circle cx="90" cy="67" r="2" fill="#333" stroke="#333" />
        <path id="rabbit-eye" d="M77 55 a 1,1 0 0 1 2 0 a 1,1 0 0 1 -2 0" />
      </g>
    </g>
  </svg>`;
  }
}

customElements.define('icon-rabbit', IconRabbit);