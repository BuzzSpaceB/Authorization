/**
 * @module buzzAuthorisation
 * @author AuthorisationB - Kale-ab Tessera
 * @version 0.2
 */

/**
 * This function returns all the restrictions linked to BuzzSpace, in the form of a JSON string.
 * @param {String} buzzSpaceID -  ID of the BuzzSpace chosen.
 * @throws {String} BuzzSpace wasn't found.
 * @throws {String} Could not establish a connection to the database
 * @return {JSON String} Returns a JSON string in the format "{_v: 0, restriction_id: [''],
            buzz_space_id: [''],
            service_id: [''],
            minimum_role: [''],
            minimum_status_points: int,
            deleted: true/false ", end of first restriction ... ... ... }"
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
//TODO throw errors for errors(Don't console log them)
//TODO check if objects all exists && check if restriction exists. Throw relevant errors.
//TODO use databasestuff schemas
//TODO use helper functions where possible(Simpilify reading of code);
//TODO remember if deleted there is a flag.
function getAut(bID){
    //TODO create connect helper function
    mongoose = require("mongoose");
    mongoose.connect("mongodb://d3user:DdJXhhsd2@proximus.modulusmongo.net:27017/purYv9ib");
    var connect =  checkConnection();
    //TODO use database stuff for schemas
    //Testing Purposes - Can be removed later.
    //var restrictions = new mongoose.Schema(
    //    {
    //        ID: String,
    //        buzzspace_id: [mongoose.Schema.Types.ObjectID],
    //        servicesID: [mongoose.Schema.Types.ObjectID],
    //        minimumRole: [mongoose.Schema.Types.ObjectID],
    //        minimumStatusPoints: Number,
    //        deleted: Boolean
    //    });
    //console.log("connect");

    var ServiceRestrictionSchema = new mongoose.Schema(
        {
            restriction_id: String,
            buzz_space_id: [mongoose.Schema.Types.ObjectID],
            service_id: [mongoose.Schema.Types.ObjectID],
            minimum_role: [mongoose.Schema.Types.ObjectID],
            minimum_status_points: Number,
            deleted: Boolean
        });
    //TODO check if database exists
    if (connect == true) {
        var restrictions = mongoose.model('servicerestrictions', ServiceRestrictionSchema);
        setID(bID);

        //var Restriction2 = mongoose.model('Restriction', restrictions);
        //Looks for a BuzzSpace with the matching ID AND deleted = false
        restrictions.find({'buzz_space_id': bID,'deleted':false}, function (err, docs)
        {
            //if (err) return console.error(err);
            //TODO throw an error instead of console logging
            if (docs.toString() == "")
            {
                throw{
                    name: "BuzzSpace Error",
                    message: "BuzzSpace with that ID was not found or it was deleted.",
                    toString:    function(){return this.name + ": " + this.message;}
                }
                return null;
            }
            else{

                var retJson = docs.toString();
                console.log(retJson);
                return retJson;
            }

        });
        mongoose.disconnect();
    }
    else {
        throw{
            name: "Connection Error",
            message: "Could not establish a connection to the database.",
            toString:    function(){return this.name + ": " + this.message;}
        }
    }
}

exports.getAutt = getAut;
var db;
var mongoose;