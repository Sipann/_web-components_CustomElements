const templateIconRatingLgMi = document.createElement('template')
templateIconRatingLgMi.innerHTML = `
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:host {
  display: block;
}

.container {
  position: relative;
  height: var(--icon-size, 5rem);
  display: flex;
}

.rating-outer,
.rating-inner {
  position: absolute;
  top: 0;
  left: 0;
}

.rating-inner p {
  background: -webkit-linear-gradient(left, var(--color1), var(--color2));
  background-clip: text;
  -webkit-background-clip: text;
  clip-path: polygon(0 0, var(--rating-width) 0, var(--rating-width) 100%, 0 100%);
}

.rating-outer i,
.rating-inner i {
  display: inline;
  font-style: normal;
  font-size: var(--icon-size, 5rem);
}

.rating-outer i {
  color: var(--frame-color, #ccc);
}

.rating-inner i {
  color: rgba(255, 255, 255, 0.1);
}


</style>

<div class="container">
  <div class="rating-outer">
    <p></p>
  </div>
  <div class="rating-inner">
    <p></p>
  </div>
</div>
`;


class IconRatingLgMi extends HTMLElement {
  constructor() {
    super()

    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(templateIconRatingLgMi.content.cloneNode(true))

    this.$ratingOuter = this.shadowRoot.querySelector('.rating-outer p')
    this.$ratingInner = this.shadowRoot.querySelector('.rating-inner p')

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
    
    
    this._rounding = this.hasAttribute('rounding') ? this.getAttribute('rounding') : ''
    this._color1 = this.hasAttribute('color1') ? this.getAttribute('color1') : 'red'
    this._color2 = this.hasAttribute('color2') ? this.getAttribute('color2') : this._color1
    this.shadowRoot.host.style.setProperty('--color1', this._color1)
    this.shadowRoot.host.style.setProperty('--color2', this._color2)


    this._icon = this.getAttribute('icon-name')
    for (let i=0; i<this._max; i++) {
      let icon = document.createElement('i')
      icon.className="material-icons"
      icon.textContent=this._icon
      this.$ratingOuter.appendChild(icon)
    }
    for (let i=0; i<this._max; i++) {
      let icon = document.createElement('i')
      icon.className="material-icons"
      icon.textContent=this._icon
      this.$ratingInner.appendChild(icon)
    }

    this._setGrade()
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
    let ratingWidth = 100 * grade / this._max
    this.shadowRoot.host.style.setProperty('--rating-width', `${ratingWidth}%`)
  }

}

customElements.define('icon-rating-lg-mi', IconRatingLgMi)

