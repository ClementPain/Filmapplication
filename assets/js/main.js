// Initial Values
const API_KEY = "...";
const url = 'http://www.omdbapi.com/?s=';
const formElement = document.querySelector('#searchMovieForm');
const movieSearchable = document.getElementById('movies-searchable');


// Functions for displaying movies searched

function createMovieContainer(movies) {
  const movieElement = document.createElement('div');
  movieElement.setAttribute('class', 'movie');

  const movieTemplate = `
    <section class="section">
      ${movieSection(movies)}
    </section>
    <div class="content mt-5">
      <p id="content-close">X</p>
    </div>
    `;
  
  movieElement.innerHTML = movieTemplate;
  return movieElement;
}

function movieSection(movies) {
  return movies.map((movie) => {
    if (movie.Poster != "N/A") {
      return `
        <div class="row justify-content-center">
          <img src = ${movie.Poster} data-movie-id=${movie.imdbID} />
          <div class="col-md-6">
            <h3>${movie.Title}</h3>
            <small>${movie.Year}</small><br>
            <button class="btn btn-secondary mt-5">Voir Plus</button>
          </div>
        </div>
      `; }
  })
}


// Search function

formElement.buttonElement.addEventListener('click', function(event) {
  event.preventDefault();
  const value = formElement.searchElement.value;
  const searchUrl = url + value + "&apikey=" + API_KEY;

  fetch(searchUrl)
    .then((res) => res.json())
    .then(renderSearchMovies)
    .catch((error) => {
      console.log('Error: ', error);
    })

  formElement.searchElement.value = '';
})

function renderSearchMovies(data) {
  movieSearchable.innerHTML = '';
  const movies = data.Search;
  // console.log(movies);

  let movieBlock = createMovieContainer(movies);
  movieSearchable.appendChild(movieBlock);
}


// Event delegation

document.addEventListener('click', function(event) {
  const target = event.target;

  // for images
  if (target.className === "btn btn-secondary mt-5") {
    let movieId = target.parentElement.parentElement.querySelector('img').dataset.movieId;

    searchInfoMovie(movieId);
  }

  // for movie infos container
  if (target.id === "close-popup") {
    const content = target.parentElement.parentElement.parentElement;

    content.parentElement.removeChild(content);
  }
})

// pop up creation

function searchInfoMovie(movieId) {
  let urlMovie = 'http://www.omdbapi.com/?i=' + movieId + "&apikey=" + API_KEY;

  fetch(urlMovie)
    .then((res) => res.json())
    .then(renderSearchThisMovie)
    .catch((error) => {
      console.log('Error: ', error);
    })
}

function renderSearchThisMovie(data) {
  let movie = data;
  let body = document.getElementsByClassName("container-fluid")[0];

  let movieInfos = popupCreation(movie);

  movieSearchable.appendChild(movieInfos);
}

function popupCreation(movie) {
  const movieInfosDisplay = document.createElement('div');
  movieInfosDisplay.setAttribute('class', 'border');

  const movieInfos = `
    <div class="row" id="modal">
      <div class="col-md-4">
        <img src = ${movie.Poster} data-movie-id=${movie.imdbID} class="img-fluid"/>
      </div>

      <div class="col-md-7">
        <h3 class="mt-4"> ${movie.Title} </h3>
        <small>${movie.Year}</small><br>
        <small>${movie.Genre}</small><br>
        <p>${movie.Plot}</p>
      </div>  

      <div class="col-md-1">
        <span id="close-popup">X<span>
      </div>
    </div>
  `;

  movieInfosDisplay.innerHTML = movieInfos;
  return movieInfosDisplay;
}