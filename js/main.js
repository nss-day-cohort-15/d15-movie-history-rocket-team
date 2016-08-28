"use strict";

var $ = require('jquery'),
    Handlebars = require('hbsfy/runtime'),
    movieTemplate = require('../templates/movie-template.hbs'),
    savedMovieTemplate = require('../templates/saved-movie-template.hbs'),
    interact = require('./interactions');

var userId = null;

$(document).on("click", "#navFind", function() {
  $("#navShow").removeClass('active');
  $("#navFind").addClass('active');
  $("#editForm").addClass('hidden');

  $("#showContainer").addClass('hidden');
  $("#findContainer").removeClass('hidden');

});

// ALL THE FIND FUNCTIONS
// THIS IS THE FUNCTION TO SEARCH FOR A MOVIE AND ADD IT TO THE DOM
$(document).on("click", "#searchButton", function () {
  //Validating a movie title
  if(!$("#searchInput").val()) {
    return alert("You need to enter a movie title");
  }
  let movieTitle = $("#searchInput").val();
  interact.searchMovies(movieTitle)
  .then(function (data) {
    console.log(data);
    data.userRating = 0;
      if(data.Response === "False" || data.Actors === "N/A"){
        return alert("No Movie Found!");
      }
    $("#findContainerRow").append(movieTemplate(data));
  });
});

// REMOVE SEARCHED MOVIE FROM FIND PAGE
$(document).on("click", ".removeButton", function () {
  $(this).parent(".movie").remove();
})

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
  $("#navShow").addClass('active');
  $("#navFind").removeClass('active');
  $("#editForm").addClass('hidden');

  $("#showContainer").removeClass('hidden');
  $("#findContainer").addClass('hidden');

  $("#showContainerRow").html("");
  interact.showSavedMovies(userId)
  .then(loadDom);
});

// SWITCH WATCHED / UNWATCHED VIEWS
$(document).on("click", "#watchedMoviesButton", function() {
  $("#showContainerRow").removeClass('hidden');
  $("#showUnwatchedRow").addClass('hidden');
});

$(document).on("click", "#unwatchedMoviesButton", function() {
  $("#showUnwatchedRow").removeClass('hidden');
  $("#showContainerRow").addClass('hidden');
});

// DELETE THAT MOVIE FUNCTION
$(document).on("click", ".deleteButton", function() {
  let deleteKey = $(this).data("deletekey");
  interact.deleteSavedMovie(deleteKey)
  .then(function(data) {
    $("#showContainerRow").html("");
    interact.showSavedMovies(userId)
    .then(loadDom);
  })
})

// EDITING A MOVIE FUNCTION
$(document).on("click", ".editButton", function () {
  let editKey = $(this).data("editkey");
  let imdbid = $(this).data("imdbid");

  $("#editForm").removeClass('hidden');
  $("#showContainer").addClass('hidden');

  $("#submitEdit").data("imdbid", imdbid);
  $("#submitEdit").data("editkey", editKey);
});

$(document).on("click", "#submitEdit", function () {

  let editedRating = $("#editForm").find('select').val();
  let watchedStatus = $("#editForm").find('input:checkbox:checked').val();

  if (watchedStatus === "on") {
    watchedStatus = true;
  } else {
    watchedStatus = false;
  }
  let imdbID = $(this).data("imdbid");
  let uid = userId;

  let editKey = $(this).data("editkey");

  let editMovieObj = {
    imdbID,
    watchedStatus,
    editedRating,
    uid
  }

  interact.editSavedMovie(editMovieObj, editKey)
  .then(function (data) {
    $("#showContainer").html("");
    interact.showSavedMovies(userId)
      .then(loadDom);
  })
});

// MAKES SONG OBJECT TO BE SAVED
function buildMovieObj (e) {
  let movie = $(e.currentTarget).parent(".movie");
  let imdbID = $(e.currentTarget).data("imdbid");
  let watchedStatus = $(movie).find('input:checkbox:checked').val();
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

//RE-LOADS SAVED SONGS TO DOM
function loadDom (data) {
    var dataArray = [];
    var imdbArray = [];
    $.each(data, function(key, value) {
      value.key = key;
      dataArray.push(value);
      imdbArray.push(value.imdbID);
    });

    interact.getSavedMovies(imdbArray.map((imdbId) => {
      return interact.searchMovieByImdbId(imdbId);
    }))
    .then((data) => {
      data.forEach((movie, iter) => {
        movie.fbId = dataArray[iter].key;
        movie.watched = dataArray[iter].watchedStatus;
        movie.rating = dataArray[iter].userRating;
        movie.uid = dataArray[iter].uid;
      });
      console.log(data);
      data.forEach(function (movie) {
        if(movie.watched === false) {
          $("#showUnwatchedRow").append(savedMovieTemplate(movie));
        } else if (movie.watched === true) {
          $("#showContainerRow").append(savedMovieTemplate(movie));
        };
      });
      $("#showContainer").removeClass('hidden');
      $("#editForm").addClass('hidden');
    });
  };

