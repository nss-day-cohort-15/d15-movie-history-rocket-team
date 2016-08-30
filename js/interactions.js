"use strict";

var $ = require('jquery');

// SEARCH BY TITLE
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

// SEARCH BY IMDBID
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

// SAVE TO FB
var saveMovie = function (movieObj) {
  console.log("Movie to be saved:", movieObj);
  console.log("Parsed movie:", JSON.stringify(movieObj));
  return new Promise (function (resolve, reject) {
    $.ajax({
      url: `https://tunnel-snakes-forked-project.firebaseio.com/movies.json`,
      type: 'POST',
      data: JSON.stringify(movieObj),
      dataType: 'json'
    }).done(function(data){
      resolve(data);
    });
  });
};

// GET SAVED MOVIES BY USERID
var showSavedMovies = function (userId) {
  return new Promise (function (resolve, reject) {
    $.ajax({
      url: `https://tunnel-snakes-forked-project.firebaseio.com/movies.json?orderBy="uid"&equalTo="${userId}"`,
      type: 'GET'
    }).done(function(data){
      resolve(data);
    });
  });
};

// EDIT SAVED MOVIES
var editSavedMovie = function (editMovieObj, editKey) {
  return new Promise (function (resolve, reject) {
    $.ajax({
      url: `https://tunnel-snakes-forked-project.firebaseio.com/movies/${editKey}.json`,
      type: 'PUT',
      data: JSON.stringify(editMovieObj)
    }).done(function(data){
      resolve(data);
    });
  });
};

// REMOVE SAVED MOVIE FROM FB
var deleteSavedMovie = function (deleteKey) {
  return new Promise (function (resolve, reject) {
    $.ajax({
      url: `https://tunnel-snakes-forked-project.firebaseio.com/movies/${deleteKey}.json`,
      type: 'DELETE'
    }).done(function(data){
      resolve(data);
    });
  });
};

// GET THE IMDB MOVIES
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

