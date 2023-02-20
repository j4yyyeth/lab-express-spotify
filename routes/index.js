var express = require('express');
var router = express.Router();


const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
  
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/artist-search', (req ,res) => {
  spotifyApi
  .searchArtists(req.query.artistName)
  .then(data => {
    res.render('artist-search-results', { artist: data.body.artists.items });
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

router.get('/artist/:artistId/albums', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    res.render('albums.hbs', { albums: data.body.items });
  })
  .catch(err => console.error('Error while fetching artist albums: ', err));
});

router.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      res.render('tracks', { track: data.body.items });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

module.exports = router;
