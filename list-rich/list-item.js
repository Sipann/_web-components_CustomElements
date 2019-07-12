const templateItem = document.createElement('template')
templateItem.innerHTML = `
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



li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 10px;
  border-radius: .2rem;
  list-style-type: none;
  background: var(--list-item-bg, #fff);
  color: var(--list-item-color, #333);
  font-size: 1.15rem;

  transform: translate3d(0, -60%, 0) rotate3d(1, 0, 0, -85deg);
  animation: slide-in var(--anim-dur) cubic-bezier(0.5, -0.5, 0.5, 1.5) forwards;
}


@keyframes slide-in {
  to { transform: translate3d(0, 0, 0) rotate3d(1, 0, 0, 0deg); }
}

li.removed {
  animation: slide-out var(--anim-dur) cubic-bezier(0.5, -0.5, 0.5, 1.5) forwards;
}

@keyframes slide-out {
  from { transform: translate3d(0, 0, 0) rotate3d(1, 0, 0, 0deg); }
  to { transform: translate3d(-200%, 0, 0); }
}

span {
  display: inline-block;
}

#remove:hover {
  cursor: pointer;
}

#remove::slotted(*) {
  width: var(--icon-size, 30px);
  height: var(--icon-size, 30px);
}

svg {
  width: var(--icon-size, 30px);
  height: var(--icon-size, 30px);
  stroke: var(--remove-color, #333)
}

</style>

<li>
  <span id="content"></span>
  <slot id="remove" name="icon">
    <svg viewBox="0 0 100 100">
      <path stroke-width="5" d="M 25 25 L 75 75 M 25 75 L 75 25" />
    </svg>
  </slot>
</li>
`;


class ListItem extends HTMLElement {
  constructor() {
    super()

    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(templateItem.content.cloneNode(true))

    this.$listText = this.shadowRoot.querySelector('#content')
    this.$listRemove = this.shadowRoot.querySelector('#remove')
    this.$listRemove.addEventListener('click', e => this._removeItem(e))
  }

  connectedCallback() {
    this.$listText.textContent = this.getAttribute('text')
    this._animDuration = this.hasAttribute('anim-dur') ? this.getAttribute('anim-dur') : 0
    this.shadowRoot.host.style.setProperty('--anim-dur', `${this._animDuration}ms`)
  }

  disconnectedCallback() {
    this.$listRemove.removeEventListener('click', this._removeItem)
  }

  _removeItem(e) {
    this.shadowRoot.querySelector('li').classList.add('removed');
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('remove', { detail: this.getAttribute('key') }))
    }, this._animDuration)
  }

}

customElements.define('list-item', ListItem)