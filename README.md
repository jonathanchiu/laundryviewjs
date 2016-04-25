# laundryviewjs
A crude and very barebones Node RESTful API for LaundryView

## Setup Notes
This assumes you are connected to a campus/organization network that utilizes LaundryView as a service. If not, all that will be returned will be dummy data provided by LaundryView.

    $ git clone https://github.com/jonathanchiu/laundryviewjs.git
    $ cd ./laundryviewjs
    $ npm install
    $ node server.js

## Routes
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
  "144 HEMENWAY ST": {
    "1": {
      "type": "dryer",
      "status": "available"
    },
    "2": {
      "type": "washer",
      "status": "available"
    },
    "3": {
      "type": "dryer",
      "status": "out of service"
    },
    "4": {
      "type": "washer",
      "status": "est. time remaining 33 min"
    }
  }
}
```

## License
MIT
