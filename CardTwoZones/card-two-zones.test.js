import { CardTemplate } from './card-two-zones.js';
import { TestUtils } from "../test-utils.js";

describe('CardTwoZones', () => {

  let element, shadowRoot;

  beforeEach(async () => {
    element = await TestUtils.render('card-two-zones');
    shadowRoot = element.shadowRoot;
  });


  describe('init', () => {
    it('should render with shadowRoot', async () => {
      expect(shadowRoot).toBeDefined();
    });
  });


  afterEach(() => {
    if (element) { element.parentNode.removeChild(element); }
  });

});