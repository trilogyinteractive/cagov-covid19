export default function(item) {
  return `
    <article class="video-item video-item-small" data-id="${item.youtubeId}">
      <a class="video-item-link modal_open" href="javascript:void(0);">
        <figure class="video-item-photo">
          <div class="video-item-play-button">
            <svg class="video-item-play-button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M43.3,25L0,50V0L43.3,25z"></path></svg>
          </div>
          <img class="video-item-photo-img" src="${item.image}" alt="${item.imageAlt}">
        </figure>
        <h3 class="video-item-headline-small">${item.headline}</h3>
      </a>
    </article>
  `;
};
