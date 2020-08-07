import statsTemplate from "./template";
import statsTabs from "./tabs";

customElements.define('hero-stats',
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.getElementById('hero-stats');
      const templateContent = template.content;

      this.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
    };

    /**
     * Renders the data as stats and initializes the tabs
     */
    connectedCallback() {
      const data = this.getData();
      this.shadowRoot.getElementById("hero-stats-slider").innerHTML = statsTemplate(data);

      const tabTriggers = [
        this.shadowRoot.getElementById('cumulative-trigger'),
        this.shadowRoot.getElementById('fortnite-trigger')
      ];

      const tabLabels = [
        this.shadowRoot.getElementById('cumulative-panel'),
        this.shadowRoot.getElementById('fortnite-panel')
      ];

      statsTabs.initialize(tabTriggers, tabLabels);
    };

    /**
     * Retrieve the news from the data source
     * @return {array} Objects representing news items
     */
    getData() {
      return {
        cumulative: {
          cases: {
            figure: "184,951",
            details: "186 today"
          },
          deaths: {
            figure: "5,565",
            details: "63 today"
          },
          tests: {
            figure: "3,411,686",
            details: "85,243 today"
          }
        },
        fortnite: {
          cases: {
            figure: "109,910",
            details: "+50.1%"
          },
          deaths: {
            figure: "1,104",
            details: "+18.6%"
          },
          tests: {
            figure: "1,482,673",
            details: "+36.5%"
          }
        }
      };
    };
  }
);
