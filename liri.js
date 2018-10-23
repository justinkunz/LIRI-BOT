require("dotenv").config();
var request = require('request');
var Spotify = require('node-spotify-api')
var fs = require("fs");

spotifyID = process.env.SPOTIFY_ID
spotifySec = process.env.SPOTIFY_SECRET

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var commandLine = process.argv[2]
var commandData = process.argv[3]
callCommand()

function callCommand() {
    if (commandLine === 'spotify-this-song') {
        spotSearch(commandData)
    }
    if (commandLine === 'concert-this') {
        concert(commandData)
    }
    if (commandLine === 'movie-this') {
        movie(commandData)
    }
    if (commandLine === 'do-what-it-says') {
        doTxt()
    }
}
function spotSearch(song) {
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log('Song: ' + data.tracks.items[0].name)
        console.log('Album: ' + data.tracks.items[0].album.name)
        console.log('Artist: ' + data.tracks.items[0].artists[0].name)
        console.log('Preview Link: ' + data.tracks.items[0].external_urls.spotify)

        logData(data.tracks.items[0].name)
        logData(data.tracks.items[0].album.name)
        logData(data.tracks.items[0].artists[0].name)
        logData(data.tracks.items[0].external_urls.spotify)


    });
}

function concert(artist) {
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body)
            for (i = 0; i < info.length; i++) {
                console.log('-------------------------------------------')
                console.log('Venue: ' + info[i].venue.name)
                console.log('Location: ' + info[i].venue.city + ', ' + info[i].venue.region)
                eventDate = new Date(info[i].datetime)
                console.log('Date: ' + eventDate.toLocaleDateString('en-US'))

                logData('Venue: ' + info[i].venue.name)
                logData('Location: ' + info[i].venue.city + ', ' + info[i].venue.region)
                logData('Date: ' + eventDate.toLocaleDateString('en-US'))
            }
        }
    })
}
function movie(title) {
    if (title == null) {
        title = 'Mr.Nobody'
    }
    request("https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body)
            console.log('Title: ' + info.Title)
            console.log('Year: ' + info.Year)
            console.log('Country: ' + info.Country)
            console.log('IMDB Rating: ' + info.Ratings[0].Value)
            console.log('Rotten Tomatoes: ' + info.Ratings[1].Value)
            console.log('Language: ' + info.Language)
            console.log('Actors: ' + info.Actors)
            console.log('Plot: ' + info.Plot)

            logData('Title: ' + info.Title)
            logData('Year: ' + info.Year)
            logData('Country: ' + info.Country)
            logData('IMDB Rating: ' + info.Ratings[0].Value)
            logData('Rotten Tomatoes: ' + info.Ratings[1].Value)
            logData('Country: ' + info.Country)
            logData('Language: ' + info.Language)
            logData('Actors: ' + info.Actors)
            logData('Plot: ' + info.Plot)
        }
    })
}

function doTxt() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var commArr = data.split(',')
        commandLine = commArr[0]
        commandData = commArr[1]
        callCommand()

    })
}
function logData(data) {
    fs.appendFile("log.txt", data + " -- ", function (err) {
        if (err) {
            console.log(err);
        }
    });

}