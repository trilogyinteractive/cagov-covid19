import newsTemplate from "./template.js";

customElements.define('latest-news',
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.getElementById('latest-news');
      const templateContent = template.content;

      this.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
    };

    /**
     * Renders the data as news items
     */
    connectedCallback() {
      const data = this.getData();
      let html = "";

      data.forEach(function(item) {
        html += newsTemplate(item);
      });

      this.shadowRoot.getElementById("news-grid").innerHTML = html;
    };

    /**
     * Retrieve the news from the data source
     * @return {array} Objects representing news items
     */
    getData() {
      return [
        {
          headline: "Headline 1: Governor Newsom Signs Executive Order on Actions in Response to COVID-19",
          teaser: "Teaser 1: Governor Gavin Newsom today signed an executive order in response to the COVID-19 pandemic. The order extends a waiver that allows retailers to...",
          date: "July 01, 2020 at 5:43 PM",
          datetime: "2020-07-01",
          image: "img/news-photo1.jpg",
          link: "./item-1.html"
        },{
          headline: "Headline 2: Governor Newsom Signs Executive Order on Actions in Response to COVID-19",
          teaser: "Teaser 2: Governor Gavin Newsom today signed an executive order in response to the COVID-19 pandemic. The order extends a waiver that allows retailers to...",
          date: "July 02, 2020 at 5:43 PM",
          datetime: "2020-07-02",
          image: "img/news-photo2.jpg",
          link: "./item-2.html"
        },{
          headline: "Headline 3: Governor Newsom Signs Executive Order on Actions in Response to COVID-19",
          teaser: "Teaser 3: Governor Gavin Newsom today signed an executive order in response to the COVID-19 pandemic. The order extends a waiver that allows retailers to...",
          date: "July 03, 2020 at 5:43 PM",
          datetime: "2020-07-03",
          image: "img/news-photo3.jpg",
          link: "./item-3.html"
        }
      ];
    };
  }
);
