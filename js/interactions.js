"use strict";

var $ = require('jquery');

var searchMovies = function (movieTitle) {
  return new Promise (function (resolve, reject) {
    $.ajax({
      url: `http://www.omdbapi.com/?t=${movieTitle}&y=&plot=full&type=movie&r=json`,
      type: 'GET'
    }).done(function(data){
      resolve(data);
    });
  });
};

var searchMovieByImdbId = function (imdbID) {
  return new Promise (function (resolve, reject) {
    $.ajax({
      url: `http://www.omdbapi.com/?i=${imdbID}&y=&plot=full&type=movie&r=json`,
      type: 'GET'
    }).done(function(data){
      resolve(data);
    });
  });
};

var saveMovie = function (movieObj) {
  console.log("Movie to be saved:", movieObj);
  console.log("Parsed movie:", JSON.stringify(movieObj));
  return new Promise (function (resolve, reject) {
    $.ajax({
      url: `https://rocket-team-movies.firebaseio.com/movies.json`,
      type: 'POST',
      data: JSON.stringify(movieObj),
      dataType: 'json'
    }).done(function(data){
      resolve(data);
    });
  });

};

var showSavedMovies = function (userId) {
  return new Promise (function (resolve, reject) {
    $.ajax({
      url: `https://rocket-team-movies.firebaseio.com/movies.json`,
      type: 'GET'
    }).done(function(data){
      resolve(data);
    });
  });
};

var editSavedMovie = function () {
  return new Promise (function (resolve, reject) {
    $.ajax({
      url: `https://rocket-team-movies.firebaseio.com/`,
      type: 'PUT'
    }).done(function(data){
      resolve(data);
    });
  });
};

var deleteSavedMovie = function (deleteKey) {
  return new Promise (function (resolve, reject) {
    $.ajax({
      url: `https://rocket-team-movies.firebaseio.com/movies/${deleteKey}.json`,
      type: 'DELETE'
    }).done(function(data){
      resolve(data);
    });
  });
};

var getSavedMovies = function (imdbArray) {
  return Promise.all(imdbArray);
};

module.exports = {
  searchMovies,
  saveMovie,
  showSavedMovies,
  editSavedMovie,
  deleteSavedMovie,
  searchMovieByImdbId,
  getSavedMovies
};

