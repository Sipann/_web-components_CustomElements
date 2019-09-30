const templateListDynamic = document.createElement('template')
templateListDynamic.innerHTML = `
<section>
  <form>
    <slot name="input">
      <input type="text" placeholder="New Item" />
    </slot>
    
    <button id="btn">
      <slot name="add">
        <span>Add</span>
      </slot>
    </button>
  </form>
  <ul></ul>
</section>
`;

const style = document.createElement('style')
style.innerHTML = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  --font-family: var(--font);
  --list-item-bg: var(--item-bg);
  --list-item-color: var(--item-color);
  --icon-size: var(--icon-width);
  --action-color: var(--icon-color);
}

:host {
  display: block;
}

section {
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--component-bg, #78d6ac);
}

form {
  width: 95%;
  overflow: hidden;
  display: flex;
  background: #fff;
  border-radius: .2rem;
  border: solid 4px #fff;
  box-shadow: 0 1px 14px rgba(0, 0, 0, 0.2);
  position: relative;
}

input {
  width: 100%;
  padding: 12px;
  border: none;
  outline: none;
  font-size: 1.15rem;
}

::placeholder {
  opacity: .5;
}

input:focus::placeholder {
  opacity: 0;
}

#btn {
  padding: 0.8rem 1.6rem;
  border: 2px solid var(--btn-bg-color, #5aa382);
  border-radius: .2rem;
  background: var(--btn-bg-color, #5aa382);
  font-size: 1rem;
  font-weight: 600;
  color: var(--btn-color, #fff);
  cursor: pointer; 
  transition: all .3s;
}

#btn:hover {
  border: 2px solid var(--btn-color, #5aa382);
  background: var(--btn-color, #fff);
  color: var(--btn-bg-color, #5aa382);
}

#btn[disabled] {
  opacity: 0.5;
}

#btn[disabled]:hover {
  background: var(--btn-bg-color, #5aa382);
  color: var(--btn-color, #fff);
  cursor: default;
}

ul {
  width: 95%;
}
`;

class ListDynamic extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._root.appendChild(templateListDynamic.content.cloneNode(true));
    this._root.appendChild(style);

    // DOM elements
    this._ulContainer = this._root.querySelector('ul');
    this._input = this._root.querySelector('input');
    this._input.addEventListener('input', () => {
      if (this._buttonAdd.hasAttribute('disabled')) {
        this._allowEntry()
      }
    });
    this._buttonAdd = this._root.querySelector('button');
    this._buttonAdd.addEventListener('click', e => this._setItem(e));

    // data
    this._index = 0;
    this._items = [];
    this._allowIdentical = false;
    
  }

  connectedCallback() {
    if (this.getAttribute('identical')) {
      this._allowIdentical = this.getAttribute('identical');
    }
  }


  disconnectedCallback() {
    let listItems = this._root.querySelectorAll('list-item');
    listItems.forEach(item => {
      item.removeEventListener('action', this._removeItem);
    });
    
    this._buttonAdd.removeEventListener('click', this._setItem);
  }

  _addItem(newItem) {
    let item = { title: newItem, key: this._index };
    this._items = [...this._items, item];

    let listItem = document.createElement('list-item');

    
    if (this.getAttribute('icon')) {
      let icon = document.createElement(this.getAttribute('icon'));
      icon.setAttribute('slot', 'icon');
      icon.setAttribute('id', 'action');
      listItem.appendChild(icon);
    }
    

    listItem.setAttribute('text', item.title);
    listItem.setAttribute('key', item.key);
    let animDuration = this.hasAttribute('anim-dur') ? this.getAttribute('anim-dur') : 0;
    listItem.setAttribute('anim-dur', animDuration);
    listItem.addEventListener('action', e => this._removeItem(e));

    this._ulContainer.appendChild(listItem);
    
    this._input.value = '';
    this._index += 1;
  }

  _allowEntry () {
    this._buttonAdd.removeAttribute('disabled');      
  }

  _removeItem(e) {
    // update this._items
    let index = this._items.findIndex(item => item.key == e.detail);
    this._items.splice(index, 1);
    // update UI
    let listEl = this._root.querySelector(`list-item[key="${e.detail}"]`);
    listEl.parentElement.removeChild(listEl);
  }
 

  _setItem(e) {
    e.preventDefault();
    let newItem = this._input.value.trim();
    if (newItem) {
      this._buttonAdd.removeAttribute('disabled');
      if (this._allowIdentical) { this._addItem(newItem); } 
      else {
        let check = this._items.filter(item => {
          return item.title == newItem;
        });
        if (check.length <= 0) { this._addItem(newItem); } 
        else { this._buttonAdd.setAttribute('disabled', true); }
      }
    }
  }

  get items() {
    return this._items;
  }

  set items(value) {
    value.forEach(item => {
      this._addItem(item);
    })
  }

}

customElements.define('list-dynamic', ListDynamic);