/**
 * es6 modules and imports
 */
import sayHello from './hello';
sayHello('World');

/**
 * require style imports
 */
const {getMovies, getMovie, postMovie, patchMovie, deleteMovie} = require('./api.js');

//for the loader on page load
let $body = $('body');
$(document).on({
      ajaxStart: function () { $body.addClass('loading'); },
      ajaxStop: function () { $body.removeClass('loading'); }
    }
);

//for the loader to stop
let body = document.getElementsByTagName('body')[0];
let removeLoading = function() {
  setTimeout(function() {
    body.className = body.className.replace(/loading/, '');
  }, 2000);
};

removeLoading();


//Initial GetMovies Call, needed to load the cards
GetMovies();

//GetMovies() builds the cards HTML
function GetMovies(){
  getMovies().then((movies) => {
    console.log('Here are all the movies:');
    movies.forEach(({title, rating, id}) => {
      console.log(`id# ${id} - ${title} - rating: ${rating}`);
      let html = `<div class="">`;
      for (let i = 0; i < movies.length; i++) {
        // let poster = $.get(`https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${movie.title}&callback=?`);
        html += `<div class="card"  style="width: 15rem">
            <!--This calls the poster images to put in the card-->
          <div id="card${[i]}"></div>
          
          <div class="card-body text-center">
          <h5 class="card-title">${movies[i].title}</h5>
          <p class="card-text">Rating: ${movies[i].rating}<img src="icons/star.png" alt =""></p>
          </div>
          <div class="card-footer d-flex justify-content-around">
          
            <!--button for edit (get individual ids for each movie)-->
          <button type="button" class="btn btn-light"  id="editButton" data-movieid="${movies[i].id}" data-toggle="modal" data-target="#movieUpdateModal"><img src="icons/edit.png" alt=""></button>
           
            <!--button for delete-->
          <button class="btn btn-light" id='delete' type="button" data-movieid="${movies[i].id}" data-toggle="modal" data-target="#movieDeleteModal"><img src="icons/trash-can.png" alt=""></button>
           </div>
          </div>
          </div>`;
        $('.movies').html(html);

        //this calls the function for the poster (how each card gets its own specific poster)
        getPoster(movies[i].title, [i]);
      }
    });
  }).catch((error) => {
    alert('Oh no! Something went wrong.\nCheck the console for details.');
    console.log(error);
  });
}


//For Modals
let id;

//================EDIT BUTTON====================//

//jQuery to intercept Edit Button
$('#movieUpdateModal').on('show.bs.modal', function (event) {
  let button = $(event.relatedTarget); // Button that triggered the modal
  let movieId = button.data('movieid');// Extract info from data-* attributes
  let modal = $(this);

  //Set Title for modal
  modal.find('.modal-title').text(`Updating movie ${movieId}`);

  modal.find('#hidden').attr('value', `${movieId}`);

  id = document.getElementById('hidden').value;
  console.log(id + "for updating");

  //Auto-populate title and rating fields with existing
  let selectedMovie = getMovie(movieId).then((movie) =>{
    console.log(movie.title);
    modal.find('#movieTitle').val(movie.title);
    $('#update-rating' + movie.rating).trigger('click');
    console.log(movie.rating + "this is the rating");
  });

  //For the save button inside of the EDIT modal
  $('#saveButton').click(function () {

    //Get the title
    let title = $('#movieTitle').val();

    //Get the rating
    let rating;
    let ele = document.getElementsByName('ratings');
    for(let i = 0; i < ele.length; i++) {
      if(ele[i].checked) {
        console.log(ele[i].value + "this is the rating");
        rating = ele[i].value;
      }
    }

    //Call UpdateMovie with the data entered by the user
    updateMovie(id,title,rating);

    //after updating close modal
    $('#movieUpdateModal').modal('toggle');

    //Call Get Movies to regenerate the cards
    GetMovies();

  });

});


//Function to call PatchMovie, maybe we can just use patchMovie
function updateMovie(id, title, rating) {
  let patchJson = {
    title,
    rating
  };
  patchMovie(patchJson,id);

  console.log(getMovies());
}

//=================NEW MOVIE==================//

$('#add').click(function () {
  let id = $('#add-movie-button').attr('data-movieid');
  let title = $('#movie-title').val();

  //We should maybe make this a function, we use the same code in Update
  let rating;
  let ele = document.getElementsByName('add-ratings');
  for(let i = 0; i < ele.length; i++) {
    if(ele[i].checked) {
      rating = ele[i].value;
    }
  }

  let postJson = {
    title,
    rating
  };
  postMovie(postJson, id);
  console.log(id + "for adding");

  // //after updating close modal
  // $('#movieDeleteModal').modal('toggle');

  //Call Get Movies to regenerate the cards
  GetMovies();


});


//=================DELETE BUTTON=================//

//jquery for the delete button inside the modal to update json
$('#movieDeleteModal').on('show.bs.modal', function (event) {
  let button = $(event.relatedTarget); // Button that triggered the modal

  let movieId = button.data('movieid');// Extract info from data-* attributes

  let modal = $(this);

  modal.find('#delete-id').attr('value', `${movieId}`);

  let id = document.getElementById('delete-id').value;
  $('#deleteButton').click(function () {
    deleteMovie(id);
    console.log(id + "for deleting");

    //after deleting close modal
    $('#movieDeleteModal').modal('toggle');

    //Call Get Movies to regenerate the cards
    GetMovies();

  });

});


//=====================MOVIE POSTER==================//

//title: the title of the movie
//id: the id of the card that the poster needs to be placed in
function getPoster(title, id){
  //Call themoviedb api and return the poster path
  let posterPath = $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=" + title + "&callback=?").then( function(json) {
    if (json != "Nothing found.") {
      console.log(`Title: ${title}`);
      console.log(json);
      return `http://image.tmdb.org/t/p/w500/${json.results[0].poster_path}`;
    } else {
      console.log("Nothing was found");
      console.log(json);
      //Return Default Poster Path
    }
  }).then(function(poster){
    console.log(`PosterPath: ${poster}`);

    //jQuery to update the card with the img html AFTER the response
    $(`#card${id}`).html(`<img src="${poster}" class="card-img-top" alt="...">`);
  });

}
