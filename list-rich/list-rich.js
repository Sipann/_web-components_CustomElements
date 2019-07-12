const template = document.createElement('template')
template.innerHTML = `
<section>
  <form>
    <input type="text" placeholder="New Todo" />
    <button id="btn">Add</button>
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
  background: var(--comp-bg, #78d6ac);
}

form {
  width: 95%;
  overflow: hidden;
  display: flex;
  background: #fff;
  border-radius: .2rem;
  border: solid 4px #fff;
  box-shadow: 0 1px 14px rgba(0, 0, 0, 0.2);
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

ul {
  width: 95%;
}
`;

class ListRich extends HTMLElement {
  constructor() {
    super()
    
    this._index = 0
    this.todos = []

    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(template.content.cloneNode(true))
    this._shadowRoot.appendChild(style)

    this.$ulContainer = this.shadowRoot.querySelector('ul')
    this.$buttonAdd = this.shadowRoot.querySelector('button')
    this.$input = this.shadowRoot.querySelector('input')
    this.$buttonAdd.addEventListener('click', e => this._setTodo(e))

  }
 
  disconnectedCallback() {
    let listItems = this.shadowRoot.querySelectorAll('list-item')
    listItems.forEach(item => {
      item.removeEventListener('remove', this._removeItem)
    })
    this.$buttonAdd.removeEventListener('click', this._setTodo)
  }

  _setTodo(e) {
    e.preventDefault()
    let newTodo = this.$input.value
    if (newTodo) {
      let todo = { todo: newTodo, key: this._index }
      this.todos = [...this.todos, todo]
      this._addTodo(todo)
      this.$input.value = ''
      this._index += 1
    }
  }

  _addTodo(todo) {
    let listItem = document.createElement('list-item')
    listItem.setAttribute('text', todo.todo)
    listItem.setAttribute('key', todo.key)
    let animDuration = this.hasAttribute('anim-dur') ? this.getAttribute('anim-dur') : 0
    listItem.setAttribute('anim-dur', animDuration)
    listItem.addEventListener('remove', e => this._removeItem(e))

    this.$ulContainer.appendChild(listItem)
  }

  _removeItem(e) {
    // update this.todos (property)
    let index = this.todos.findIndex(todo => todo.key == e.detail)
    this.todos.splice(index, 1)
    // update UI
    let listEl = this.shadowRoot.querySelector(`list-item[key="${e.detail}"]`)
    listEl.parentElement.removeChild(listEl)
  }


  _setTodos(todos) {
    this.todos = []
    for (let i=0; i<todos.length; i++) {
      this.todos.push({
        todo: todos[i],
        key: i
      })
    }
    this._index = todos.length
    this.$ulContainer.innerHTML = ''
    for (let i=0; i<this.todos.length; i++) {
      this._addTodo(this.todos[i])
    }
  }
 
}


customElements.define('list-rich', ListRich)