customElements.define('hero-text',
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.getElementById('hero-text');
      const templateContent = template.content;

      this.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
    };
  }
);
