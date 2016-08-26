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
  interact.saveMovie(movieObj)
  .then(function (data) {
    console.log("Your song has been saved!");
    $(this).remove();
  });
});

// ALL THE SHOW FUNCTIONS
// GETS SAVED MOVIES FROM THE FIREBASE AND DISPLAYS THEM
$(document).on("click", "#navShow", function() {
  $("#findContainer").toggleClass('hidden');
  $("#showContainer").toggleClass('hidden');
  interact.showSavedMovies(userId)
  .then(function (data) {
      var dataArray = [];
      var imdbArray = [];
    $.each(data, function(key, value) {
      value.key = key;
      dataArray.push(value);
      imdbArray.push(value.imdbID);
    });

    interact.getSavedMovies(imdbArray);
  });
});

function buildMovieObj (e) {
  let movie = $(e.currentTarget).parent(".movie");
  let imdbID = $(e.currentTarget).data("imdbid");
  let watchedStatus = $(movie).find('input:checkbox:checked').val();
  // Save watchedStatus as a boolean value
  if (watchedStatus === "on") {
    watchedStatus = true;
  } else {
    watchedStatus = false;
  }

  let userRating = $(movie).find('select').val();
  let uid = userId;

  return {
    imdbID,
    watchedStatus,
    userRating,
    uid
  };
}


