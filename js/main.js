"use strict";

var $ = require('jquery'),
    login = require('./user'),
    Handlebars = require('hbsfy/runtime'),
    movieTemplate = require('../templates/movie-template.hbs'),
    savedMovieTemplate = require('../templates/saved-movie-template.hbs'),
    interact = require('./interactions');

var userId = null;

Handlebars.registerHelper("select", function(value, options) {
  return options.fn(this)
    .split('\n')
    .map(function(v) {
      var t = 'value="' + value + '"';
      return ! new RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"');
    })
    .join('\n');
});

// USER LOGIN
$(document).on("click", "#loginButton", function () {
  login()
  .then(function(data) {
    userId = data.user.uid;
    $("#unwatchedMoviesButton, #watchedMoviesButton, #favoritesMoviesButton").removeAttr("disabled");
    $("#showWatchedRow, #showFavoritesRow, #showUnwatchedRow").html("");
    $("#userName").append(`<marquee> Welcome ${data.user.displayName}!</marquee>`);
    interact.showSavedMovies(userId)
      .then(loadDom)
      .then(function () {
        $("#loginButton").addClass('hidden');
        $("#logoutButton").removeClass('hidden');
      });
  });
});

// USER LOGOUT
$(document).on("click", "#logoutButton", function () {
  location.reload();
});

// REMOVE SEARCHED MOVIE FROM UNTRACKED PAGE
$(document).on("click", ".removeButton", function () {
  $(this).parent(".movie").remove();
});

// SWITCH WATCHED / UNWATCHED MOVIES / UNTRACKED / FAVORITES ROWS
$(document).on("click", ".switchViewButton", function() {
  checkEmptyMovies();
  let breadcrumb = $(this).data("breadcrumb");
  let partnerRow = $(this).data("partner");

  $("#breadcrumbs").text(` > ${breadcrumb}`);

  $(`${partnerRow}`).removeClass('hidden');
  $(`${partnerRow}`).siblings('.row').addClass('hidden');

  //this toggles the slider to only show when the watched movies button is clicked
  console.log(this.id);
  if (this.id === "watchedMoviesButton") {
    $("#showSlider").toggleClass("hidden")
  } else $("#showSlider").addClass("hidden");

  $(this).siblings('.btn').removeClass('btn-primary');
  $(this).addClass('btn-primary');
});

// THIS IS THE FUNCTION TO SEARCH FOR A MOVIE AND ADD IT TO THE DOM
$(document).on("keypress", "#searchInput", function (e) {
  if (e.keyCode == 13) {
    if(!$("#searchInput").val()) {
      return alert("You need to enter a movie title");
    }
    let movieTitle = $("#searchInput").val();
    $("#noMovies").remove();
    interact.searchMovies(movieTitle)
    .then(function (data) {
      $("#searchInput").html("");
      let checkImdbid = data.imdbID;
      let duplicateMovie = $(`select[data-imdbid='${checkImdbid}']`).parent(".movie");
      if(duplicateMovie.length) {
        let showRow = duplicateMovie.parent(".row");
        let rowPartner = showRow.data("partner");
        let partnerBreadcrumb = $(`#${rowPartner}`).data("breadcrumb");

        showRow.removeClass('hidden');
        showRow.siblings('.row').addClass("hidden");

        $(`#${rowPartner}`).addClass('btn-primary');
        $(`#${rowPartner}`).siblings(".btn").removeClass('btn-primary');

        $("#breadcrumbs").text(`${partnerBreadcrumb}`);

      } else {
        data.userRating = 0;
        if(data.Response === "False" || data.Actors === "N/A"){
          return alert("No Movie Found!");
        }

        $("#showUntrackedRow").append(movieTemplate(data));
      }
    });
  }
});

// THIS FUNCTION SAVES A MOVIE TO FIREBASE WITH A UNIQUE ID
$(document).on("click", ".saveButton", function (e) {
  let movieObj = buildMovieObj(e);
  $(this).parent(".movie").remove();
  interact.saveMovie(movieObj)
  .then(clearAndReload);
});

// EDITING A MOVIE FUNCITON
$(document).on("change", ".editMovie", function () {

  var watchedStatus;

  let userRating = $(this).val();
  if (userRating) {
    watchedStatus = true;
  } else {
    watchedStatus = false;
  }

  let imdbID = $(this).data("imdbid");
  let uid = userId;

  let editKey = $(this).data("editkey");

  let editMovieObj = {
    imdbID,
    userRating,
    watchedStatus,
    uid
  };

  interact.editSavedMovie(editMovieObj, editKey)
  .then(clearAndReload);
});

// DELETE THAT MOVIE FUNCTION
$(document).on("click", ".deleteButton", function() {
  let deleteKey = $(this).data("deletekey");
  interact.deleteSavedMovie(deleteKey)
  .then(clearAndReload);
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

  let userRating = 0;
  let uid = userId;

  return {
    imdbID,
    watchedStatus,
    userRating,
    uid
  };
}

// CLEAR AND RELOAD THE PAGE
function clearAndReload () {
    $("#showWatchedRow, #showUnwatchedRow, #showFavoritesRow").html("");
    interact.showSavedMovies(userId)
    .then(loadDom);
}

//LOADS SAVED SONGS TO DOM
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
      movie.userRating = dataArray[iter].userRating;
      movie.uid = dataArray[iter].uid;

      if(movie.watched === false) {
        $("#showUnwatchedRow").append(savedMovieTemplate(movie));
      // } else if (movie.userRating === "10") {
      //   $("#showFavoritesRow").append(savedMovieTemplate(movie));
      } else if (movie.watched === true) {
        $("#showWatchedRow").append(savedMovieTemplate(movie));
      }
      console.log(movie);
    });

    // On this day, August 29, a big, mean bug was killed. >:(
    checkEmptyMovies();
  });
}

// CHECK IF THERE ARE MOVIES
function checkEmptyMovies () {

  $("#noMovies").remove();
  if ( (!($("#showUnwatchedRow").children(".movie").length)) && (!($("#showWatchedRow").children(".movie").length)) && (!($("#showUntrackedRow").children(".movie").length))
    ) {
    $("#showUntrackedRow").append(`<p id="noMovies">:-( You don't have any movies. To add a movie, search for the title above.</p>`);
  }

  $("#noUnwatched").remove();
  if (!($("#showUnwatchedRow").children(".movie").length)) {
   $("#showUnwatchedRow").append(`<p id="noUnwatched">:-( You don't have any unwatched movies. Look some up and get to watching!</p>`);
  }

  $("#noWatched").remove();
  if (!($("#showWatchedRow").children(".movie").length)) {
   $("#showWatchedRow").append(`<p id="noWatched">:-( You haven't watched anything. Give your unwatched movies a rating to show you watched them.</p>`);
  }

  $("#noFaves").remove();
  if (!($("#showFavoritesRow").children(".movie").length)) {
   $("#showFavoritesRow").append(`<p id="noFaves">:-( You don't like anything. You have to give a movie a 10 to create a favorite.</p>`);
  }
}

checkEmptyMovies();
