// Source / Credits:
// https://medium.com/@pietmichal/how-to-test-a-web-component-b5d64d5e8bb0

export class TestUtils {

  static async render (tag, attributes = {}) {
    TestUtils._renderToDocument(tag, attributes);
    return await TestUtils._waitForComponentToRender(tag);
  }

  static _renderToDocument (tag, attributes) {
    const htmlAttributes = TestUtils._mapObjectToHTMLAttributes(attributes);
    document.body.innerHTML = `<${tag} ${htmlAttributes}></${tag}>`;
  }

  static _mapObjectToHTMLAttributes (attributes) {
    return Object.entries(attributes).reduce((previous, current) => {
      return previous + ` ${current[0]}="${current[1]}"`;
    }, "");
  }

  static nextFrame () {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
  }

  static async _waitForComponentToRender (tag) {
    await customElements.whenDefined(tag);
    await TestUtils.nextFrame();
    return document.querySelector(tag);
  }


}