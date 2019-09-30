const templateListItem = document.createElement('template')
templateListItem.innerHTML = `
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

li.action {
  animation: slide-out var(--anim-dur) cubic-bezier(0.5, -0.5, 0.5, 1.5) forwards;
}

@keyframes slide-out {
  from { transform: translate3d(0, 0, 0) rotate3d(1, 0, 0, 0deg); }
  to { transform: translate3d(-200%, 0, 0); }
}

span {
  display: inline-block;
}

#action:hover {
  cursor: pointer;
}

#action::slotted(*) {
  width: var(--icon-size, 30px);
  height: var(--icon-size, 30px);
}

svg {
  width: var(--icon-size, 30px);
  height: var(--icon-size, 30px);
  stroke: var(--action-color, #333)
}


</style>

<li>
  <span id="content"></span>
  <slot id="action" name="icon">
    <svg viewBox="0 0 100 100">
      <path stroke-width="5" d="M 25 25 L 75 75 M 25 75 L 75 25" />
    </svg>
  </slot>
</li>
`;

class ListItem extends HTMLElement {
  constructor() {
    super()

    this._root = this.attachShadow({ mode: 'open' });
    this._root.appendChild(templateListItem.content.cloneNode(true));
    
    // DOM elements
    this._listText = this._root.querySelector('#content');
    this._listAction = this._root.querySelector('#action');
    this._listAction.addEventListener('click', e => this._actionItem(e));

    // data
  }

  connectedCallback() {
    this._listText.textContent = this.getAttribute('text');
    this._animDuration = this.getAttribute('anim-dur');
    this._root.host.style.setProperty('--anim-dur', `${this._animDuration}ms`);
  }

  disconnectedCallback() {
    this._listAction.removeEventListener('click', this._actionItem);
  }

  _actionItem(e) {
    this._root.querySelector('li').classList.add('action');
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('action', { detail: this.getAttribute('key') }));
    }, this._animDuration);
  }
}

customElements.define('list-item', ListItem);