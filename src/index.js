/**
 * es6 modules and imports
 */
import sayHello from './hello';
sayHello('World');

/**
 * require style imports
 */
const {getMovies, getMovie, postMovie, patchMovie, deleteMovie} = require('./api.js');

//Initial GetMovies Call
GetMovies();


function GetMovies(){
  getMovies().then((movies) => {
    console.log('Here are all the movies:');
    movies.forEach(({title, rating, id}) => {
      console.log(`id# ${id} - ${title} - rating: ${rating}`);
      let html = `<div class="">`;
      for (let i = 0; i < movies.length; i++) {
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


//jQuery to intercept Edit Button
$('#movieUpdateModal').on('show.bs.modal', function (event) {
  let button = $(event.relatedTarget); // Button that triggered the modal
  let movieId = button.data('movieid');// Extract info from data-* attributes

  let modal = $(this);

  modal.find('.modal-title').text(`Updating movie ${movieId}`);


  let selectedMovie = getMovie(movieId).then((movie) =>{
    console.log(movie.title);
    modal.find('#movieTitle').val(movie.title);
    modal.find('#movieRating').val(movie.rating);


  });

});


//jQuery for the save button inside the modal to update json
$('#saveButton').click(function () {

  //Get the ID
  let id = $('#editButton').attr('data-movieid');

  //Get the title
  let title = $('#movieTitle').val();

  //Get the rating
  let rating = $('#movieRating').val();

  updateMovie(id,title,rating);

  //after updating close modal
  $('#movieUpdateModal').modal('toggle');

  //Call Get Movies to regenerate the cards
  GetMovies();


});

//jquery for the delete button inside the modal to update json
$('#deleteButton').click(function () {
  let id = $('#delete').attr('data-movieid');
  deleteMovie(id);
  console.log(id);

  //after updating close modal
  $('#movieDeleteModal').modal('toggle');

  //Call Get Movies to regenerate the cards
  GetMovies();


});

function updateMovie(id, title, rating) {
  let patchJson = {
    title,
    rating
  };
  patchMovie(patchJson,id);

  console.log(getMovies())
}




