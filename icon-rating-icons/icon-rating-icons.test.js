describe('IconRating', () => {

  let element, shadowRoot;

  beforeEach(() => {
    element = document.createElement('icon-rating');
    shadowRoot = element.shadowRoot;
    element.setAttribute('icon-name', 'favorite');
  });


  describe('init', () => {
    it('should add <div className="container"></div> under the shadow root', () => {
      document.body.append(element);
      expect(shadowRoot.querySelector('.container')).toBeTruthy();
    });

    it('should return rating of 0 when no "rating" attribute is passed', () => {
      document.body.append(element);
      expect(element._rating).toEqual(0);
    });

    it('should return max of 5 when no "max" attribute is passed', () => {
      document.body.append(element);
      expect(element._max).toEqual(5);
    });

    it('should set color2 to color1 when no "color2" attribute is passed', () => {
      document.body.append(element);
      expect(element._color2).toEqual('red');
    });
  

    // rounding
    it('should set the clip-path width to 80 when "rounding" attribute is "full" and "rating" attribute is 3.7', () => {
      element.setAttribute('rating', 3.7);
      element.setAttribute('rounding', 'full');
      document.body.append(element);
      expect(element._ratingWidth).toEqual(80);
    });

    it('should set the clip-path width to 60 when "rounding" attribute is "floor" and "rating" attribute is 3.7', () => {
      element.setAttribute('rating', 3.7);
      element.setAttribute('rounding', 'floor');
      document.body.append(element);
      expect(element._ratingWidth).toEqual(60);
    });

    it('should set the clip-path width to 80 when "rounding" attribute is "ceil" and "rating" is 3.3', () => {
      element.setAttribute('rating', 3.3);
      element.setAttribute('rounding', 'ceil');
      document.body.append(element);
      expect(element._ratingWidth).toEqual(80);
    });

    it('should set the clip-path width to 60 when "rounding" attribute is "half-floor" and "rating is 3.3', () => {
      element.setAttribute('rating', 3.3);
      element.setAttribute('rounding', 'half-floor');
      document.body.append(element);
      expect(element._ratingWidth).toEqual(60);
    });

    it('should set the clip-path width to 70 when "rounding" attribute is "half-floor" and "rating" is 3.8', () => {
      element.setAttribute('rating', 3.8);
      element.setAttribute('rounding', 'half-floor');
      document.body.append(element);
      expect(element._ratingWidth).toEqual(70);
    });

    it('should set the clip-path width to 70 when "rounding" attribute is "half-ceil" and "rating" is 3.3', () => {
      element.setAttribute('rating', 3.3);
      element.setAttribute('rounding', 'half-ceil');
      document.body.append(element);
      expect(element._ratingWidth).toEqual(70);
    });

    it('should set the clip-path width to 80 when "rounding" attribute is "half-ceil" and "rating" is 3.8', () => {
      element.setAttribute('rating', 3.8);
      element.setAttribute('rounding', 'half-ceil');
      document.body.append(element);
      expect(element._ratingWidth).toEqual(80);
    });

  });
    

  afterEach(() => {
    if (element.parentNode == document.body) {
      document.body.removeChild(element);
    }
  });

});