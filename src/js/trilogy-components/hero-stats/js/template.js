export default function(data) {
  return `
    <div class="hero-stats-slider">

      <div id="cumulative-panel" class="hero-stats-slide" aria-hidden="false" aria-labelledby="cumulative">

        <div class="hero-stats-row">
          <div class="hero-stats-row-label">
            <span class="hero-stats-row-label-text">Cases</span>
          </div>
          <div class="hero-stats-row-figure">${data.cumulative.cases.figure}</div>
          <div class="hero-stats-row-details">${data.cumulative.cases.details}</div>
        </div>

        <div class="hero-stats-row">
          <div class="hero-stats-row-label">
            <span class="hero-stats-row-label-text">Deaths</span>
          </div>
          <div class="hero-stats-row-figure">${data.cumulative.deaths.figure}</div>
          <div class="hero-stats-row-details">${data.cumulative.deaths.details}</div>
        </div>

        <div class="hero-stats-row">
          <div class="hero-stats-row-label">
            <span class="hero-stats-row-label-text">Tests</span>
          </div>
          <div class="hero-stats-row-figure">${data.cumulative.tests.figure}</div>
          <div class="hero-stats-row-details">${data.cumulative.tests.details}</div>
        </div>

      </div>

      <div id="fortnite-panel" class="hero-stats-slide" aria-hidden="true" aria-labelledby="fortnite">

        <div class="hero-stats-row">
          <div class="hero-stats-row-label">
            <span class="hero-stats-row-label-text">Cases</span>
          </div>
          <div class="hero-stats-row-figure">${data.fortnite.cases.figure}</div>
          <div class="hero-stats-row-details">${data.fortnite.cases.details}</div>
        </div>

        <div class="hero-stats-row">
          <div class="hero-stats-row-label">
            <span class="hero-stats-row-label-text">Deaths</span>
          </div>
          <div class="hero-stats-row-figure">${data.fortnite.deaths.figure}</div>
          <div class="hero-stats-row-details">${data.fortnite.deaths.details}</div>
        </div>

        <div class="hero-stats-row">
          <div class="hero-stats-row-label">
            <span class="hero-stats-row-label-text">Tests</span>
          </div>
          <div class="hero-stats-row-figure">${data.fortnite.tests.figure}</div>
          <div class="hero-stats-row-details">${data.fortnite.tests.details}</div>
        </div>

      </div>

    </div>
  `;
};
