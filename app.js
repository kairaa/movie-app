const express = require('express');
const bodyParser = require('body-parser');
const https = require('http');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home');
})


app.post('/', (req, res) => {
  const movieName = req.body.movieName.split(' ').join('+');;
  const apiKey = 'cfd6f31c&t';
  let url = `http://www.omdbapi.com/?apikey=${apiKey}&t=${movieName}`
  console.log(url);

  https.get(url, (response) => {
    console.log(response.statusCode);
    if (response.statusCode === 200) {
      response.on('data', (data) => {
        let movieData = JSON.parse(data);
        if(movieData.Response === 'True'){
          res.render('movie', {
            movieInfo: {
              movieName: movieData.Title,
              poster: movieData.Poster,
              year: movieData.Year,
              genre: movieData.Genre,
              director: movieData.Director,
              metascore: movieData.Metascore,
              imdb: movieData.imdbRating,
            }
          })
        }
        else{
          res.render('notFound');
        }
      })
    }
  })

})

app.post('/movie', (req, res) => {
  res.redirect('/');
})

app.get('/about', (req, res) => {
  res.render('about');
})

app.get('/movie', (req, res) => {
  res.render('movie', { movieName: "Deneme" });
})

app.listen(3000, () => {
  console.log("app is running on port 3000");
})