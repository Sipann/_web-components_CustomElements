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
  font-family: var(--font-family, sans-serif);
}

section.card {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: var(--top-height) var(--bottom-height);
  border-radius: var(--rounded);
  box-shadow: var(--shadow, 5px) var(--shadow, 5px) var(--shadow, 5px) var(--shadow-color, #bbb)
}

.top {
  position: relative;
  background: var(--bg-top, #aba6bf);
  border-radius: var(--rounded) var(--rounded) 0 0;
}

#top-slot::slotted(*) {
  height: 100%;
}

.bottom {
  background: var(--bg-bottom, #eee);
  border-radius: 0 0 var(--rounded) var(--rounded);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#content {
  display: contents;
}

.flip {
  position: absolute;
  width: 40px;
  height: 40px;
  background: var(--flip-bg, #595775);
  top: -20px;
  right: 10%;
  border-radius: 50%;
}

.flip:hover {
  cursor: pointer;
}

.flip path:nth-of-type(1) {
  stroke: var(--flip-icon, #fff);
}

.flip path:nth-of-type(2) {
  fill: var(--flip-icon, #fff);
}

</style>
<section class="card">
  <div class="top">
    <slot id="top-slot" name="top"></slot>
  </div>
  <div class="bottom">
    <div class="flip">
      <slot name="icon">
        <svg viewBox="0 0 100 100">
          <path fill="none" stroke-width="5" d="M 30 50 A 20, 20 0 1 0 50 30" />
          <path stroke-width="5" d="M 50 20 l -15 10 l 15 10 z" />
        </svg>
      </slot>
    </div>
    <slot id="content-title" name="title"></slot>
    <slot id="content-summary" name="summary"></slot>
  </div>
</section>
`;



class CardTemplate extends HTMLElement {

  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(templateCard.content.cloneNode(true))

    this.$button = this.shadowRoot.querySelector('.flip')
    
  }

  connectedCallback() {
    let rounded = this.hasAttribute('rounded') ? 5 : 0
    this.shadowRoot.host.style.setProperty('--rounded', `${rounded}%`)

    if (this.hasAttribute('flippable')) {
      this.$button.addEventListener('click', this._flip.bind(this))
    } else {
      this.$button.style.display = 'none'
    }

    let top;
    let bottom;
    let height = window.getComputedStyle(this).getPropertyValue('height')
      let regex = /[a-z]/gi
      height = height.replace(regex, '')
    if (this.hasAttribute('top')) {
      top = this.getAttribute('top')
    } else {
      top = height * 2 / 3
    }
    bottom = height - top
    this.shadowRoot.host.style.setProperty('--top-height', `${top}px`)
    this.shadowRoot.host.style.setProperty('--bottom-height', `${bottom}px`)
  }

  disconnectedCallback() {
    this.$button.removeEventListener('click', this._flip)
  }

  _flip() {
    const flipEvent = new Event('flip')
    this.dispatchEvent(flipEvent)
  }

}

customElements.define('card-two-zones', CardTemplate)