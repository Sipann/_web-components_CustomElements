const templateCard = document.createElement('template')
templateCard.innerHTML = `
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:host {
  display: block;
}

section.card {
  width: 100%;
  height: 100%;
  background: var(--bg-color);
}
</style>
<section class="card">
  <slot>slotted text</slot>
  <button>Flip</button>
</section>
`;



class CardBasic extends HTMLElement {

  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(templateCard.content.cloneNode(true))

    this.$button = this.shadowRoot.querySelector('button')
    this.$button.addEventListener('click', this._flip.bind(this))
  }

  connectedCallback() {
    let bgColor = this.hasAttribute('bg-color') ? this.getAttribute('bg-color') : 'tomato'
    this.shadowRoot.host.style.setProperty('--bg-color', bgColor)
  }

  _flip() {
    const flipEvent = new Event('flip')
    this.dispatchEvent(flipEvent)
  }

}

customElements.define('card-basic', CardBasic)