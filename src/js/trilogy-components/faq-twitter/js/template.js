export default function(item) {
  return `
    <article class="faq-item trigger">
    <a class="faq-item-link" href="${item.link}">
      <h4 class="faq-item-headline">${item.title}</h4>

      <figure class="faq-icon">
        <span class="faq-icon-circle"></span>
        <span class="faq-icon-arrow-wrapper">
          <span class="faq-icon-arrow">
            <span class="faq-icon-arrow-svg">
              <svg class="faq-icon-arrow-svg-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 15"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"><path d="M13.1506849 1.02215525l6.5753425 6.57534247-6.5753425 6.57534248M0 7.59749772h19.7260274"></path></g></svg>
            </span>
          </span>
          <span class="faq-icon-arrow">
            <span class="faq-icon-arrow-svg">
              <svg class="faq-icon-arrow-svg-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 15"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"><path d="M13.1506849 1.02215525l6.5753425 6.57534247-6.5753425 6.57534248M0 7.59749772h19.7260274"></path></g></svg>
            </span>
          </span>
        </span>
      </figure>
    </a>
    </article>
  `;
};
