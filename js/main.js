"use strict";

var $ = require('jquery'),
    Handlebars = require('hbsfy/runtime'),
    movieTemplate = require('../templates/movie-template.hbs'),
    interact = require('./interactions');

var userId = null;

$(document).on("click", "#navFind", function() {
  $("#showContainer").toggleClass('hidden');
  $("#findContainer").toggleClass('hidden');
});

// ALL THE FIND FUNCTIONS
// THIS IS THE FUNCTION TO SEARCH FOR A MOVIE AND ADD IT TO THE DOM
$(document).on("click", "#searchButton", function () {
  //Validating a movie title
  if(!$("#searchInput").val()) {
    return alert("You need to enter a movie title");
  }
  console.log("request good");
  let movieTitle = $("#searchInput").val();
  interact.searchMovies(movieTitle)
  .then(function (data) {
    console.log(data);
    data.userRating = 0;
    $("#findContainerRow").append(movieTemplate(data));
  });
});

// THIS FUNCTION SAVES A MOVIE TO FIREBASE WITH A UNIQUE ID
$(document).on("click", ".saveButton", function (e) {
  let movieObj = buildMovieObj(e);
  let that = this;
  interact.saveMovie(movieObj)
  .then(function (data) {
    console.log("Your song has been saved!");
    $(that).remove();
  });
});

// ALL THE SHOW FUNCTIONS
// GETS SAVED MOVIES FROM THE FIREBASE AND DISPLAYS THEM
$(document).on("click", "#navShow", function() {
  $("#findContainer").toggleClass('hidden');
  $("#showContainer").toggleClass('hidden');
  interact.getSavedMovies(userId)
  .then(function (data) {
    // data.each($(showContainerRow))?????
  });
});

function buildMovieObj (e) {
  let movie = $(e.currentTarget).parent(".movie");
  console.log(movie);

  console.dir(e.currentTarget);
  let imbdID = $(e.currentTarget).data("imbdid");
  console.log("imbdid", imbdID);

  let watchedStatus = $(movie).find('input:checkbox:checked').val();
  console.log("watched status", watchedStatus);

  let userRating = $(movie).find('input:select:selected').val();
  console.log("userRating", userRating);

  let uid = userId;

  return {
    "imbdID": imbdID,
    "watchedStatus": watchedStatus,
    "userRating": userRating,
    "uid": uid
  };
}


