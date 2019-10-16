class IconCat extends HTMLElement {
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
      --fill-primary: rgb(162, 133, 107);
    }

    svg {
      width: 100%;
      height: 100%;
    }

    #cat {
      stroke: var(--stroke-primary);
      stroke-width: 2px;
      fill: var(--fill-primary);
      stroke-linecap: round;
      stroke-linejoin: round;
      transform: translate(0,-1px);
    }

    #cat-head .eyes {
      stroke: none;
      fill: var(--stroke-primary);
    }
    </style>
    <svg viewBox="-10 -15 120 115">
      <g id="cat">
        <g id="cat-head">
          <path id="head" d="M30 19 c -10 25, 50 25, 40 0 q 3 -7.5 2 -15 l -10 5 q -14 -8 -28 0 l -10 -5 q 3 12 6 15"  />
          <path class="eyes" d="M36 19 a 4 2 0 0 1 8 0 a 4 2 0 0 1 -8 0 " />
          <path class="eyes" d="M56 19 a 4 2 0 0 1 8 0 a 4 2 0 0 1 -8 0" />
          <path id="nose" d="M47 24 h6 a 2 2 0 0 1 -6 0 m 3 5 v 3 m -5 0 a 2 1 0 0 0 5 0 a 2 1 0 0 0 5 0 " />
          <path class="hair" d="M65 24 L 80 21" />
          <path class="hair" d="M65 27 L 80 27" />
          <path class="hair" d="M65 30 L 80 33" />
          <path class="hair" d="M35 24 L 20 21" />
          <path class="hair" d="M35 27 L 20 27" />
          <path class="hair" d="M35 30 L 20 33" />
        </g>

        <g id="cat-tail">
            <path id="tail" d="M 70 79 c 20 -15 10 -40 20 -50 q -3 -2 -5 0 c -8 15 -5 30 -18 40" />
          </g>

        <g id="cat-body">
          <path d="M42 38 c 3 15 -15 30 -12 51 q 20 10 40 0  c 3 -21 -15 -36 -12 -51" />
        </g>

        <g id="cat-feet">
          <path d="M30 89 l 5 2 c -6 7 10 10 7 2 q 8 5 16 0 c -3 8 14 6 7 -2 l 5 -2" />
          <path d="M35 91 v-15" />
          <path d="M42 93 v-13" />
          <path d="M58 93 v-13" />
          <path d="M65 91 v-15" />
        </g>
      </g>
    </svg>
    `;
  }
}

customElements.define('icon-cat', IconCat);