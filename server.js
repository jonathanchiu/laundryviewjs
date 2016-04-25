var express  = require('express');
var request  = require('request-promise');
var cheerio  = require('cheerio');
var app      = express();
var HOME_URL = "http://www.laundryview.com/lvs.php";
var ROOM_URL = "http://classic.laundryview.com/laundry_room.php?view=c&lr=ROOM_ID";

function getLaundryRooms() {
  return request(HOME_URL)
    .then(function(html) {

      var $     = cheerio.load(html);
      var rooms = {};
      var i     = 0;

      $('.a-room').each(function() {
        var room   = $(this);
        var roomId = room.attr('href').replace(/\D/g, '');

        rooms[roomId] = { location: room.text().trim() }
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
      var rooms = response;

      if (rooms[req.params.id]) {
        var roomName = rooms[req.params.id].location;
      }

      if (roomName) {
        request(ROOM_URL.replace('ROOM_ID', req.params.id))
          .then(function(html) {

            var $                = cheerio.load(html);
            // Returns an array of laundry machine id DOM elements
            var machineIds       = $('.desc');
            // Returns an array of laundry machine image DOM elements
            var machineTypes     = $('img', '.bgicon');
            // Returns an array of laundry machine status DOM elements
            var machineStatuses  = $('.stat');
            // LaundryView has a div containing info regarding machine availabilities
            var availabilities   = $('.monitor-total').text().match(/^\d+|\d+\b|\d+(?=\w)/g);
            var availableWashers = parseInt(availabilities[0], 10);
            var availableDryers  = parseInt(availabilities[2], 10);

            var statuses = {
              location: roomName,
              washers: 0,
              dryers: 0,
              total_machines: 0,
              available_washers: 0,
              available_dryers: 0,
              out_of_service: 0,
              machines: {}
            };

            // Determine number of washers, dryers, and out of service machines
            for (var i = 0; i < machineTypes.length; i++) {
              var mt = $(machineTypes.get(i)).attr('src');
              if (mt.indexOf('washer_unavailable') > -1 ||
                  mt.indexOf('dryer_unavailable') > -1) {
                statuses.out_of_service++;
              }
              else if (mt.indexOf('washer') > -1) {
                statuses.washers += 1;
              }
              else {
                statuses.dryers += 1;
              }
            }

            statuses.available_washers += availableWashers;
            statuses.available_dryers  += availableDryers;
            statuses.total_machines    += (statuses.washers + statuses.dryers);

            for (var i = 0; i < machineIds.length; i++) {
              var machineId     = $(machineIds.get(i)).text().trim();
              var machineStatus = $(machineStatuses.get(i)).text().trim();
              var isWasher      = $(machineTypes.get(i)).attr('src').indexOf('washer') > -1;
              var machineType   = isWasher ? 'washer' : 'dryer';

              statuses['machines'][machineId] = {
                type: machineType,
                status: machineStatus
              };
            }

            res.json(statuses);
          })
          // Something went wrong with the request to laundry room URL
          .catch(function(err) {
            res.send(err);
          });
      }
      else {
        res.status(404).send({ error: "Received an invalid laundry room id" });
      }
    })
    // Something went wrong with the request to LaundryView home page
    .catch(function(err) {
      res.send(err);
    });
});

app.listen('4000');
exports = module.exports = app;
