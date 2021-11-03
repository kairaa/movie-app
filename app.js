const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home');
})


app.post('/', (req, res) => {
  const movieName = req.body.movieName.split(' ').join('+');;
  const apiKey = 'cfd6f31c';
  let url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${movieName}`
  console.log(url);

  https.get(url, (response) => {
    const chunks = [];
    console.log(response.statusCode);
    if (response.statusCode === 200) {
      //https://stackoverflow.com/questions/62480360/error-syntaxerror-unexpected-end-of-json-input
      response.on('data', (chunk) => {
        chunks.push(chunk);
        // console.log(chunk);

        response.on('end', () =>{
          const data = Buffer.concat(chunks);
          var got = JSON.parse(data);

          if(got.Response === 'True'){
            res.render('movie', {
              movieInfo: {
                movieName: got.Title,
                poster: got.Poster,
                year: got.Year,
                genre: got.Genre,
                director: got.Director,
                metascore: got.Metascore,
                imdb: got.imdbRating,
                plot: got.Plot,
              }
            })
          }
          else{
            res.render('notFound');
          }
        })
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