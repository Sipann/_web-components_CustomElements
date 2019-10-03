describe('IconRating', () => {

  let element, shadowRoot;

  beforeEach(() => {
    element = document.createElement('icon-rating-lg');
    shadowRoot = element.shadowRoot;
    element.setAttribute('icon-name', 'icon-star');
  });


  describe('init', () => {
    it('should add an svg element under the shadow root', () => {
      document.body.append(element);
      expect(shadowRoot.querySelector('svg')).toBeTruthy();
    });

    it('should return rating of 0 when no "rating" attribute is passed', () => {
      document.body.append(element);
      expect(element._rating).toEqual(0);
    });

    it('should return max of 5 when no "max" attribute is passed', () => {
      document.body.append(element);
      expect(element._max).toEqual(5);
    });

    it('should display only one color when "mono" attribute is passed', () => {
      element.setAttribute('mono', true);
      document.body.append(element);
      let stopColor2 = shadowRoot.querySelector('#color2');
      expect(stopColor2.getAttribute('stop-color')).toEqual(element._color1);
      let stopColor3 = shadowRoot.querySelector('#color3');
      expect(stopColor3.getAttribute('stop-color')).toEqual(element._color1);
    });

    it('should render 4 frame icons when "max" attribute is set to 4', () => {
      element.setAttribute('max', 4);
      document.body.append(element);
      let frameIcons = shadowRoot.querySelectorAll('.frame-icon');
      expect(frameIcons.length).toEqual(4);
    });

    it('should render 6 color icons when "max" attribute is set to 6', () => {
      element.setAttribute('max', 6);
      document.body.append(element);
      let colorIcons = shadowRoot.querySelectorAll('.color-icon');
      expect(colorIcons.length).toEqual(6);
    });

    // size of masking rectangle
    it('should set "x" attribute of masking rectangle at 300 when "rating" is 3 and "max" is 5', () => {
      element.setAttribute('rating', 3);
      let maskRect = shadowRoot.querySelector('#mask rect')
      document.body.append(element);
      expect(maskRect.getAttribute('x')).toEqual(''+ 300);
    });

    it('should set "width" attribute of masking rectangle at 200 when "rating" is 3 and "max" is 5', () => {
      element.setAttribute('rating', 3);
      let maskRect = shadowRoot.querySelector('#mask rect')
      document.body.append(element);
      expect(maskRect.getAttribute('width')).toEqual(''+ 200);
    });

    it('should set "x" attribute of masking rectangle at 360 when "rating" is 3, "max" is 5, and icon viewBox width is 120', () => {
      element.setAttribute('rating', 3);
      element.setAttribute('box-width', 120);
      let maskRect = shadowRoot.querySelector('#mask rect')
      document.body.append(element);
      expect(maskRect.getAttribute('x')).toEqual(''+ 360);
    });

    it('should set "width" attribute of masking rectangle at 240 when "rating" is 3, "max" is 5, and icon viewBox width is 120', () => {
      element.setAttribute('rating', 3);
      element.setAttribute('box-width', 120);
      let maskRect = shadowRoot.querySelector('#mask rect')
      document.body.append(element);
      expect(maskRect.getAttribute('width')).toEqual(''+ 240);
    });

    // rounding
    it('should return a rating of 4 when "rounding" attribute is "full" and "rating" attribute is 3.7', () => {
      element.setAttribute('rating', 3.7);
      element.setAttribute('rounding', 'full');
      document.body.append(element);
      expect(element._rating).toEqual(4);
    });

    it('should return a rating of 3 when "rounding" attribute is "floor" and "rating" attribute is 3.7', () => {
      element.setAttribute('rating', 3.7);
      element.setAttribute('rounding', 'floor');
      document.body.append(element);
      expect(element._rating).toEqual(3);
    });

    it('should return a rating of 4 when "rounding" attribute is "ceil" and "rating" is 3.3', () => {
      element.setAttribute('rating', 3.3);
      element.setAttribute('rounding', 'ceil');
      document.body.append(element);
      expect(element._rating).toEqual(4);
    });

    it('should return a rating of 3 when "rounding" attribute is "half-floor" and "rating is 3.3', () => {
      element.setAttribute('rating', 3.3);
      element.setAttribute('rounding', 'half-floor');
      document.body.append(element);
      expect(element._rating).toEqual(3);
    });

    it('should return a rating of 3.5 when "rounding" attribute is "half-floor" and "rating" is 3.8', () => {
      element.setAttribute('rating', 3.8);
      element.setAttribute('rounding', 'half-floor');
      document.body.append(element);
      expect(element._rating).toEqual(3.5);
    });

    it('should return a rating of 3.5 when "rounding" attribute is "half-ceil" and "rating" is 3.3', () => {
      element.setAttribute('rating', 3.3);
      element.setAttribute('rounding', 'half-ceil');
      document.body.append(element);
      expect(element._rating).toEqual(3.5);
    });

    it('should return a rating of 4 when "rounding" attribute is "half-ceil" and "rating" is 3.8', () => {
      element.setAttribute('rating', 3.8);
      element.setAttribute('rounding', 'half-ceil');
      document.body.append(element);
      expect(element._rating).toEqual(4);
    });

  });
    

  afterEach(() => {
    if (element.parentNode == document.body) {
      document.body.removeChild(element);
    }
  });

});