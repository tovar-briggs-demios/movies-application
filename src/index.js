/**
 * es6 modules and imports
 */
import sayHello from './hello';
sayHello('World');

/**
 * require style imports
 */
const {getMovies, getMovie, postMovie, patchMovie, deleteMovie, getPoster} = require('./api.js');


//for the loader
let body = document.getElementsByTagName('body')[0];
let removeLoading = function() {
  setTimeout(function() {
    body.className = body.className.replace(/loading/, '');
  }, 1000);
};
removeLoading();


//Initial GetMovies Call
GetMovies();


function GetMovies(){
  //for the loader

  getMovies().then((movies) => {
    console.log('Here are all the movies:');
    movies.forEach(({title, rating, id}) => {
      console.log(`id# ${id} - ${title} - rating: ${rating}`);
      let html = `<div class="">`;
      for (let i = 0; i < movies.length; i++) {
        // let poster = $.get(`https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${movie.title}&callback=?`);
        html += `<div class="card"  style="width: 15rem">
          <img src="" class="card-img-top" alt="...">
          
          <div class="card-body text-center">
          <h5 class="card-title">${movies[i].title}</h5>
          <p class="card-text">Rating: ${movies[i].rating}<img src="icons/star.png" alt =""></p>
          </div>
          <div class="card-footer d-flex justify-content-around">
          
            <!--button for edit (get individual ids for each movie)-->
          <button type="button" class="btn btn-light"  id="editButton" data-movieid="${movies[i].id}" data-toggle="modal" data-target="#movieUpdateModal"><img src="icons/edit.png" alt=""></button>
           
          <button class="btn btn-light" id='delete' type="button" data-movieid="${movies[i].id}" data-toggle="modal" data-target="#movieDeleteModal"><img src="icons/trash-can.png" alt=""></button>
           </div>
          </div>
          </div>`;
        $('.movies').html(html);
      }
    });
  }).catch((error) => {
    alert('Oh no! Something went wrong.\nCheck the console for details.');
    console.log(error);
  });
}


let id;

//jQuery to intercept Edit Button
$('#movieUpdateModal').on('show.bs.modal', function (event) {
  let button = $(event.relatedTarget); // Button that triggered the modal

  let movieId = button.data('movieid');// Extract info from data-* attributes

  let modal = $(this);

  //on top of the modal
  modal.find('.modal-title').text(`Updating movie ${movieId}`);

  modal.find('#hidden').attr('value', `${movieId}`);

  id = document.getElementById('hidden').value;
  console.log(id + "for updating");

  let selectedMovie = getMovie(movieId).then((movie) =>{
    console.log(movie.title);
    modal.find('#movieTitle').val(movie.title);
    $('#update-rating' + movie.rating).trigger('click');
    console.log(movie.rating + "this is the rating");


  });

  $('#saveButton').click(function () {

    // id =  parseInt($('#editButton').attr('data-movieid'));
    // console.log(id);

    //Get the title
    let title = $('#movieTitle').val();

    let rating;
    let ele = document.getElementsByName('ratings');
    for(let i = 0; i < ele.length; i++) {
      if(ele[i].checked) {
        console.log(ele[i].value + "this is the rating");
        rating = ele[i].value;
      }
    }


    //Get the rating

    // let newId= document.getElementsByName('ratings').val();

    updateMovie(id,title,rating);


    //after updating close modal
    $('#movieUpdateModal').modal('toggle');

    //Call Get Movies to regenerate the cards
    GetMovies();


  });

});


$('#add-movie').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var recipient = button.data('whatever'); // Extract info from data-* attributes

  var modal = $(this);
  // modal.find('.modal-title').text('New message to ' + recipient);
  modal.find('.modal-body input').val(recipient)
});

//Get the ID
// let id;


//jQuery for the save button inside the modal to update json



function updateMovie(id, title, rating) {
  let patchJson = {
    title,
    rating
  };
  patchMovie(patchJson,id);

  console.log(getMovies());
}

$('#add').click(function () {
  let id = $('#add-movie-button').attr('data-movieid');
  let title = $('#movie-title').val();
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
    $('#movieDeleteModal').modal('toggle');
    GetMovies();

  });


  //after updating close modal

  //Call Get Movies to regenerate the cards


});

//for the loader
let $body = $('body');
$(document).on({
  ajaxStart: function () { $body.addClass('loading'); },
  ajaxStop: function () { $body.removeClass('loading'); }

    }

);



