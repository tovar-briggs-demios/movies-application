 module.exports = {
      getMovies: () => {
        return fetch('/api/movies')
            .then(response => response.json());
      },
      getMovie : (id) => {
        return fetch(`/api/movies/${id}`)
            .then(resp => resp.json());
      },
      postMovie : (movie, id) => {
          console.log(movie);
        return fetch(`api/movies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(movie, id),
        })
      },
      patchMovie : (movie, id) => {
          console.log(movie);
        return fetch(`api/movies/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(movie),
        })
      },
     deleteMovie : (id) => {
         return fetch(`api/movies/${id}`, {
             method: 'DELETE',
             headers: {
                 'Content-Type': 'application/json',
             },
         })
      }
    };

