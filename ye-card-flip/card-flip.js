const templateFlip = document.createElement('template')
templateFlip.innerHTML = `
<section>
  <figure>
    <slot name="front"></slot>
  </figure>
  <figure id="back">
    <slot name="back"></slot>
  </figure>
</section>
`;


const styleFlip = document.createElement('style')
styleFlip.innerHTML = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:host {
  display: block;
  position: relative;
  perspective: 800px;
  
}

:host([flipped]) section {
  transform: rotate3D(0, 1, 0, 180deg);
}

section {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform var(--flip-dur);
}

figure {
  margin: 0;
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

figure#back {
  transform: rotate3D(0, 1, 0, 180deg);
}

`;

class CardFlip extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(templateFlip.content.cloneNode(true))
    this._shadowRoot.appendChild(styleFlip)
    this._nodes = []
  }

  connectedCallback() {
    let flipDur = this.hasAttribute('flip-dur') ? this.getAttribute('flip-dur') : '.8s'
    this.shadowRoot.host.style.setProperty('--flip-dur', flipDur)
    
    let cards = this.shadowRoot.querySelectorAll('slot')
    for (let i=0; i<cards.length; i++) {
      let card = cards[i]
      card.addEventListener('slotchange', e => {this._setSlots(e, i, card) })
    }
  }

  disconnectedCallback() {
    this._nodes.forEach(node => {
      node[0].removeEventListener('flip', this._flipCard)
    })  
    let cards = this.shadowRoot.querySelectorAll('slot')
    cards.forEach(card => {
      card.removeEventListener('slotchange', this._setSlots)
    })    
  }

  static get observedAttributes() {
    return ['flipped']
  }

  _flipCard() {
    if (this.hasAttribute('flipped')) {  this.removeAttribute('flipped')  } 
    else { this.setAttribute('flipped', '') }
  }

  _setSlots(e, i, card) {
    let node = card.assignedNodes()
    this._nodes.push(node)
    node[0].addEventListener('flip', e => { this._flipCard() })
    if (i === 0) {
      let width = window.getComputedStyle(node[0], null).getPropertyValue('width')
      let height = window.getComputedStyle(node[0], null).getPropertyValue('height')
      this.shadowRoot.host.style.setProperty('width', width)
      this.shadowRoot.host.style.setProperty('height', height)
    }
  }

}


customElements.define('card-flip', CardFlip)