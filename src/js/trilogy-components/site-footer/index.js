customElements.define('site-footer',
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.getElementById('site-footer');
      const templateContent = template.content;

      this.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
    };
  }
);
