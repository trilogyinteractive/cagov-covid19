customElements.define('user-feedback',
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.getElementById('user-feedback');
      const templateContent = template.content;

      this.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
    };
  }
);
