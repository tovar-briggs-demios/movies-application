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
    let html = `<div class="card-deck">`;
    for (let i = 0; i < movies.length; i++) {
      html += ` <div class="card">
    <img src=" class="card-img-top" alt="...">
          <div class="card-body">
          <h5 class="card-title">${movies[i].title}</h5>
          <p class="card-text">${movies[i].rating}</p>
          <p>
          <button class="btn btn-light" type="button"><img src="icons/add.png" alt=""></button>
          <button class="btn btn-light" type="button"><img src="icons/trash-can.png" alt=""></button>
           </p>
          <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
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

