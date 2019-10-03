const templateIconRatingIcons = document.createElement('template');
templateIconRatingIcons.innerHTML = `
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: 0;
}

:host {
  display: block;
}

.container {
  position: relative;
  height: var(--icon-size, 5rem);
}

.rating-outer {
  position: absolute;
  top: 0;
  left: 0;
}

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

.rating-outer i {
  display: inline;
  font-style: normal;
  font-size: var(--icon-size, 5rem);
  color: var(--frame-color, #ccc);
}

.rating-inner i {
  display: inline;
  font-style: normal;
  font-size: var(--icon-size, 5rem);
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

class IconRating extends HTMLElement {
  constructor() {
    super()

    this._root = this.attachShadow({ mode: 'open' });
    this._root.appendChild(templateIconRatingIcons.content.cloneNode(true));

    // DOM elements
    this._ratingOuter = this._root.querySelector('.rating-outer p')
    this._ratingInner = this._root.querySelector('.rating-inner p')

    // data
    this._color1 = 'red';
    this._color2 = 'red';
    this._max = 5;
    this._rating = 0;
    this._rounding = '';

  }

  connectedCallback() {
    this._max = this.getAttribute('max') || 5;
    this._rating = this.getAttribute('rating') || 0
    this._rounding = this.getAttribute('rounding') || ''

    this._color1 = this.getAttribute('color1') || 'red'
    this._color2 = this.getAttribute('color2') ||  this._color1
    this._root.host.style.setProperty('--color1', this._color1)
    this._root.host.style.setProperty('--color2', this._color2)

    this._setIcon()

    this._setGrade()
  }

  _setIcon() {
    // to be overriden by extended class components
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
    this._root.host.style.setProperty('--rating-width', `${ratingWidth}%`)
  }

}

customElements.define('icon-rating', IconRating)



class IconRatingMi extends IconRating {
  constructor() {
    super();

    let customStyleTemplate = document.createElement('template');
    customStyleTemplate.innerHTML = `
    <style>
    .container {
      display: flex;
      width: 100%;
    }
    
    .rating-outer i {
      letter-spacing: var(--letter-spacing, initial);
    }
    
    .rating-inner i {
      letter-spacing: var(--letter-spacing, initial);
    }

    </style>
    `;
    this._root.appendChild(customStyleTemplate.content.cloneNode(true));

    this._icon = '';
  }

  _setIcon() {
    this._icon = this.getAttribute('icon-name')
    for (let i=0; i<this._max; i++) {
      let icon = document.createElement('i')
      icon.className="material-icons"
      icon.textContent=this._icon
      this._ratingOuter.appendChild(icon)
    }
    for (let i=0; i<this._max; i++) {
      let icon = document.createElement('i')
      icon.className="material-icons"
      icon.textContent=this._icon
      this._ratingInner.appendChild(icon)
    }
  }
}

customElements.define('icon-rating-mi', IconRatingMi)




class IconRatingFa extends IconRating {
  constructor() {
    super();

    let customStyleTemplate = document.createElement('template');
    customStyleTemplate.innerHTML = `
    <link href="https://use.fontawesome.com/releases/v5.0.8/css/all.css" rel="stylesheet">
    <style>

    .rating-outer p {
      font-size: var(--icon-size, 5rem);
      letter-spacing: var(--letter-spacing, initial);
      color: var(--frame-color, #ccc);
    }
    
    .rating-inner p {
      font-size: var(--icon-size, 5rem);
      letter-spacing: var(--letter-spacing, initial);
      color: rgba(255, 255, 255, 0.1):
    }

    
    </style>
    `;
    this._root.appendChild(customStyleTemplate.content.cloneNode(true));

    this._icon = '';
  }

  _setIcon() {
    this._icon = this.getAttribute('icon-name')
    for (let i=0; i<this._max; i++) {
      let icon = document.createElement('i')
      icon.className=this._icon
      this._ratingOuter.appendChild(icon)
    }
    for (let i=0; i<this._max; i++) {
      let icon = document.createElement('i')
      icon.className=this._icon
      this._ratingInner.appendChild(icon)
    }
  }
}

customElements.define('icon-rating-fa', IconRatingFa);