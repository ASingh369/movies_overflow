
// Initialize DOM variables
const filterPosts = document.querySelector('.filter-posts');
const filter = document.getElementById('filter-options');
const searchPoster = document.getElementById("search-poster");
const posterID = document.getElementById("poster-id");
const posterInner = document.querySelector(".poster-inner");
const postPoster = document.querySelector("#post-poster");
const commentsBox = document.querySelector('.comments-box');

let filterActive = false;

// Show filter options on filter link click
if(filterPosts != null) {
  filterPosts.addEventListener('click', showFilter);
  searchPoster.addEventListener("keyup", showPosterDropdown);
  posterInner.addEventListener('click', showMoviePoster);
  removeAllLinks();
}
function showFilter(){
  if (!filterActive){
    filter.classList.add('show');
  }
  else{
    filter.classList.remove('show');
  }
  filterActive = !filterActive;
}


function showPosterDropdown(e){
  query = searchPoster.value.trim();
  removeAllLinks(); 
  if (query != ""){
    removeAllLinks();
    tmdb.searchMovies(query, 1).then(data =>{
      results = data.searchMovies.results;
      results.forEach(function(result){
        const a = document.createElement('a');
        a.href = "";
        a.id = result.id;
        a.innerHTML = result.title;
        posterInner.appendChild(a);
      });
    });
  }
}

function showMoviePoster(e){
  if (e.target.tagName == 'A' || e.target.tagName == 'a' ){
    e.preventDefault();
    tmdb.getJustMovie(e.target.id).then(data =>{
      postPoster.src = `https://image.tmdb.org/t/p/w1280/${data.movie.backdrop_path}`;
      postPoster.style.display = "inline";
      posterID.value = data.movie.backdrop_path;
    });
  }
}

function removeAllLinks(){
  for (let i = 0; i < posterInner.childNodes.length; i++){
    if (posterInner.childNodes[i].tagName == 'A' || posterInner.childNodes[i].tagName == 'a'){
      posterInner.childNodes[i].remove();
    }
  }
}

function showComments(post_id){
  commentsBox.innerHTML = "";
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/get_comments/${post_id}`);
  xhr.send(null);

  xhr.onload = function(){
    if (this.status === 200){
      comments = JSON.parse(this.responseText);
      comments.forEach(function(comment){
        const div = document.createElement('div');
        div.className = "comment-box";
        div.innerHTML = `
          <div class="comment-heading">
            <span class="name"> ${comment.user__username} </span><i class="fas fa-clock"></i> ${comment.time}
          </div>
          <div class="comment-text">
            ${comment.comment}
          </div>
        `;
        commentsBox.appendChild(div);
      });
      if (comments.length == 0){
        const div = document.createElement('div');
        div.innerHTML = `Nothing to show here at the moment`;
        commentsBox.appendChild(div);
      }
      $.featherlight.close();
      $.featherlight($('#comments'), {});
    }
  }
}