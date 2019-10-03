class IconStar extends HTMLElement {
  constructor() {
    super()
    this._root = this.attachShadow({ mode: 'open' });
    this._root.innerHTML = `
    <svg viewBox="0 0 100 100">
      <path d="M 67.857141,90.756306 C 62.023027,94.047936 51.101659,76.499823 44.476058,75.513346 37.499485,74.474613 21.26298,87.817396 16.068282,83.045955 11.134916,78.514552 24.449274,62.705048 23.340047,56.09889 22.172061,49.142788 4.4649639,37.824101 7.3976244,31.409193 10.182751,25.317002 29.332845,33.094304 35.272905,29.997951 41.527623,26.737578 46.820541,6.3994604 53.827722,7.206271 c 6.654669,0.766222 5.17572,21.382362 9.956106,26.074869 5.033614,4.94108 26.011915,3.69012 27.40993,10.603664 1.327686,6.565742 -18.736449,11.529915 -21.722068,17.526397 -3.143774,6.314129 4.528611,25.87911 -1.614549,29.345105 z" />
    </svg>
    `;
    
  }

}

customElements.define('icon-star', IconStar);