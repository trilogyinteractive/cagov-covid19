import faqTemplate from "./template";

customElements.define('faq-twitter',
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.getElementById('faq-twitter');
      const templateContent = template.content;

      this.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
    };

    /**
     * Renders the data as FAQs
     */
    connectedCallback() {
      const data = this.getData();
      let html = "";

      data.forEach(function(item) {
        html += faqTemplate(item);
      });

      this.shadowRoot.getElementById("faqs-grid").innerHTML = html;
    };

    /**
     * Retrieve the news from the data source
     * @return {array} Objects representing FAQs
     */
    getData() {
      return [
        {
          link: "./item-1.html",
          title: "What’s open in my county?",
        },{
          link: "./item-2.html",
          title: "Where can I get a coronavirus test?",
        },{
          link: "./item-3.html",
          title: "Can I go on vacation?",
        },{
          link: "./item-4.html",
          title: "Are restaurants open?",
        }
      ];
    };
  }
);
