import './card-two-zones.js';

describe('CardTwoZones', () => {

  describe('CardTwoZones Without Attributes', () => {
    it('should render with shadowRoot', async () => {
      const CardTwoZones = document.createElement('card-two-zones');
      document.body.append(CardTwoZones);
      expect(CardTwoZones.shadowRoot).toBeDefined();

      CardTwoZones.parentNode.removeChild(CardTwoZones);
    });

    it('should contain a <section> tag', async () => {
      const CardTwoZones = document.createElement('card-two-zones');
      document.body.append(CardTwoZones);
      const section = CardTwoZones.shadowRoot.querySelector('section');
      expect(section).toBeDefined();

      CardTwoZones.parentNode.removeChild(CardTwoZones);
    });

    it('should set a height of 2/3 of total height for front top div when no top attribute is provided', async () => {
      const CardTwoZones = document.createElement('card-two-zones');
      CardTwoZones.style.height = '250px';
      document.body.append(CardTwoZones);
      const shadowRoot = CardTwoZones.shadowRoot;
      const frontTopDivHeight = window.getComputedStyle(shadowRoot.querySelector('.front-top')).height;
      expect(+frontTopDivHeight.replace(/[a-z]/gi, '')).toBeCloseTo(167, -1);

      CardTwoZones.parentNode.removeChild(CardTwoZones);
    });

    it('should attach .flipped class when flip is triggered', async () => {
      const CardTwoZones = document.createElement('card-two-zones');
      document.body.append(CardTwoZones);

      const slotFrontBottomTitle = document.createElement('h3');
      slotFrontBottomTitle.setAttribute('slot', 'front-bottom-title');
      slotFrontBottomTitle.textContent = 'Card Title';
      CardTwoZones.append(slotFrontBottomTitle);

      const slotBackContent = document.createElement('h3');
      slotBackContent.setAttribute('slot', 'back-content');
      slotBackContent.textContent = 'Card Back';
      CardTwoZones.append(slotBackContent);

      const btnFlip = CardTwoZones.shadowRoot.querySelector('.flip');

      expect(CardTwoZones.shadowRoot.querySelector('section').classList).not.toContain('flipped');
      btnFlip.click();
      expect(CardTwoZones.shadowRoot.querySelector('section').classList).toContain('flipped');

      CardTwoZones.parentNode.removeChild(CardTwoZones);
    });

    it('should contain slot content', () => {
      const CardTwoZones = document.createElement('card-two-zones');
      document.body.append(CardTwoZones);

      const slotFrontBottomTitle = document.createElement('h3');
      slotFrontBottomTitle.setAttribute('slot', 'front-bottom-title');
      slotFrontBottomTitle.textContent = 'Card Title';
      CardTwoZones.append(slotFrontBottomTitle);

      expect(document.body.innerText).toContain('Card Title');

      CardTwoZones.parentNode.removeChild(CardTwoZones);
    });

    it('should not contain content not assigned to available slot', () => {
      const CardTwoZones = document.createElement('card-two-zones');
      document.body.append(CardTwoZones);

      const wrongSlot = document.createElement('h2');
      wrongSlot.textContent = 'Wrong Slot';
      CardTwoZones.append(wrongSlot);

      expect(document.body.innerText).not.toContain('Wrong Slot');

      CardTwoZones.parentNode.removeChild(CardTwoZones);
    });

  });

  describe('CardTwoZones With "top" Attribute', () => {
    it('should set a height of top * height for front top div when top attribute is provided', async () => {
      const CardTwoZones = document.createElement('card-two-zones');
      CardTwoZones.setAttribute('top', 0.5);
      CardTwoZones.style.height = '250px';
      document.body.append(CardTwoZones);

      const frontTopDivHeight = window.getComputedStyle(CardTwoZones.shadowRoot.querySelector('.front-top')).height;
      expect(+frontTopDivHeight.replace(/[a-z]/gi, '')).toBeCloseTo(125, -1);

      CardTwoZones.parentNode.removeChild(CardTwoZones);
    });
  });

});
