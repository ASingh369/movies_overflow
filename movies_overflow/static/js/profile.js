const profileBgImage = document.getElementById("profile-bg");
const profileMovies = document.getElementById("profile-movies");
const editListBtn = document.getElementById("edit-list-btn");
const editList = document.getElementById("edit-list");
const top10Btn = document.getElementById("top10-btn");
const allBtn = document.getElementById("all-btn");
const profileLoadMore = document.getElementById("profile-load-more");
const followBtn = document.getElementById("follow-btn");
const followFrom = document.getElementById("follow-form");

var movies_list = []; // Top 10 movies array
var all_movies_page = 0;
var all_movies = []; // All movies received from server array

if (top10Btn != null){
  top10Btn.addEventListener('click', top10BtnClicked);
  allBtn.addEventListener('click', allBtnClicked);
  profileLoadMore.addEventListener('click', loadMoreAllMovies);
  if (followBtn != null){
    followBtn.addEventListener('click', submitFollowForm);
  }
}
else{
  var profile_user_id = 1;
}
displayTop10();
if (editListBtn != null){
  editListBtn.addEventListener('click', showCurrentTop10Movies);
}

function showCurrentTop10Movies(){
  editList.innerHTML = "";
  movies_list.forEach(function(movie){
    const div = document.createElement("div");
    div.className = "d-flex";
    div.id = movie[1];
    div.innerHTML = `
    <div class="rank">${movie[1]}</div>
      <div class="name">${movie[0].movie.title}</div>
      <div class="buttons d-flex">
        <div class="edit d-flex">
          <div class="move-up"><i class="fas fa-sort-numeric-up" onclick="moveUp(${movie[1]});" ></i></div>
          <div class="move-down"><i class="fas fa-sort-numeric-down" onclick="moveDown(${movie[1]});"></i></div>
        </div>
        <div class="delete-box">
          <span class="delete" id="delete"><i class="far fa-trash-alt"  onclick="deleteMovie(${movie[1]});"></i></span>
        </div>
    </div>
    `;
    editList.appendChild(div);
  });
}

function sortMoviesList(arr){
  for (var i = 0; i < arr.length; i++){
    var minIndex = i;
    for (var j = i; j < arr.length; j++){
      if (arr[j][1] < arr[minIndex][1]){
        minIndex = j;
      }
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
  return arr;
}

function displayTop10(){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/get_top10_movies/${profile_user_id}`);
  xhr.send(null);
  if (profileMovies != null){
    profileMovies.innerHTML = "";
  }
  
  xhr.onload = function(){
    if (this.status === 200){
      top10_movies = JSON.parse(this.responseText);
      total_movies = top10_movies.length;
      top10_movies.forEach(function(top10_movie){

        tmdb.getJustMovie(top10_movie.movie_id).then(data => {
          if (data.movie.status_message != "The resource you requested could not be found."){
            movies_list.push([data, top10_movie.rank]);
            if (movies_list.length == total_movies){
              // Sort the movies list according to their rank (async problems)
              movies_list = sortMoviesList(movies_list);
              showMainMovieCards();
              if (total_movies > 0 && profileMovies != null){
                profileBgImage.src = `https://image.tmdb.org/t/p/w1280/${movies_list[0][0].movie.backdrop_path}`;
              }
            }
          }
        });
      });
    }
  }
}


function showMainMovieCards(){
  if (profileMovies != null){
    profileMovies.innerHTML = "";
  }
  movies_list.forEach(function(movie){
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card-padding";
    show0 = "0";
    if (movie[1] == 10){
      show0 = "";
    }
    movieCard.innerHTML = `
    <div class="top-movie-card" style="background-image: url('https://image.tmdb.org/t/p/w1280/${movie[0].movie.backdrop_path}');">
      <div class="movie-card-overlay bg-${movie[1]}">
        <div class="d-flex">
          <div class="poster">
            <img class="shadow" src="https://image.tmdb.org/t/p/w300_and_h450_bestv2/${movie[0].movie.poster_path}" alt="">
          </div>
          <div class="details">
            <div class="name">${movie[0].movie.title} (${movie[0].movie.release_date.substring(0, 4)})</div>
            <div class="view-details"><a href="/movie/${movie[0].movie.id}">View Details <i class="fas fa-long-arrow-alt-right"></i></a> </div>
          </div>
          <div class="rank">
            ${show0}${movie[1]}
          </div>
        </div>
      </div>
    </div>          
    `;
    if (profileMovies != null){
      profileMovies.appendChild(movieCard);
    }
  });
}


// Update top 10 list events
function moveUp(rank){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/move_up_top10/${profile_user_id}/${rank}`);
  xhr.send(null);

  xhr.onload = function(){
    if (this.status === 200){
      // Manipulate current top 10 movies array
      if (rank > 1){
        movies_list[rank-1][1] -= 1;
        movies_list[rank-2][1] += 1;
        [movies_list[rank-1], movies_list[rank-2]] = [movies_list[rank-2], movies_list[rank-1]];
      }
    }
    $.featherlight.close();
    showCurrentTop10Movies();
    $.featherlight($('#top10-modal'), {});
    showCurrentTop10Movies();
    showMainMovieCards();
    if (movies_list.length > 0){
      profileBgImage.src = `https://image.tmdb.org/t/p/w1280/${movies_list[0][0].movie.backdrop_path}`;
    }
  }
}

function moveDown(rank){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/move_down_top10/${profile_user_id}/${rank}`);
  xhr.send(null);

  xhr.onload = function(){
    if (this.status === 200){
      // Manipulate current top 10 movies array
      if (rank < movies_list.length){
        movies_list[rank][1] -= 1;
        movies_list[rank-1][1] += 1;
        [movies_list[rank], movies_list[rank-1]] = [movies_list[rank-1], movies_list[rank]];
      }
    }
    $.featherlight.close();
    showCurrentTop10Movies();
    $.featherlight($('#top10-modal'), {});
    showCurrentTop10Movies();
    showMainMovieCards();
    if (movies_list.length > 0){
      profileBgImage.src = `https://image.tmdb.org/t/p/w1280/${movies_list[0][0].movie.backdrop_path}`;
    }
  }
}

function deleteMovie(rank){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/delete_from_top10/${profile_user_id}/${rank}`);
  xhr.send(null);

  xhr.onload = function(){
    if (this.status === 200){
      // Manipulate current top 10 movies array
      // 
      for (var i = rank-1; i < movies_list.length-1; i++){
        [movies_list[i], movies_list[i+1]] = [movies_list[i+1], movies_list[i]];
        movies_list[i][1] -= 1;
      }
      movies_list.pop();
    }
    $.featherlight.close();
    showCurrentTop10Movies();
    $.featherlight($('#top10-modal'), {});
    showCurrentTop10Movies();
    showMainMovieCards();
    if (movies_list.length > 0){
      profileBgImage.src = `https://image.tmdb.org/t/p/w1280/${movies_list[0][0].movie.backdrop_path}`;
    }
  }
}

// show edit list btn, change active on buttons, show top 10 movies
function top10BtnClicked(){
  top10Btn.classList.add("active");
  allBtn.classList.remove("active");
  if (editListBtn != null){
    editListBtn.style.display = "inline";
  }
  showMainMovieCards();
  all_movies_page = 0;
}


// remove edit list btn, change active on buttons, show A grade movies, get all grade movies from server, store them in 7 arrays, 
function allBtnClicked(){
  top10Btn.classList.remove("active");
  allBtn.classList.add("active");
  profileMovies.innerHTML = ""; 
  if (editListBtn != null){
    editListBtn.style.display = "none";
  }

  const xhr = new XMLHttpRequest();
  console.log(profile_user_id);
  xhr.open('GET', `/get_all_graded_movies/${profile_user_id}`);
  xhr.send(null);

  xhr.onload = function(){
    if (this.status === 200){
      all_movies = JSON.parse(this.responseText);
      all_movies_page = 1;
      if (all_movies.length > 12){
        for (var i = 0; i < 12; i++){
          add_movie_to_dom(all_movies[i]);
        }
        profileLoadMore.style.display = "inline";
      }
      else{
        all_movies.forEach(function(movie){
          add_movie_to_dom(movie);
        });
      }
    }
  }
}

function add_movie_to_dom(movie){
  var randomColor = Math.floor((Math.random() * 10) + 1);
  var grade = intToGrade(movie.grade);
  tmdb.getJustMovie(movie.movie_id).then(data =>{
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card-padding";
    movieCard.innerHTML = `
    <div class="top-movie-card" style="background-image: url('https://image.tmdb.org/t/p/w1280/${data.movie.backdrop_path}');">
      <div class="movie-card-overlay bg-${randomColor}">
        <div class="d-flex">
          <div class="poster">
            <img class="shadow" src="https://image.tmdb.org/t/p/w300_and_h450_bestv2/${data.movie.poster_path}" alt="">
          </div>
          <div class="details">
            <div class="name">${data.movie.title} (${data.movie.release_date.substring(0, 4)})</div>
            <div class="view-details"><a href="/movie/${data.movie.id}">View Details <i class="fas fa-long-arrow-alt-right"></i></a> </div>
          </div>
          <div class="rank">
            ${grade}
          </div>
        </div>
      </div>
    </div>          
    `;
    if (profileMovies != null){
      profileMovies.appendChild(movieCard);
    }
  });
}

// Stupid little function
function intToGrade(int){
  switch (int){
    case 0:
      return 'F';
    case 1:
      return 'E';
    case 2:
      return 'D';
    case 3:
      return 'C';
    case 4:
      return 'B';
    case 5:
      return 'A';
    case 6:
      return 'S';
  }
}

function loadMoreAllMovies(){
  let startIndex = all_movies_page*12;
  if (all_movies.length - startIndex > 12){
    for (let i = startIndex; i < startIndex+12; i++){
      add_movie_to_dom(all_movies[i]);
    }
    all_movies_page++;
  }
  else{
    for (let i = startIndex; i < all_movies.length; i++){
      add_movie_to_dom(all_movies[i]);
    }
    profileLoadMore.style.display = "none";
  }
}

// Dull function to submit follow form
function submitFollowForm(){
  followFrom.submit();
}