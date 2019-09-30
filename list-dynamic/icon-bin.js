class IconBin extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._root.innerHTML = `
    <style>
      svg {
        stroke: #333;
        stroke-width: 3px;
      }

      path {
        fill: none;
      }

      svg:hover #bin-cover {
        transform: rotate3d(0, 0, 1, 15deg);
      }

      path#bin-cover {
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: transform 0.4s;
        transform-origin: 85% 30%;
      }
    </style>
    <svg viewBox="0 0 100 100">      
      <path id="bin-body" d="M15 30 h 70 v 5 h -70 v-5 M20 35 L 30 90 L70 90 L 80 35 M50 40 v 45 M 35 40 L 40 85 M 65 40 L 60 85" />
      <path id="bin-cover" d="M85 30 h -70 a 1,3 0 0,1 0 -5 h 70 a 1, 3 0 0,1 0 5 M45 25 a 1,1 0 0, 1 10 0" />
    </svg>
    `
  }
}

customElements.define('icon-bin', IconBin);