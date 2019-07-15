const template = document.createElement('template')
template.innerHTML = `
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:host {
  display: flex;
  contain: content;
  font-family: var(--font-family, sans-serif);
}

.rating-container {
  position: relative;
}

.rating-inner {
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  overflow: hidden;
  width: var(--rating-width);
}

.rating-container::before,
.rating-inner::before {
  content: var(--icon);
  font-family: var(--icon-family);
  font-weight: normal;

  height: 100%;
  vertical-align: var(--icon-align);
}

.rating-container::before {
  color: var(--frame-color, #ccc);
}

.rating-inner::before {
  color: var(--rating-color, #f44336);
}

.numeric {
  font-size: var(--num-size, 3rem);
  color: var(--num-color, #333);
  display: inline-block;
}


</style>
<div class="rating-container">
  <div class="rating-inner"></div>
</div>
<p class="numeric"></p>
`;


class IconRating extends HTMLElement {
  constructor() {
    super()

    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(template.content.cloneNode(true))
    
    this.$ratingNum = this.shadowRoot.querySelector('.numeric')
  }

  connectedCallback() {
    this._max = this.hasAttribute('max') ? this.getAttribute('max') : 5

    // get && check rating attribute
    if (this.hasAttribute('rating')) {
      let rating = this.getAttribute('rating')
      try {
        if ((rating < 0) || (rating > this._max)) {  
          throw new RangeError('rating must be in range [0 - max value]')
        }
        this._rating = rating
      } catch (e) { console.log(e) }
    } else {
      this._rating = 0
    }

    // get num attribute
    if (this.hasAttribute('num')) {
      this.$ratingNum.textContent = this._rating
    }

    // get rounding attribute
    this._rounding = this.hasAttribute('rounding') ? this.getAttribute('rounding') : ''


    // get && check icon-family attribute + set --icon-family CSS variable
    try {
      if (!this.hasAttribute('icon-family')) {
        throw new Error('icon-family attribute is required')
      }
      this._iconFamily = this.getAttribute('icon-family')
      this.shadowRoot.host.style.setProperty('--icon-family', `"${this.getAttribute('icon-family')}"`)
    } catch (e) { console.log(e) }


    // get && check icon attribute + set --icon CSS variable
    try {
      if (!this.hasAttribute('icon')) {
        throw new Error('icon attribute is required')
      }
      this._icon = this.getAttribute('icon')
      let icon = '"';
      if (this._iconFamily === 'Material Icons') {
        for (let i=0; i<this._max; i++) { icon += `${this._icon} `}   // e.g "link link link link link "
      } else {
        for (let i=0; i<this._max; i++) { icon += `\\${this._icon} `} // e.g. "\\f005 \\f005 \\f005 \\f005 \\f005" renders "\f005 \f005 \f005 \f005 \f005"
      }
      icon += '"'
      this.shadowRoot.host.style.setProperty('--icon', icon)
      this._setGrade()
    } catch (e) { console.log(e) }

  }

  _setGrade() {
    let grade = this._rating
    let float;
    switch(this._rounding) {
      case 'full':
        grade = Math.round(grade)
        break;
      case 'floor':
        grade = Math.floor(grade)
        break;
      case 'ceil':
        grade = Math.ceil(grade)
        break;
      case 'half-floor':
        float = grade % 1
        if (float < 0.5) { grade = Math.floor(grade) }  
        else { grade = Math.floor(grade) + 0.5 }        
        break;
      case 'half-ceil':
        float = grade % 1
        if (float < 0.5) { grade = Math.floor(grade) + 0.5 }  
        else { grade = Math.ceil(grade) }               
        break;
      default:
        console.log('switch case not available, equivalent to "none"')
    }
    this._setWidth(grade)
  }

  _setWidth(grade) {
    let width = 100 * grade / this._max
    this.shadowRoot.host.style.setProperty('--rating-width', `${width}%`)
  }

}



customElements.define('icon-rating', IconRating)