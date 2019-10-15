class IconBear extends HTMLElement {
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
      --bear-stroke-primary: #333;
      --bear-fill-primary: #fd6100;
      --bear-fill-secondary: #f9b87b;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    #bear {
      stroke-width: 2px;
      stroke: var(--bear-stroke-primary);
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    #bear-head {
      fill: var(--bear-fill-primary);
    }
  
    #bear-ears,
    #bear-body,
    #bear-arms,
    #bear-legs {
      fill:var(--bear-fill-primary);
    }
  
    #lips,
    .ears-inner,
    .feet-inner,
    #muzzle {
      fill: var(--bear-fill-secondary);
    }
  
    #nose,
    .eyes {
      fill: var(--bear-stroke-primary);
    }
    </style>
    <svg viewBox="-15 -15 130 130">

     <g id="bear">

      <g id="bear-arms">
        <path d="M61 45 q 0 0 17 5 a 1,1 0 0 1 7 9 q -5 5 -20 0 z" />
        <path d="M39 45 q 0 0 -17 5 a 1,1 0 0 0 -7 9 q 5 5 20 0 z" />
      </g>

      <g id="bear-legs">
        <path d="M70 70 l 14 5 v 17 l -28 -10 z" />
        <path d="M30 70 l -14 5 v 17 l 28 -10 z" />

        <path class="feet-outer" d="M 16 72 a 2.5,3 0 0 1 0 20 a 2.5,3 0 0 1 0 -20" />
        <path class="feet-inner" d="M 16 76 a 2,3 0 0 1 0 12 a 2,3 0 0 1 0 -12" />
        <path class="feet-outer" d="M 84 72 a 2.5,3 0 0 1 0 20 a 2.5,3 0 0 1 0 -20" />
        <path class="feet-inner" d="M84 76 a 2,3 0 0 1 0 12 a 2,3 0 0 1 0 -12" />
      </g>

      <g id="bear-body">
        <path d="M40 40 q -20 40 -10 45 c 5 5 35 5 40 0 q 10 -5 -10 -45 z" />
      </g>

      <g id="bear-ears">
        <circle class="ears-outer" cx="30" cy="20" r="10" />
        <circle class="ears-inner" cx="30" cy="20" r="5.5" />
        <circle class="ears-outer" cx="70" cy="20" r="10" />
        <circle class="ears-inner" cx="70" cy="20" r="5.5" />
      </g>
      <g id="bear-head">
        <circle cx="50" cy="30" r="20" />
        <path id="lips" d="M46 42 a 2,1.5 0 0 0 8 0 v -4 h -8 z" />
        <path id="muzzle" d="M42.5 37 a 2,1.7 0 0 1 15 0 a 2,1.2 0 0 1 -15 0" />
        <path id="nose" d="M47 35 a 1,0.5 0 0 1 6 0 a 1,0.5 0 0 1 -6 0" />
        <path class="eyes" d="M40 30 a 2,3 0 0 1 0 3 a 2,3 0 0 1 0 -3" />
        <path class="eyes" d="M60 30 a 2,3 0 0 1 0 3 a 2,3 0 0 1 0 -3" />
      </g>
    </g>

    </svg>
    `;
  }
}

customElements.define('icon-bear', IconBear);