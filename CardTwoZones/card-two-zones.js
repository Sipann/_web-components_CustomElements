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

section {
  perspective: 1000px;
  width: 100%;
  height: 100%;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: var(--rounded);
  transform-style: preserve-3d;
  transition: all var(--flip-duration, 0.8s) linear;
}

.flipped .card {
  animation-name: flip-card;
  animation-delay: 0;
  animation-duration: var(--flip-duration, 0.8s);
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes flip-card {
  50% { transform: rotateY(90deg); }
  100% { transform: rotateY(180deg); }
}

.shadow {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--shadow-color, rgba(0, 0, 0, 0.5));
  border-radius: var(--rounded);
  filter: blur(5px);
  transform: scale3d(1, 1, 1) translate3d(5px, 10px, 0);
}

.flipped .shadow {
  animation-name: reverse-shadow;
  animation-delay: 0;
  animation-duration: var(--flip-duration, 0.8s);
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  transform: rotateY(0) translate3d(5px 10px, 0) scale3d(1, 1, 1);
}

@keyframes reverse-shadow {
  50% { transform: rotateY(90deg) translate3d(0, 0, 0) scale3d(1, 0.8, 1); }
  100% { transform: rotateY(180deg) translate3d(-10px, 10px, 0) scale3d(1,1,1);}
}

.front,
.back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: grid;
  border-radius: var(--rounded);
}

.front {
  grid-template-rows: var(--front-top-height) var(--front-bottom-height);
}

.back {
  transform: rotateY(180deg);
  background-color: var(--bg-back, #eee);
  border-radius: var(--rounded);
}

.front-top {
  position: relative;
  background: var(--bg-front-top, #eee);
  border-radius: var(--rounded) var(--rounded) 0 0;
}

#top-slot::slotted(*) {
  height: 100%;
  width: 100%;
  border-radius: var(--rounded) var(--rounded) 0 0;
}

.front-bottom {
  background: var(--bg-front-bottom, #eee);
  border-radius: 0 0 var(--rounded) var(--rounded);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--front-bottom-color, #333);
}

#content {
  display: contents;
}

.flip {
  position: absolute;
  width: 40px;
  height: 40px;
  background: var(--btn-flip-bg, #595775);
  top: -20px;
  right: 10%;
  border-radius: 50%;
}

.flip:hover {
  cursor: pointer;
}

.flip path:nth-of-type(1) {
  stroke: var(--flip-icon-fill, #fff);
}

.flip path:nth-of-type(2) {
  fill: var(--flip-icon-fill, #fff);
}

.back-content {
  border-radius: var(--rounded);
}

</style>

<section>
  <div class="shadow"></div>
  <div class="card">
    <div class="front">
      <div class="front-top">
        <slot id="top-slot" name="front-top-slot"></slot>
      </div>
      <div class="front-bottom">
        <div class="flip">
          <slot name="icon">
            <svg viewBox="0 0 100 100">
              <path fill="none" stroke-width="5" d="M 30 50 A 20, 20 0 1 0 50 30" />
              <path stroke-width="5" d="M 50 20 l -15 10 l 15 10 z" />
            </svg>
          </slot>
        </div>
        <slot name="front-bottom-title"></slot>
        <slot name="front-bottom-subtitle"></slot>
      </div>
    </div>

    <div class="back">
      <div class="back-content">
        <slot name="back-content"></slot>
      </div>
    </div>
  </div>
</section>
`;

export class CardTemplate extends HTMLElement {

  constructor () {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(templateCard.content.cloneNode(true))

    this.$container = this.shadowRoot.querySelector('section');
    this.$button = this.shadowRoot.querySelector('.flip')
  }

  connectedCallback () {
    const height = window.getComputedStyle(this).getPropertyValue('height').replace(/[a-z]/gi, '');
    const top = height * this.getAttribute('top') || height * 2 / 3;
    const bottom = height - top;
    this.shadowRoot.host.style.setProperty('--front-top-height', `${top}px`);
    this.shadowRoot.host.style.setProperty('--front-bottom-height', `${bottom}px`);

    this.$button.addEventListener('click', this._flip.bind(this))
  }

  disconnectedCallback () {
    this.$button.removeEventListener('click', this._flip)
  }

  _flip () {
    this.$container.classList.add('flipped');
  }

}

customElements.define('card-two-zones', CardTemplate);
