const searchUrl = "http://api.tvmaze.com/search/shows";
const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

// Fetch TV shows based on the search term
async function getShowsByTerm(term) {
  const response = await fetch(`${searchUrl}?q=${term}`);
  const searchResults = await response.json();

  return searchResults.map((result) => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL,
    };
  });
}

// Populate the shows list in the DOM
function populateShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $("<div>", {
      "data-show-id": show.id,
      class: "Show col-md-12 col-lg-6 mb-4",
      html: `
        <div class="media">
          <img class="card-img-top" src="${show.image}" alt="${show.name}">
          <div class="media-body">
            <h5 class="text-primary">${show.name}</h5>
            <div><small>${show.summary}</small></div>
            <button class="btn btn-outline-light btn-sm Show-getEpisodes">
              Episodes
            </button>
          </div>
        </div>
      `,
    });

    $showsList.append($show);
  }
}

// Fetch episodes of a show based on its ID
async function getEpisodesOfShow(showId) {
  const episodesUrl = `http://api.tvmaze.com/shows/${showId}/episodes`;
  const response = await fetch(episodesUrl);
  const episodes = await response.json();

  return episodes.map((episode) => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));
}

// Populate the episodes list in the DOM
function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (const episode of episodes) {
    const $episodeItem = $("<li>", {
      text: `${episode.name} (season ${episode.season}, number ${episode.number})`,
    });

    $episodesList.append($episodeItem);
  }
}

// Event listener for "Episodes" button click
$showsList.on("click", ".Show-getEpisodes", async function () {
  const $show = $(this).closest(".Show");
  const showId = $show.data("show-id");
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
  $episodesArea.show();
});

// Event listener for search form submission
$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
});
