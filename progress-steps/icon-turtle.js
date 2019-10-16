class IconTurtle extends HTMLElement {
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
      --stroke-primary: #333;
      --fill-primary: rgb(34, 236, 147);
      --fill-shell: #dc8e10;
      --fill-scales: #ffe612;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    #turtle {
      stroke: var(--stroke-primary);
      stroke-width: 2px;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    #turtle-body {
      fill: var(--fill-primary);
    }

    #turtle-shell {
      fill: var(--fill-shell);
    }

    .scales {
      fill: var(--fill-scales);
    }
    </style>
    <svg viewBox="-20 -15 135 130">
    <defs>
      <mask id="mask-shell">
        <path d="M38 61 a 1,1 0 0 1 55 0" fill="white" />
      </mask>
    </defs>
    <g id="turtle">
      <g id="turtle-body">
        <path d="M99 70 q -5 10 -19 15 c 7 17 -20 17 -15 3 q -10 5 -20 0 c 7 14 -23 14 -15 0 q -10 -10 -8 -40 q -30 -9 -15 -28 M7 20 c 4 -20 44 -20 37 13 l -5 5 q -5 3.5 0 11 q 30 -10 60 21" />
      </g>
      <g id="turtle-eye">
        <path d="M18 22 a 1,2 0 0 1 2 0 a 1,2 0 0 1 -2 0" />
      </g>
      <g id="turtle-smile">
        <path d="M10 42 q 2.5 0 6 -3  " />
      </g>
      <g id="turtle-shell">
        <path d="M38 60 a 1,1 0 0 1 55 0" />
        <path d="M93 60 c 15 15 -70 15 -55 0 " />
        <path class="scales" d="M52 36 q 15.5 5 26 0 v -10 h -26 v 10" mask="url(#mask-shell)" />
        <path class="scales" d="M51 41 q 6 2 12 1 q 3 5 1 10 q -9 2 -17 0 q -2 -5 3 -11" />
        <path class="scales" d="M70 43 q 6 0 12 -1 q 3 5.5 2 10 q -9 2 -16 0 q -1 -5 2 -9" />
        <path class="scales" d="M43 55 q 6 2 12 2 q 1 5 1 10 q -7 1 -15 -2 q 0 -5 2 -10" />
        <path class="scales" d="M62 57 q 6 1 12 0 q 1 5 1 10 q -7 2 -15 0 q 0 -5 2 -10" />
        <path class="scales" d="M80 57 q 6 0 10 -1 q 1 4 1 8 q -7 3 -12 2 q -1 -5 1 -9" />
      </g>
    </g>
    </svg>`;
  }
}

customElements.define('icon-turtle', IconTurtle);