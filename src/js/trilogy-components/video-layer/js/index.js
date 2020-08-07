import featuredTemplate from "./featured-template.js";
import videoTemplate from "./video-template.js";
import Video from "./video";

customElements.define('video-layer',
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.getElementById('video-layer');
      const templateContent = template.content;

      this.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
    };

    /**
     * Renders the data as videos
     */
    connectedCallback() {
      const data = this.getData();
      let html = {featured: "", video: ""};

      data.forEach(function(item) {
        if(item.featured) {
          html.featured += featuredTemplate(item);
        } else {
          html.video += videoTemplate(item);
        }
      });

      this.shadowRoot.getElementById("featured-video").innerHTML = html.featured;
      this.shadowRoot.getElementById("video-grid").innerHTML = html.video;
    };

    /**
     * Retrieve the videos from the data source
     * @return {array} Objects representing videos
     */
    getData() {
      return [
        {
          featured: true,
          image: "img/video-photo1.jpg",
          imageAlt: "Thumbnail Title 1",
          youtubeId: "qQNBSlWJhfU",
          headline: "La regla de los 6 pies",
          teaser: "Comprométete a mantener a los californianos saludables manteniéndote a 6 pies de distancia de los demás en todo momento.",
        },{
          featured: false,
          image: "img/video-photo2.jpg",
          imageAlt: "Thumbnail Title 2",
          youtubeId: "aWmw_cLiuOk",
          headline: "Could Be Valley Fever"
        },{
          featured: false,
          image: "img/video-photo3.jpg",
          imageAlt: "Thumbnail Title 3",
          youtubeId: "VnVdl7bAwTY",
          headline: "California Connected"
        },{
          featured: false,
          image: "img/video-photo4.jpg",
          imageAlt: "Thumbnail Title 4",
          youtubeId: "ABiwuaTULdo",
          headline: "Find the Mask That Fits Your Life"
        },{
          featured: false,
          image: "img/video-photo5.jpg",
          imageAlt: "Thumbnail Title 5",
          youtubeId: "ZmQfFLe8EFc",
          headline: "What is Contact Tracing?"
        }
      ];
    };
  }
);
