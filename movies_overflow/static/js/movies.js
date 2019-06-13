// Init Tmdb
const tmdb = new Tmdb();

// Initialize DOM variables
const moviesSearch = document.getElementById('movies-search');
const popularNav = document.getElementById('popular-nav');
const latestNav = document.getElementById('latest-nav');
const topNav = document.getElementById('top-nav');
const upcomingNav = document.getElementById('upcoming-nav');
const moviesContainer = document.getElementById('movies-container');
const resultsList = document.getElementById('results-list');
const moviesSearchBtn = document.getElementById('movies-search-btn');
const loadMore = document.querySelector('.load-more');

// Current results page number
let upcomingPage = 0;
let latestPage = 0;
let popularPage = 0;
let customPage = 0;
let topPage = 0;
let totalPages = 100;

let customQuery = "";

try{
  latestNav.addEventListener('click', latestList);
  topNav.addEventListener('click', topRatedList);
  upcomingNav.addEventListener('click', upcomingList);
  popularNav.addEventListener('click', popularList);
  moviesSearchBtn.addEventListener('click', showSearchMovies);
  loadMore.addEventListener('click', loadMoreMovies);
}
catch{
  // Do nothing
}

popularList();

// Dropdown results while searching effect
if (moviesSearch != null){
  moviesSearch.addEventListener('keyup', showDropdown);
}

function showDropdown(e){
  query = moviesSearch.value;

  resultsList.innerHTML = "";

  if (e.code == "Enter"){
    showSearchMovies();
  }
  else{

    
    tmdb.searchMovies(query, 1).then(data => {
    resultsList.innerHTML = "";
    results = data.searchMovies.results;

    if (results != undefined){
      results.forEach(function(result){
        const a = document.createElement('a');
        a.href = "movie.html";
        
        const div = document.createElement('div');
        div.className = "result cursor-pointer";
        div.innerHTML = result.title + " (" + result.release_date.substring(0, 4) + ")";
        a.appendChild(div);
        resultsList.appendChild(a);
      });
      
    }
  });
}
}

// Show movies searched using manual input
function showSearchMovies(){
  query = moviesSearch.value;
  if (query != ""){
    resultsList.innerHTML = "";
    customQuery = query;
    resetPageNumbers();
    customPage = 1;
    tmdb.searchMovies(query, customPage).then(data => {
      resultsList.innerHTML = "";
      results = data.searchMovies.results;
      totalPages = data.searchMovies.total_pages;

      if (results != undefined){
        newMoviesList(results);
        removeMiniNavActive();
      }
      else{
        resetPageNumbers();
      }

      loadMore.style.display = (totalPages > 1) ? 'inline' : 'none';
    });
  }
}

// Load more movies when load more button is clicked
function loadMoreMovies(){
  if (popularPage > 0){
    popularPage++;
    tmdb.getPopularMovies(popularPage).then(data => {
      popularMoviesResult = data.popularMovies.results;
    
      addMovies(popularMoviesResult);
    
    });
  }
  else if (latestPage > 0){
    latestPage++;
    tmdb.getLatestMovies(latestPage).then(data => {
      latestMoviesResult = data.latestMovies.results;
      addMovies(latestMoviesResult);
    });
  }
  else if(topPage > 0){
    topPage++;
    tmdb.getTopRatedMovies(topPage).then(data => {
      topRatedMoviesResult = data.topMovies.results;
      addMovies(topRatedMoviesResult);
    });
  }
  else if(upcomingPage > 0){
    upcomingPage++;
    tmdb.getUpcomingMovies(upcomingPage).then(data => {
      upcomingMoviesResult = data.upcomingMovies.results;
      addMovies(upcomingMoviesResult);
    });
  }
  else if (customPage > 0){
    customPage++;
    tmdb.searchMovies(customQuery, customPage).then(data => {
      resultsList.innerHTML = "";
      results = data.searchMovies.results;
      if (results != undefined){
        addMovies(results);
      }
    });
  }

  if (customPage >= totalPages || upcomingPage >= totalPages || topPage >= totalPages || popularPage >= totalPages || latestPage >= totalPages){
    loadMore.style.display = "none";
  }
}

function removeMiniNavActive(){
  try{
    popularNav.classList.remove("active");
    latestNav.classList.remove("active");
    topNav.classList.remove("active");
    upcomingNav.classList.remove("active");
  }
  catch{
    // Do nothing
  }
}

function resetPageNumbers(){
  popularPage = 0;
  latestPage = 0;
  topPage = 0;
  upcomingPage = 0;
  customPage = 0;
}

// Remove all existing movies and add new ones
function newMoviesList(movies){
  if (moviesContainer != null){
    moviesContainer.innerHTML = "";

    
    movies.forEach(function(movie){
      const movieCard = document.createElement("div");
      movieCard.className = "movie-card";
      movieCard.innerHTML = `
      <a href="movie.html">
      <div class="movie-poster">
      <img
      src="https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}" class="shadow"
      alt=""
      />
      <div class="movie-grade">
      A
      </div>
      </div>
      <div class="movie-name">
      ${movie.title} (${movie.release_date.substring(0,4)})
      </div>
      </a>
      `;
      
      moviesContainer.appendChild(movieCard);

    });
  }
}

// Add more movies to the display
function addMovies(movies){
  if (moviesContainer != null){
    movies.forEach(function(movie){
      const movieCard = document.createElement("div");
      movieCard.className = "movie-card";
      
      movieCard.innerHTML = `
      <a href="movie.html">
      <div class="movie-poster">
      <img
      src="https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}" class="shadow"
      alt=""
      />
      <div class="movie-grade">
      A
      </div>
      </div>
      <div class="movie-name">
      ${movie.title} (${movie.release_date.substring(0,4)})
      </div>
      </a>
      `;
      
      moviesContainer.appendChild(movieCard);
    });
  }
}

function popularList(){
  removeMiniNavActive();
  resetPageNumbers();
  popularPage = 1;

  try{
    popularNav.classList.add("active");
  }
  catch{
    // Do nothing
  }

  tmdb.getPopularMovies(1).then(data => {
    popularMoviesResult = data.popularMovies.results;
    totalPages = data.popularMovies.total_pages;  
    newMoviesList(popularMoviesResult);
  });
  if (loadMore != null){
    loadMore.style.display = (totalPages > 1) ? 'inline' : 'none';  
  }
}

function latestList(){
  removeMiniNavActive();
  resetPageNumbers();
  latestNav.classList.add("active");
  latestPage = 1;

  tmdb.getLatestMovies(1).then(data => {
    latestMoviesResult = data.latestMovies.results;
    totalPages = data.latestMovies.total_pages;  
    newMoviesList(latestMoviesResult); 
  });
  loadMore.style.display = (totalPages > 1) ? 'inline' : 'none';  
}

function topRatedList(){
  removeMiniNavActive();
  resetPageNumbers();
  topNav.classList.add("active");
  topPage = 1;

  tmdb.getTopRatedMovies(1).then(data => {
    topRatedMoviesResult = data.topMovies.results;
    totalPages = data.topMovies.total_pages;
    newMoviesList(topRatedMoviesResult);
  });
  loadMore.style.display = (totalPages > 1) ? 'inline' : 'none';  
}
function upcomingList(){
  removeMiniNavActive();
  resetPageNumbers();
  upcomingNav.classList.add("active");
  upcomingPage = 1;

  tmdb.getUpcomingMovies(1).then(data => {
    upcomingMoviesResult = data.upcomingMovies.results;
    totalPages = data.upcomingMovies.total_pages;
    newMoviesList(upcomingMoviesResult);  
  });
  loadMore.style.display = (totalPages > 1) ? 'inline' : 'none';  
}