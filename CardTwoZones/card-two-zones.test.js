import { CardTemplate } from './card-two-zones.js';  // if export/import => pb in browser
import { TestUtils } from '../test-utils.js';

describe('CardTwoZones Without Attributes', () => {

  let element, shadowRoot;

  beforeEach(async () => {
    element = await TestUtils.render('card-two-zones');
    element.style.height = '250px';
    shadowRoot = element.shadowRoot;
    document.body.append(element);
  });

  describe('init', () => {
    it('should render with shadowRoot', async () => {
      expect(shadowRoot).toBeDefined();
    });

    it('should contain a <section> tag', async () => {
      const section = shadowRoot.querySelector('section');
      expect(section).toBeDefined();
    });

    it('should set a height of 2/3 of total height for front top div when no top attribute is provided', async () => {
      const frontTopDivHeight = window.getComputedStyle(shadowRoot.querySelector('.front-top')).height;
      expect(+frontTopDivHeight.replace(/[a-z]/gi, '')).toBeCloseTo(167, -1);
    });

  });

  afterEach(() => {
    if (element) { element.parentNode.removeChild(element); }
  });

});


describe('CardTwoZones With Attribute', () => {

  let element, shadowRoot;

  beforeEach(async () => {
    element = await TestUtils.render('card-two-zones', { top: 0.5 });
    element.style.height = '250px';
    shadowRoot = element.shadowRoot;
    document.body.append(element);
  });

  describe('init', () => {
    it('should render with shadowRoot', async () => {
      expect(shadowRoot).toBeDefined();
    });

    it('should set a height of top * height for front top div when top attribute is provided', async () => {
      const frontTopDivHeight = window.getComputedStyle(shadowRoot.querySelector('.front-top')).height;
      expect(+frontTopDivHeight.replace(/[a-z]/gi, '')).toBeCloseTo(125, -1);
    });

  });

  afterEach(() => {
    if (element) { element.parentNode.removeChild(element); }
  });

});