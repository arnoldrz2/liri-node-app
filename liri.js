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

// Writes to the log.txt file
var writeToLog = function(data) {
  fs.appendFile("log.txt", "\r\n\r\n");

  fs.appendFile("log.txt", JSON.stringify(data), function(err) {
    if (err){
      return console.log(err);
    }

    console.log("log.txt updated");
  });
};


//Function for retrieving tweets
var getMyTweets = function(){
    console.log("Social Media Stuff Incoming!");
    //Access keys
    var client = new Twitter(keys);

    //Parameters for Twitter Function
    var params = {screen_name: "roland_arno", count: 20};

    client.get("statuses/user_timeline", params, function(error, tweets, response) {
      if (!error) {
        var data = [];

        for (var i = 0; i < tweets.length; i++) {
          data.push({
            created_at: tweets[i].created_at,
            text: tweets[i].text
          });
        }

        console.log(data);
        writeToLog(data);
      }
    });
};


//Function that retrieves artists name from spotify api and makes it a variable
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
      var data = [];

      for (var i = 0; i < songs.length; i++) {
        data.push({
            "artist(s)": songs[i].artists.map(getArtistNames),
            "song name: ": songs[i].name,
            "preview song: ": songs[i].preview_url,
            "album: ": songs[i].album.name
        });
      }

      console.log(data);
      writeToLog(data);
    });
};


// Function for running a Movie Search
var getMeMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Space Jam";
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);

      var data = {
        "Title: ": jsonData.Title,
        "Year: ": jsonData.Year,
        "Rated: ": jsonData.Rated,
        "IMDB Rating: ": jsonData.imdbRating,
        "Country: ": jsonData.Country,
        "Language: ": jsonData.Language,
        "Plot: ": jsonData.Plot,
        "Actors: ": jsonData.Actors,
        "Rotton Tomatoes URL: ": jsonData.tomatoURL
      };

      console.log(data);
      writeToLog(data);
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
