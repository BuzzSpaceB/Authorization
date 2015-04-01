/**
 * Created by Kale-ab on 2015-04-01.
 */

    //Connecting to the database
//var mongoose = require("mongoose");
//mongoose.connect('mongodb://localhost/BuzzDB');

// Defining the class
function getAuthorization(buzzSpaceID)
{
//Variables
    this.buzzID = buzzSpaceID;
}

module.exports.getAuthorization = getAuthorization;

//Getters and Setters
function getID()
{
    return this.buzzID;
};

function setID(buzzSpaceID)
{
    this.buzzID = buzzSpaceID;
};

function checkConnection(){
   // var mongoose = require("mongoose");
   // mongoose.connect('mongodb://localhost/test');
    var connected = false;
    var db = mongoose.connection;
    if (db != null)
    {
        connected = true;
    }

    return connected;
}
//Actual Function
function getAut(bID){
    mongoose = require("mongoose");
    mongoose.connect('mongodb://localhost/test');
    var connect =  checkConnection();

    //Testing Purposes
    var restrictions = new mongoose.Schema(
        {
            ID: String,
            buzzspace_id: [mongoose.Schema.Types.ObjectID],
            servicesID: [mongoose.Schema.Types.ObjectID],
            minimumRole: [mongoose.Schema.Types.ObjectID],
            minimumStatusPoints: Number,
            deleted: Boolean
        });
    //console.log("connect");
    if (connect == true) {
        setID(bID);

        var Restriction = mongoose.model('Restriction', restrictions);
        Restriction.find({'buzzspace_id': bID}, function (err, docs)
        {
            if (err) return console.error(err);
            if (docs.toString() == "")
            {
                console.log("A buzzSpace with that Specified ID doesnt exist.");
            }
            else{

                console.log("hello");
                console.log(docs.toString());
            }

        });






    }
}

exports.getAutt = getAut;
var db;
var mongoose;