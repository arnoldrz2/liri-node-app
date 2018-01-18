// At the top of the liri.js file, add code to read and set any environment variables with the dotenv package:
require("dotenv").config();
// Add code the code required to import the keys.js file and store it in a variable.
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

// You should then be able to access your keys information like so
// var spotifyKey = new Spotify(keys.spotify);

// Make it so liri.js can take in one of the following commands:
console.log("To get started, please enter one of the following commands: 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'");

var command = process.argv[2];
var input = process.argv[3];

//Switch cases for commands
switch(command) {
    case "my-tweets":
      myTweets();
    break;

    case "spotify-this-song":
      spotifyThisSong();
    break;

    case "movie-this":
      movieThis();
    break;

    case "do-what-it-says":
      doWhatItSays();
    break;
}

//Get Tweet Function
function myTweets(){
    console.log("Social Media Stuff Incoming!");
    //Access keys
    var client = new Twitter(keys.twitter);

    //Parameters for Twitter Function
    var params = {screen_name: 'roland_arno',
                  count: 20};

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        console.log(tweets);
      }
    });
};
