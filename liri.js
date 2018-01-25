// Add code the code required to import the keys.js file and store it in a variable.
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

// You should then be able to access your keys information like so
var spotify = new Spotify({
  id: "82a30fef265e4156a21186709dfaa927",
  secret: "cb131580e64e4bd499f22bd91aaaf43c"
});

//==============================================================================

//Get Tweet Function
var getMyTweets = function(){
    console.log("Social Media Stuff Incoming!");
    //Access keys
    var client = new Twitter(keys);

    //Parameters for Twitter Function
    var params = {screen_name: "cnn"
    };

    client.get("statuses/user_timeline", params, function(error, tweets, response) {
      if (!error) {
        for (var i = 0; i < tweets.length; i++) {
          console.log(tweets[i].created_at);
          console.log("");
          console.log(tweets[i].text);
        }
      }
    });
};


// Writes to the log.txt file
var getArtistNames = function(artist) {
  return artist.name;
};

// Function for running a Spotify search
var getMeSpotify = function(songName) {
  if (songName === undefined) {
    songName = "Funkytown";
  }

  spotify
  .search({ type: "track", query: songName},
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(getArtistNames));
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
      }
    }
  );
};


// Function for running a Movie Search
var getMeMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotton Tomatoes URL: " + jsonData.tomatoURL);
    }
  });
};


// Function for running a command based on text file
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    }
    else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};


//Function Switch
var pick = function(caseData, functionData) {
  //Switch cases for commands
  switch(caseData) {
      case "my-tweets":
        getMyTweets();
        break;

      case "spotify-this-song":
        getMeSpotify(functionData);
        break;

      case "movie-this":
        getMeMovie(functionData);
        break;

      case "do-what-it-says":
        doWhatItSays();
        break;
      default:
        console.log("LIRI doesn't know that");
  }
};

// Function which takes in command line arguments
var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);
