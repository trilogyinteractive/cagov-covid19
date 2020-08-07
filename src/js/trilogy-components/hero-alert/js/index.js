customElements.define('hero-alert',
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.getElementById('hero-alert');
      const templateContent = template.content;

      this.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
    };
  }
);
