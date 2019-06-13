
// Initialize DOM variables
const filterPosts = document.querySelector('.filter-posts');
const filter = document.getElementById('filter-options');

let filterActive = false;

// Show filter options on filter link click
if(filterPosts != null) {
  filterPosts.addEventListener('click', showFilter);
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
