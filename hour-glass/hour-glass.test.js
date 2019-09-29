describe('HourGlass', () => {

  let element, shadowRoot;
  let bgColor = 'grey';
  let bgColorOver = 'pink';
  let sandColor = 'green';
  let sandColorOver = 'red';

  beforeEach(() => {
    element = document.createElement('hour-glass');
    element.setAttribute('bgColor', bgColor);
    element.setAttribute('bgColorOver', bgColorOver);
    element.setAttribute('sandColor', sandColor);
    element.setAttribute('sandColorOver', sandColorOver);
    element.style.width = '150px';
    shadowRoot = element.shadowRoot;
  });

  describe('init', () => {

    it('should add a div with the class "hour-glass-container" under the shadow root', () => {
      document.body.append(element);
      expect(shadowRoot.querySelector('.hour-glass-container')).toBeTruthy();
    }); 

    it('should accept attributes passed through DOM', () => {
      document.body.append(element);
      expect(element._bgColorOver).toEqual('pink');
    });

    it('should use default values when no attribute is passed', () => {
      element.removeAttribute('bgColor');
      element.setAttribute('timeleft', 1)
      document.body.append(element);
      expect(element._bgColor).toEqual('#aba6bf');
    });

    it('should assign _bgColorOver to _bgColor when timeleft is === 0', () => {
      element.setAttribute('timeleft', 0);
      document.body.append(element);
      expect(element._bgColor).toEqual(element._bgColorOver)
    });

    it('should assign _sandColorOver to _sandColor when timeleft is === 0', () => {
      element.setAttribute('timeleft', 0);
      document.body.append(element);
      expect(element._sandColor).toEqual(element._sandColorOver);
    });

    it('should render all sand in bottom part when "timeleft" attribute is equal to 0', () => {
      element.setAttribute('timeleft', 0);
      document.body.append(element);
      const container = shadowRoot.querySelector('.hour-glass-container');
      const styleBg = `linear-gradient(${bgColorOver} 0px, ${bgColorOver} 50%, ${sandColorOver} 50%, ${sandColorOver} 50%, ${bgColorOver} 50%, ${bgColorOver} 50%, ${sandColorOver} 50%, ${sandColorOver} 100%)`;
      expect(container.style.background).toBe(styleBg);
    });

    it('should render same as "timeleft" === 0 when "timeleft" is over (ie < to 0)', () => {
      element.setAttribute('timeleft', -8);
      document.body.append(element);
      const container = shadowRoot.querySelector('.hour-glass-container');
      const styleBg = `linear-gradient(${bgColorOver} 0px, ${bgColorOver} 50%, ${sandColorOver} 50%, ${sandColorOver} 50%, ${bgColorOver} 50%, ${bgColorOver} 50%, ${sandColorOver} 50%, ${sandColorOver} 100%)`;
      expect(container.style.background).toBe(styleBg);
    });

    it('should render all sand in top part when "timeleft" attribute is equal to 1', () => {
      element.setAttribute('timeleft', 1);
      document.body.append(element);
      const container = shadowRoot.querySelector('.hour-glass-container');
      const styleBg = `linear-gradient(${bgColor} 0px, ${bgColor} 0%, ${sandColor} 0%, ${sandColor} 50%, ${bgColor} 50%, ${bgColor} 100%, ${sandColor} 100%, ${sandColor} 100%)`;
      expect(container.style.background).toBe(styleBg);
    });

    it('should render proportionally when timeleft is intermediate', () => {
      let time = 0.4;
      element.setAttribute('timeleft', time); 
      
      document.body.append(element);
      
      const container = shadowRoot.querySelector('.hour-glass-container');
      const styleBg = `linear-gradient(${bgColor} 0px, ${bgColor} 27%, ${sandColor} 27%, ${sandColor} 50%, ${bgColor} 50%, ${bgColor} 73%, ${sandColor} 73%, ${sandColor} 100%)`;
      expect(container.style.background).toBe(styleBg);
    });
    

    it('should not display drop line when timeleft is over (ie === 1)', () => {
      element.setAttribute('timeleft', 0);
      document.body.append(element);
      const drop = shadowRoot.querySelector('.hour-glass-container span');
      const noDisplay = 'none';
      expect(drop.style.display).toBe(noDisplay);
    }); 

    it('should not display drop line when timeleft is === 1', () => {
      element.setAttribute('timeleft', 1);
      document.body.append(element);
      const drop = shadowRoot.querySelector('.hour-glass-container span');
      const noDisplay = 'none';
      expect(drop.style.display).toBe(noDisplay);
    });
    
  });

  afterEach(() => {
    if (element.parentNode == document.body) {
      document.body.removeChild(element);
    }
  });


});