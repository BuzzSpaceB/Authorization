/**
 * Created by Kale-ab on 2015-04-01.
 */



// Defining the class
function getAuthorization(buzzSpaceID)
{

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

//Function to check the connection - Can be removed later.
function checkConnection(){
    var connected = false;
    var db = mongoose.connection;
    if (db != null)
    {
        connected = true;
    }

    return connected;
}

//Actual Function - get all the restrictions for a specific BuzzSpace.
function getAut(bID){
    mongoose = require("mongoose");
    mongoose.connect("mongodb://d3user:DdJXhhsd2@proximus.modulusmongo.net:27017/purYv9ib");
    var connect =  checkConnection();

    //Testing Purposes - Can be removed later.
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

        var Restriction2 = mongoose.model('Restriction', restrictions);
        //Looks for a BuzzSpace with the matching ID AND deleted = false
        Restriction2.find({'buzzspace_id': bID,'deleted':false}, function (err, docs)
        {
            //if (err) return console.error(err);
            if (docs.toString() == "")
            {
                console.log("A buzzSpace with that Specified ID doesnt exist.");
            }
            else{

                var retJson = docs.toString();
                console.log(retJson);
                return retJson;
            }

        });
    }
    else {
        console.log("Error connection failed.");
    }
}

exports.getAutt = getAut;
var db;
var mongoose;