/**
 * es6 modules and imports
 */
import sayHello from './hello';
sayHello('World');

/**
 * require style imports
 */
const {getMovies, getMovie, postMovie, patchMovie} = require('./api.js');

getMovies().then((movies) => {
  console.log('Here are all the movies:');
  movies.forEach(({title, rating, id}) => {
    console.log(`id#${id} - ${title} - rating: ${rating}`);
    let html = `<div class="">`;
    for (let i = 0; i < movies.length; i++) {
      html += `<div class="card" style="width: 15rem">
          <img src="" class="card-img-top" alt="...">
          <div class="card-body text-center">
          <h5 class="card-title">${movies[i].title}</h5>
          <p class="card-text">Rating: ${movies[i].rating}</p>
          </div>
          <div class="card-footer d-flex justify-content-around">
          <button class="btn btn-light" type="button"><img src="icons/edit.png" alt=""></button>
          <button class="btn btn-light" type="button"><img src="icons/trash-can.png" alt=""></button>
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

