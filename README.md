# laundryviewjs
A crude and very barebones Node RESTful API for [LaundryView](http://www.laundryview.com).

This should (in theory) work across all university campuses that utilize LaundryView.

## Why?
* LaundryView does not provide an API of any sort
* I wanted to dabble more with Node and create an API with it
* I wanted to provide a somewhat useful service (or at least that's my hope) for other developers

## Dependencies
* express
* cheerio
* request

## Setup
This assumes you are connected to a campus/organization network that utilizes LaundryView as a service. If not, all that will be returned will be dummy data provided by LaundryView.

    $ git clone https://github.com/jonathanchiu/laundryviewjs.git
    $ cd ./laundryviewjs
    $ npm install
    $ node server.js

## Routes
The actual data in the sample responses are not necessarily accurate (e.g. Speare Hall East obviously has more than 4 machines). The sample responses are meant to highlight the structure.

`GET /laundry`

Returns a JSON response of all laundry rooms on campus, mapping the laundry room's ID to its name

#### Sample Response
```json
{
  "134365": "144 HEMENWAY ST",
  "134366": "337 HUNTINGTON AVE",
  "134367": "319 HUNTINGTON AVE"
}
```

`GET /laundry/:id`

Returns a JSON response containing the statuses of all laundry machines in a particular laundry room, determined by the laundry room's id given as a route parameter. Each laundry machine has an id key, a type (one of washer or dryer), and a status (one of available, estimated time remaining, or out of service).

#### Sample Response
```json
{
  "location": "SPEARE HALL EAST",
  "washers": 2,
  "dryers": 2,
  "total_machines": 4,
  "available_washers": 0,
  "available_dryers": 1,
  "out_of_service": 1,
  "machines": {
    "10": {
      "type": "dryer",
      "status": "cycle ended 5 minutes ago"
    },
    "11": {
      "type": "washer",
      "status": "est. time remaining 39 min"
    },
    "12": {
      "type": "washer",
      "status": "est. time remaining 40 min"
    },
    "13": {
      "type": "dryer",
      "status": "out of service"
    }
  }
}
```

## Info
[LaundryView](http://www.laundryview.com) is an Internet application that allows you to monitor the status of washers and dryers in connected laundry rooms through a Web browser. LaundryView was developed in response to requests for greater control over laundry activities. Since many people tend to do their laundry during similar time periods, it results in busy laundry rooms. LaundryView's mission is to help you save time by providing information about the current state of laundry room equipment wherever you have access to a browser or e-mail messages.

## TODO
* Better error handling
* Eventually turn this into or create a API wrapper for this
* Implement more features
  * Get weekly usage statistics for a specific laundry room?

## License
MIT
