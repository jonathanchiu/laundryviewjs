var express  = require('express');
var request  = require('request-promise');
var cheerio  = require('cheerio');
var app      = express();
var HOME_URL = "http://www.laundryview.com/lvs.php";
var ROOM_URL = "http://classic.laundryview.com/laundry_room.php?view=c&lr=ROOM_ID";

function getLaundryRooms() {
  return request(HOME_URL)
    .then(function(html) {
      // Utilize cheerio to 'jQuerify' the returned HTML
      var $     = cheerio.load(html);
      var rooms = {};
      var i     = 0;

      // Generate a Javascript object mapping laundry room id to its name
      $('.a-room').each(function() {
        var room = $(this);

        // Grab the laundry room's ID from each room's URL
        var roomId    = room.attr('href').replace(/\D/g, '');
        rooms[roomId] = room.text().trim();
        i++;
      });

      return rooms;
    })
    .catch(function(err) {
      return err;
    });
}

app.get('/laundry', function(req, res) {
  getLaundryRooms()
    .then(function(response) {
      res.json(response);
    })
    .catch(function(err) {
      res.send(err);
    });
});

app.get('/laundry/:id', function(req, res) {
  getLaundryRooms()
    .then(function(response) {
      var rooms    = response;
      var roomName = rooms[req.params.id];

      if (roomName) {
        request(ROOM_URL.replace('ROOM_ID', req.params.id))
          .then(function(html) {

            var $              = cheerio.load(html);
            var statuses       = {}
            statuses[roomName] = {};

            // Returns an array of laundry machine id DOM elements
            var machineIds      = $('.desc');
            // Returns an array of laundry machine image DOM elements
            var machineTypes    = $('img', '.bgicon');
            // Returns an array of laundry machine status DOM elements
            var machineStatuses = $('.stat');

            for (var i = 0; i < machineIds.length; i++) {
              // Indexing a jQuery object returns the actual DOM element so wrap
              // the result with another jQuery selector for convenience's sake
              var machineId     = $(machineIds.get(i)).text().trim();
              var machineStatus = $(machineStatuses.get(i)).text().trim();
              var machineType   = $(machineTypes.get(i)).attr('src').indexOf('washer') > -1 ? 'washer' : 'dryer';

              statuses[roomName][machineId] = {
                type: machineType,
                status: machineStatus
              };
            }

            res.json(statuses);
          })
          .catch(function(err) {
            res.send(err);
          });
      }
    })
    .catch(function(err) {
      res.send(err);
    });
});

app.listen('4000');
exports = module.exports = app;
