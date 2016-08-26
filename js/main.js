"use strict";

var $ = require('jquery'),
    interact = require('./interactions');

var userId = null;

$(document).on("click", "#navFind", function() {
  $("#showContainer").toggleClass('hidden');
  $("#findContainer").toggleClass('hidden');
});

// ALL THE FIND FUNCTIONS
// THIS IS THE FUNCTION TO SEARCH FOR A MOVIE AND ADD IT TO THE DOM
$(document).on("click", "searchButton", function () {
  let movieTitle = $("#searchInput").val();
  interact.searchMovie(movieTitle)
  .then(function (data) {
    data.userRating = 0;
    $("#findContainerRow").append(movie-template(data));
  });
});

// THIS FUNCTION SAVES A MOVIE TO FIREBASE WITH A UNIQUE ID
$(document).on("click", "#saveButton", function () {
  let movieObj = buildMovieObj();
  interact.saveMovie(movieObj)
  .then(function (data) {
    console.log("Your song has been saved!");
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

function buildMovieOcj () {
  let imbdID = $(this).data("imbdID");

  return movieObj;
};


