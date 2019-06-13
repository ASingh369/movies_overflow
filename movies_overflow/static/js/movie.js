// Initialize dom variables
const movieName = document.getElementById("movie-name");
const description = document.getElementById("description");
const movieTopImage = document.getElementById("movie-top-image");
const movieDetails = document.querySelector(".movie-details");
const posterImage = document.querySelector("#poster-image");
const movieTime = document.getElementById("movie-time");
const releaseDate = document.getElementById("release-date");
const genreList = document.getElementById("genre-list");
const crewList = document.getElementById("crew-list");
const castList = document.getElementById("cast-list");

// set movie id
const movieID = 64690;

// sample movie ids ==> 447404 8 9 126 339846 307081 118 64690 420817

// Make http call
tmdb.getMovie(movieID).then(data => {
  if (
    data.movie.status_message ==
    "The resource you requested could not be found."
  ) {
    // Movie not found
  } else {
    if (movieName != null) {
      movieName.innerHTML = data.movie.title;
      if (data.movie.overview != "") {
        description.innerHTML = data.movie.overview;
      }
      movieTopImage.style.backgroundImage = `url("https://image.tmdb.org/t/p/w1280/${
        data.movie.backdrop_path
      }")`;

      // Fix background Image size for mobile devices
      let mobile = window.matchMedia("(max-width: 700px)");
      if (mobile.matches) {
        movieTopImage.style.backgroundSize =
          "700px " + movieDetails.offsetHeight + "px";
      } else {
        movieTopImage.style.backgroundSize = "cover";
      }

      // Add poster image
      posterImage.src = `https://image.tmdb.org/t/p/w300_and_h450_bestv2/${
        data.movie.poster_path
      }`;

      // Add movie time
      movieTime.innerHTML = data.movie.runtime;

      // Add movie release date

      let uglyDate = new Date(data.movie.release_date + "T12:00:00Z");
      let month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ][uglyDate.getMonth()];
      let goodDate =
        month + " " + uglyDate.getDate() + ", " + uglyDate.getFullYear();
      releaseDate.innerHTML = goodDate;

      // Add movie genre list
      const genres = data.movie.genres;
      genres.forEach(function(genre) {
        const genreItem = document.createElement("div");
        genreItem.className = "genre-item";
        genreItem.innerHTML = genre.name;

        genreList.appendChild(genreItem);
      });

      // Add crew members list
      const crew = data.movieCredits.crew;
      const directorsOrWriters = [];
      crew.forEach(function(member) {
        if (member.job == "Director" || member.job == "Writer")
          directorsOrWriters.push(member);
      });

      // Check if someone is both director Or writer
      for (let i = 0; i < directorsOrWriters.length; i++) {
        for (let j = i + 1; j < directorsOrWriters.length; j++) {
          if (
            directorsOrWriters[i].name == directorsOrWriters[j].name &&
            directorsOrWriters[i].name != ""
          ) {
            directorsOrWriters[i].job = "Director, Writer";
            directorsOrWriters[j].name = "";
          }
        }
      }

      // Now add members to crew list
      for (let i = 0; i < directorsOrWriters.length; i++) {
        if (directorsOrWriters[i].name != "") {
          const crewItem = document.createElement("div");
          crewItem.className = "crew-item";
          const crewHeading = document.createElement("div");
          crewHeading.className = "crew-heading";
          crewHeading.innerHTML = directorsOrWriters[i].job;
          const item = document.createElement("div");
          item.className = "item";
          item.innerHTML = directorsOrWriters[i].name;

          crewItem.appendChild(crewHeading);
          crewItem.appendChild(item);
          crewList.appendChild(crewItem);
        }
      }

      // Add cast members to cast list
      const castArray = data.movieCredits.cast;

      while (castArray.length > 10) {
        castArray.pop();
      }

      castArray.forEach(function(actor) {
        const actorDiv = document.createElement("div");
        actorDiv.className = "actor-card";
        actorDiv.style.backgroundColor = "#222";

        tmdb.getActorData(actor.id).then(actorData => {
          const randomNumber = Math.floor(
            Math.random() * actorData.actorCredits.cast.length
          );
          actorDiv.style.backgroundImage = `url("https://image.tmdb.org/t/p/w300_and_h450_bestv2/${
            actorData.actorCredits.cast[randomNumber].poster_path
          }")`;
        });

        const socialContainer = document.createElement("div");
        const social = document.createElement("div");

        social.className = "actor-social";
        socialContainer.appendChild(social);

        tmdb.getActorSocial(actor.id).then(actorSocial => {
          const allSocial = actorSocial.actorSocial;

          if (allSocial.twitter_id != null) {
            const socialLink = document.createElement("a");
            socialLink.href = "https://twitter.com/" + allSocial.twitter_id;
            socialLink.style.marginRight = "0.8rem";
            socialLink.style.color = "#fff";
            socialLink.setAttribute("target", "_blank");
            let twitter = document.createElement("i");
            twitter.className = "fab fa-twitter";

            socialLink.appendChild(twitter);
            social.appendChild(socialLink);
          }
          if (allSocial.facebook_id != null) {
            const socialLink = document.createElement("a");
            socialLink.href = "https://facebook.com/" + allSocial.facebook_id;
            socialLink.style.marginRight = "0.8rem";
            socialLink.style.color = "#fff";
            socialLink.setAttribute("target", "_blank");
            let facebook = document.createElement("i");
            facebook.className = "fab fa-facebook";

            socialLink.appendChild(facebook);
            social.appendChild(socialLink);
          }
          if (allSocial.instagram_id != null) {
            const socialLink = document.createElement("a");
            socialLink.href = "https://instagram.com/" + allSocial.instagram_id;
            socialLink.style.marginRight = "0.8rem";
            socialLink.style.color = "#fff";
            socialLink.setAttribute("target", "_blank");
            let instagram = document.createElement("i");
            instagram.className = "fab fa-instagram";

            socialLink.appendChild(instagram);
            social.appendChild(socialLink);
          }
          if (allSocial.imdb_id != null) {
            const socialLink = document.createElement("a");
            socialLink.href = "https://imdb.com/name/" + allSocial.imdb_id;
            socialLink.style.marginRight = "0.8rem";
            socialLink.style.color = "#fff";
            socialLink.setAttribute("target", "_blank");
            let imdb = document.createElement("i");
            imdb.className = "fab fa-imdb";

            socialLink.appendChild(imdb);
            social.appendChild(socialLink);
          }

          actorDiv.innerHTML = `
              <div class="actor-overlay">
                <h3>${actor.name}</h3>
                <div class="actor-image">
                  <img
                    src="https://image.tmdb.org/t/p/w138_and_h175_face/${
                      actor.profile_path
                    }"
                    alt=""
                  />
                </div>
                <div class="actor-role">${actor.character}</div>
                ${social.innerHTML}
              </div>
            `;

          castList.appendChild(actorDiv);
        });
      });
    }
  }
});
