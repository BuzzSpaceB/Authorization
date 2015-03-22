//Connecting to the database
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');

//testing to see if connection was successfull.
 var db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));

//creating schema
var Roles = new mongoose.Schema({
    ID: Number,
    Name:String
})

//compile the schema to allow objects to be made of it
var Role = mongoose.model('Role', Roles);

//creating new role
var admin = new Role({ID : 1, Name : 'administrator'});

//persisting role to database
admin.save(function (err, fluffy) {
    if (err) console.log(err)});

//creating schema
var restrictions = new mongoose.Schema({
    id: String,
    buzzSpace: [BuzzSpaces],
    servicesID: [services],
    minimumRole: [Roles],
    minimumStatusPoints: Number
})

//compile the schema to allow objects to be made of it
var Restriction = mongoose.model('Restriction', restrictions);

var restrict = new Restriction({id:"1",buzzSpace:"COS301",servicesID:"addAuthorizationRestrictions",
    minimumRole:admin,minimumStatusPoints:10});
restrict.save(function (err, t) {
    if (err) return console.error(err)});

//creating schema
var services = new mongoose.Schema({
    ID: String,
    details: String
})
module.exports.restrict = Restriction;
//compile the schema to allow objects to be made of it
var Service = mongoose.model('Service', services);

//creating schema
var BuzzSpaces = new mongoose.Schema ({
    id: String,
    name: String,
    code:  String
})

//compile the schema to allow objects to be made of it
var BuzzSpace = mongoose.model('BuzzSpace', BuzzSpaces);

Restriction.findOne({ 'id': "1" }, function (err, docs) {
    if (err) console.log("Error: " + err);
    else
    {

    }
});
var res = Restriction.findOne().find({minimumStatusPoints: 10})

//console.log(res.createRangeCollection);

console.log("Success");//outputs to terminal if no exceptions were thrown
//mongoose.disconnect();


