const profileBgImage = document.getElementById("profile-bg");
const profileMovies = document.getElementById("profile-movies");
const editListBtn = document.getElementById("edit-list-btn");
const editList = document.getElementById("edit-list");
var movies_list = []; // Top 10 movies array


displayTop10();
editListBtn.addEventListener('click', showCurrentTop10Movies);

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
  profileMovies.innerHTML = "";
  
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
              if (total_movies > 0){
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
  profileMovies.innerHTML = "";
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
    profileMovies.appendChild(movieCard);
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