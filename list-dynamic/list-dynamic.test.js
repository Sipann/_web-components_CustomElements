describe('ListDynamic', () => {

  let element, shadowRoot;

  beforeEach(() => {
    element = document.createElement('list-dynamic');
    shadowRoot = element.shadowRoot;
  });


  describe('init', () => {
    it('should add a form under the shadow root', () => {
      document.body.append(element);
      expect(shadowRoot.querySelector('form')).toBeTruthy();
    });

    it('should append 4 list items when we add 4 items programmatically', () => {
      element.items = ['item1', 'item2', 'item3', 'item4'];
      document.body.append(element);
      expect(shadowRoot.querySelectorAll('list-item').length).toEqual(4);
    });

    it('should add an item with the title property to the items property', () => {
      element.items = ['item1'];
      document.body.append(element);
      expect(element._items[0].title).toBe('item1');
    });

    it('should add a new item to the list when one is added through input', () => {
      document.body.append(element);
      let input = shadowRoot.querySelector('input');
      input.value = 'item1';
      let button = shadowRoot.querySelector('button');
      button.click();
      const newItem = { title: 'item1', key: 0 };
      expect(element._items[0]).toEqual(newItem);
    });

    it('should append a new list-item to the DOM when one is added through input', () => {
      document.body.append(element);
      let input = shadowRoot.querySelector('input');
      input.value = 'item1';
      let button = shadowRoot.querySelector('button');
      button.click();
      expect(shadowRoot.querySelector('list-item')).toBeTruthy();
    }); 

    it('should provide index 3 to 4th item added', () => {
      element.items = ['item1', 'item2', 'item3', 'item4'];
      document.body.append(element);
      expect(element._items[3].key).toBe(3);
    });

    it ('should remove second item when index 1 is passed', () => {
      element.items = ['item1', 'item2', 'item3', 'item4'];
      document.body.append(element);
      element._removeItem({ detail: 1 });
      const newList = [
        { title: 'item1', key: 0 },
        { title: 'item3', key: 2 },
        { title: 'item4', key: 3 }
      ]
      expect(element._items).toEqual(newList);
    });

    it('should set anim-dur attribute on list-item when one is passed on element', () => {
      element.setAttribute('anim-dur', '500');
      document.body.append(element);
      let input = shadowRoot.querySelector('input');
      input.value = 'item1';
      let button = shadowRoot.querySelector('button');
      button.click();
      let newListItem = shadowRoot.querySelector('list-item');
      expect(newListItem.getAttribute('anim-dur')).toBe('500');
    });

  });

  afterEach(() => {
    if (element.parentNode == document.body) {
      document.body.removeChild(element);
    }
  });

});