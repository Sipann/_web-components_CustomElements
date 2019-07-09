const template = document.createElement('template')
template.innerHTML = `
<header>
  <slot name="logo-home"></slot>
  <ul class="navigation">
    <slot name="navigation">
      <li><a>ItemA</a></li>
      <li><a>ItemB</a></li>
    </slot>
  </ul>
  </header>
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

header {
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
}

header.medium,
header.large {
  justify-content: flex-end;
}

header.large {
  flex-direction: row;
}

::slotted(a) {
  width: var(--logo-width);
  align-self: center;
  margin-right: var(--logo-margin);
}

::slotted(fragment) {
  display: contents;
}

ul.navigation {
  display: flex;
  flex-direction: column;
  margin-top: 1.5em;
  list-style-type: none;
} 

.medium ul.navigation,
.large ul.navigation {
  flex-direction: row;
  justify-content: space-between;
}

.large ul.navigation {
  margin-top: 0;
  align-self: center;
}
`;


class Navbar extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(template.content.cloneNode(true))
    this._shadowRoot.appendChild(style)

    this._currentWidth = '';
    this._header = this.shadowRoot.querySelector('header')
    this._links = [];
    this._listLi = [];
    this._logoWidthLarge;
    this._logoWidthMedium;
    this._logoWidthSmall;
    this._navMargin = 0;
    this._slotItems;
    this._widthLarge;
    this._widthMedium;
  }

  connectedCallback() {
    this._widthMedium = this.hasAttribute('medium') ? this.getAttribute('medium') : 769
    this._widthLarge = this.hasAttribute('large') ? this.getAttribute('large') : 1025
    this._logoWidthSmall = this.hasAttribute('logo-small') ? this.getAttribute('logo-small') : '110px'
    this._logoWidthMedium = this.hasAttribute('logo-medium') ? this.getAttribute('logo-medium') : '130px'
    this._logoWidthLarge = this.hasAttribute('logo-large') ? this.getAttribute('logo-large') : '140px'
    this._headerBgColor = this.hasAttribute('bg-color') ? this.getAttribute('bg-color') : 'transparent'
    this.shadowRoot.host.style.setProperty('--bg-color', this._headerBgColor)

    this._navColor = this.hasAttribute('color') ? this.getAttribute('color') : '#797e83'
    this._navBorderColor = this.hasAttribute('border-color') ? this.getAttribute('border-color') : '#ebecec'
    this._navColorHover = this.hasAttribute('color-hover') ? this.getAttribute('color-hover') : '#0b0b0b'
    this._navBorderColorHover = this.hasAttribute('border-color-hover') ? this.getAttribute('border-color-hover') : '#52bab3'
    this._borderSize = this.hasAttribute('border-size') ? this.getAttribute('border-size') : '2px'
    this._navFontSize = this.hasAttribute('font-size') ? this.getAttribute('font-size') : '1.2rem'
    this._navFontWeight = this.hasAttribute('font-weight') ? this.getAttribute('font-weight') : 400
    this._navPadding = this.hasAttribute('nav-padding') ? this.getAttribute('nav-padding') : '.8rem'
    
    this._testScreenSize()

    this._slotLogo = this.shadowRoot.querySelector('slot[name="logo-home"]')
    this._slotLogo.addEventListener('slotchange', e => this._styleLogo(e, this._slotLogo.assignedNodes()[0]))

    this._slotItems = this.shadowRoot.querySelector('slot[name="navigation"]')
    this._slotItems.addEventListener('slotchange', e => this._styleLinks(e, this._slotItems.assignedNodes()))

    window.addEventListener('resize', this._throttle(() => {
      this._testScreenSize()
    }))

  }
  
  attributeChangeCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'medium':
          this._widthMedium = newValue
          break
        case 'large':
          this._widthLarge = newValue
          break
      }
    }
  }

  static get observedAttributes() {
    return ['medium', 'large', 'bg-color', 'logo-small', 'logo-medium', 'logo-large', 'color', 'border-color', 'color-hover', 'border-color-hover', 'border-size', 'border-size', 'font-size', 'font-weight', 'nav-padding']
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this._throttle)
    this._slotLogo.removeEventListener('slotchange', this._styleLogo)
    this._slotItems.removeEventListener('slotchange', this._styleLinks)
    this._links.forEach(link => {
      link.removeEventListener('mouseenter', this._styleLinkEnter)
      link.removeEventListener('mouseleave', this._styleLinkLeave)
    })
  }


  _styleLinkEnter(e) {
    e.target.style.color = this._navColorHover
    e.target.style.borderBottom = `${this._borderSize} solid ${this._navBorderColorHover}`
  }

  _styleLinkLeave(e) {
    e.target.style.color = this._navColor
    e.target.style.borderBottom = `${this._borderSize} solid ${this._navBorderColor}`
  }

  _styleLinks(e, listUl) {
    let listLi = listUl[0].children

      for (let i=0; i<listLi.length; i++) {
        this._listLi.push(listLi[i])

        let link = listLi[i].querySelector('a')
        this._links.push(link)
        link.style.display = 'block'
        link.style.textDecoration = 'none'
        link.style.textAlign = 'center'
        link.style.color = this._navColor
        link.style.fontSize = this._navFontSize
        link.style.fontWeight = this._navFontWeight
        link.style.padding = this._navPadding
        link.style.borderBottom = `1px solid ${this._navBorderColor}`     

        listLi[i].style.marginLeft = this._currentWidth === 'large' ? this._navMargin : 0
        listLi[i].style.marginRight = this._currentWidth === 'large' ? this._navMargin : 0
        
        link.addEventListener('mouseenter', e => this._styleLinkEnter(e))
        link.addEventListener('mouseleave', e => this._styleLinkLeave(e))
      }
  }

  _styleLogo(e, logo) {
    if (this._currentWidth === 'medium') { logo.className = 'medium' } 
    else if (this._currentWidth === 'large') { logo.className = 'medium large' } 
  }
  
  _testScreenSize() {
    let mqlLarge = window.matchMedia(`(min-width: ${this._widthLarge}px)`).matches
    if (mqlLarge) { 
      this._currentWidth = 'large' 
      this._header.className = 'large'
      this._navMargin = '0.65rem'
      
      this.shadowRoot.host.style.setProperty('--logo-width', this._logoWidthLarge)
      this.shadowRoot.host.style.setProperty('--logo-margin', 'auto')
    }
    else {
      this.shadowRoot.host.style.setProperty('--logo-margin', 0)
      this._navMargin = 0
      let mqlMedium = window.matchMedia(`(min-width: ${this._widthMedium}px)`).matches
      if (mqlMedium) { 
        this._currentWidth = 'medium' 
        this._header.className = 'medium'
        this.shadowRoot.host.style.setProperty('--logo-width', this._logoWidthMedium)
      } else {
        this._currentWidth = 'small' 
        this._header.className = ''
        this.shadowRoot.host.style.setProperty('--logo-width', this._logoWidthSmall)
      }
    }
    this._listLi.forEach(li => {
      li.style.marginLeft = this._navMargin
      li.style.marginRight = this._navMargin
    })
  }

  _throttle(action, wait = 500) {
    let time = Date.now()
    return function() {
      if ((time + wait - Date.now()) < 0) {
        action()
        time = Date.now()
      }
    }
  }


}

window.customElements.define('responsive-navbar', Navbar)




