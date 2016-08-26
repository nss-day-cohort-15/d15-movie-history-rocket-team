"use strict";

var $ = require('jquery');

var searchMovies = function (movieTitle) {
  return new Promise (function (resolve, reject) {
    $.ajax({
      url: `http://www.omdbapi.com/?t=${movieTitle}&y=&type=movie&r=json`,
      type: 'GET'
    }).done(function(data){
      resolve(data);
    });
  });
};

var saveMovie = function (movieObj) {
  return new Promise (function (resolve, reject) {
    $.ajax({
      url: `https://rocket-team-movies.firebaseio.com/movies.json`,
      type: 'POST',
      data: movieObj,
      dataType: 'json'
    }).done(function(data){
      resolve(data);
    });
  });

};

var showSavedMovies = function (userId) {
  return new Promise (function (resolve, reject) {
    $.ajax({
      url: `https://rocket-team-movies.firebaseio.com/`,
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

var deleteSavedMovie = function () {
  return new Promise (function (resolve, reject) {
    $.ajax({
      url: `https://rocket-team-movies.firebaseio.com/`,
      type: 'DELETE'
    }).done(function(data){
      resolve(data);
    });
  });
};

module.exports = {searchMovies, saveMovie, showSavedMovies, editSavedMovie, deleteSavedMovie};

