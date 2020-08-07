export default function(item) {
  return `
    <article class="news-item trigger">
      <a class="news-item-link" href="${item.link}">
        <figure class="news-item-photo">
          <img class="news-item-photo-img" src="${item.image}" alt="${item.headline}">
        </figure>
        <time class="news-item-date" datetime="${item.datetime}">${item.date}</time>
        <h3 class="news-item-headline">${item.headline}</h3>
        <div class="news-item-teaser">${item.teaser}</div>
      </a>
    </article>
  `;
};
