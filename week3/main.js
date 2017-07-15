const bodyParser    = require('body-parser')
const express       = require("express");
const app           = express();

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.listen(3000, function () {
  
});



app.get("/", function(req,res){
    res.send("This is David Teofilovic's API Project for CS496 Summer17")
});

var Boat         = require("./models/boat");
var Slip         = require("./models/slip");
var BoatBuilder  = require("./controllers/BoatBuilder");
var SlipBuilder  = require("./controllers/SlipBuilder");
var JSONAppender = require("./controllers/JSONAppender");
var JSONDeleter  = require("./controllers/JSONDeleter");
var JSONEditor   = require("./controllers/JSONEditor");
var JSONFetcher  = require("./controllers/JSONFetcher");


app.post("/Boats", function(req, res){
    // Get Variables
    var name_boat = req.body.name_boat;
    var type      = req.body.type;
    var length    = req.body.length;
    // Build a boat
    var builder     = new BoatBuilder(name_boat, type, length);
    var boat        = builder.get_boat(); 
    // Append boat to boats.json data
    var appender    = new JSONAppender("boats.json", boat);
    appender.append();
    // Send New Object with ID back to client
    res.send(JSON.stringify(boat));
});

app.post("/Slips", function(req,res){
    // Get Variables
    var number          = req.body.number;
    var arrival_date    = req.body.arrival_date;
    // Build a slip
    var builder = new SlipBuilder(number, arrival_date);
    // Get Slip Object
    var slip    = builder.get_slip();
    // Append slip to slips.json data
    var appender = new JSONAppender("slips.json", slip);
    appender.append();
    // Send new Slip with ID back to client
    res.send(JSON.stringify(slip));
});

app.delete("/Boats", function(req,res){
    // Get Variables
    var boat_id = req.body.id;
    // new JSONDeleter
    var deleter = new JSONDeleter("boats.json", boat_id);
    deleter.delete();
    res.status(200);
    res.send();
});

app.get("/Boat/:id", function(req,res){
    // Get Id
    var boat_id = req.params.id;
    // new JSONFetcher
    var fetcher = new JSONFetcher("boats.json");
    // Fetch single instance
    fetcher.single(boat_id)
        .then(function(boat_data){
            var boat = new Boat(boat_data.id, boat_data.name, boat_data.type, boat_data.length, boat_data.at_sea);
            res.status(200);
            res.send(boat.to_json());
        })
        .catch(function(err){
            console.log(err);
        });
});

app.get("/Slip/:id", function(req,res){
    // Get Id
    var slip_id = req.params.id;
    // new JSONFetcher
    var fetcher = new JSONFetcher("slips.json");
    // Fetch Single Instance
    fetcher.single(slip_id)
        .then(function(slip_data){
            var slip = new Slip(slip_data.id, slip_data.number, slip_data.current_boat, slip_data.arrival_date);
            res.status(200);
            res.send(slip.to_json());
        })
        .catch(function(err){
            console.log(err);
        });
});

app.get("/Boats", function(req,res){
    // new JSONFetcher
    var fetcher = new JSONFetcher("boats.json");
    // Fetch all instances
    fetcher.all()
        .then(function(boats_data){
            var boats = JSON.parse(boats_data);
            var boat_objs = [];
            for(var i in boats) {
                boat_objs.push(new Boat(boats[i].id, boats[i].name, boats[i].type, boats[i].length, boats[i].at_sea));
            } 
            res.status(200);
            res.send(JSON.stringify(boat_objs));
        });
});

app.get("/Slips", function(req,res){
    // new JSONFetcher
    var fetcher = new JSONFetcher("slips.json");
    // Fetch all instances
    fetcher.all()
        .then(function(slips_data){
            var slips = JSON.parse(slips_data);
            var slip_objs = [];
            for(var i in slips){
                slip_objs.push(new Slip(slips[i].id, slips[i].number, slips[i].current_boat, slips[i].arrival_date));
            }
            res.status(200);
            res.send(JSON.stringify(slip_objs));
        });
});

app.get("/Slip/:id/Boat", function(req,res){
    // Get id
    var id = req.params.id;
    // Get fetcher
    var slip_fetcher = new JSONFetcher("slips.json");
    var boat_fetcher = new JSONFetcher("boats.json");
    // Fetch Slip
    slip_fetcher.single(id)
        .then(function(slip_data){
            var slip = new Slip(slip_data.id, slip_data.number, slip_data.current_boat, slip_data.arrival_date);
            if(slip.id === null) {
                res.send("NULL");
            } else {
                // Fetch Boat
                boat_fetcher.single(slip.current_boat)
                    .then(function(data){
                        var boat = new Boat(data.id, data.name, data.type, data.length, data.at_sea);
                        res.status(200);
                        res.send(boat.to_json());
                    })
                    .catch(function(err){
                        console.log("ERROR: ", err);
                    });
            }
        })
        .catch(function(err){
            console.log(err);
        });
});

app.patch("/Boats", function(req,res){
    // Get variables
    var id = req.body.id;
    var property = req.body.property;
    var value    = req.body.value;

    var editor = new JSONEditor("boats.json");
    editor.change_field(id, property, value)
        .then(function(){
            res.status(204);
            res.send();
        })
        .catch(function(err){
            console.log("ERROR: ", err);
        });
});

app.patch("/Slips", function(req,res){
    // Get variables
    var id          = req.body.id;
    var property    = req.body.property;
    var value       = req.body.value;

    var editor = new JSONEditor("slips.json");
    editor.change_field(id, property, value)
        .then(function(){
            res.status(204);
            res.send();
        })
        .catch(function(err){
            console.log("ERROR: ", err);
        });
});

app.put("/Boats", function(req,res){
    // Get variables
    var id      = req.body.id;
    var name    = req.body.name;
    var type    = req.body.type;
    var length  = req.body.length;
    var at_sea  = req.body.at_sea;

    if(id == undefined || name == undefined || type == undefined || length == undefined || at_sea == undefined) {
        res.status(400);
        res.send();
        return;
    }

    var boat = new Boat(id, name, type, length, at_sea);
    
    var editor = new JSONEditor("boats.json");
    editor.change_resource(boat)
        .then(function(data){
            res.status(204);
            res.send();
        });
});

app.put("/Slips", function(req,res){
    // Get variables
    var id              = req.body.id;
    var number          = req.body.number;
    var current_boat    = req.body.current_boat;
    var arrival_date    = req.body.arrival_date;

    if(id == undefined || number == undefined || current_boat == undefined || arrival_date == undefined) {
        res.status(400);
        res.send();
        return;
    }

    var slip = new Slip(id, number, current_boat, arrival_date);

    var editor = new JSONEditor("slips.json");
    editor.change_resource(slip)
        .then(function(data){
            res.status(204);
            res.send();
        });
});
