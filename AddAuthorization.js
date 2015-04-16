/**
 * @module buzzAuthorization
 * @author AuthorizationB - Armand Pieterse
 * @version 0.2
 */

//TODO recreate class use template class provided





/**
 * Checks where a user is authorised to use a specified service on a specific buzzspace.
 * @param {ObjectID} buzzspaceID -  ID of the buzz space for which  a restriction is being added.
 * @param {Number} statusPoints - minimum status_value of a user, added to the restriction of the service.
 * @param {ObjectID} Role - The minimum role restriction to be added.
 * @param {ObjectID} ServiceID - The ID of the Service to add the restriction to.
 * @throws {Error} Could not connect to the database
 * @throws {Error} Restriction for the buzzSpace already exists
 */

exports.addAuthorizationRestrictions = function addAuthorizationRestrictions(buzzspaceID, statusPoints, Role, ServiceID)
{
    var mongoose = require("mongoose");
    //Connecting to the database
    function con(database) { // Connection helper function
        mongoose.connect(database);
        return mongoose.connection;
    }

    var dbAddress = "mongodb://d3user:DdJXhhsd2@proximus.modulusmongo.net:27017/purYv9ib";
    var db = con(dbAddress);

    if (db != null) //check if connection succeeded
    {
        var Roles = new mongoose.Schema({
            ID: Number,
            Name: String
        });

        var services = new mongoose.Schema({
            ID: String,
            details: String
        });

        var restrictions = new mongoose.Schema({
            ID: String,
            buzzspace_id: [mongoose.Schema.Types.ObjectID],
            servicesID: [mongoose.Schema.Types.ObjectID],
            minimumRole: [mongoose.Schema.Types.ObjectID],
            minimumStatusPoints: Number,
            deleted: Boolean
        });

        //compile the schema to allow objects to be made of it
        var Role = mongoose.model('Role', Roles);
        var Service = mongoose.model('Service', services);
        var Restriction = mongoose.model('Restriction', restrictions);

        if (/*Condition*/false) //Check if the
        {
            throw{
                name: "Name",
                message: "Message details",
                toString: function ()
                {
                    return this.name + ": " + this.message;
                }
            }
            //DO SOME MORE STUFF
            //general commenting
            helperFunction(/*parameter*/);
        }
        else // Add the restriction to the DB
        {
            //this id will be unique for each buzzSpace and Service
            var newID = buzzspaceID + ServiceID; //For now this will generate the id for restrictions...

            Restriction.find({'ID': newID}, function (err, docs) {
                if (docs.toString() == "") {
                    var rest = new Restriction({
                        'ID': newID,
                        'buzzspace_id': buzzspaceID,
                        'servicesID': ServiceID,
                        'minimumRole': Role,
                        'minimumStatusPoints': statusPoints,
                        'deleted': false
                    });
                    rest.save(function (err, t) {
                        if (err) return console.error(err)
                    });
                    console.log("inserted");
                }
                else //restriction already exists
                {
                    //Pre-conditon - authorization restriction for that role and buzzSpace don't exist.
                    throw{
                        name: "Restriction_Exists",
                        message: "The restriction for this service on the current buzz space already exists.",
                        toString: function ()
                        {
                            return this.name + ": " + this.message;
                        }
                    }


                }
            });
        }


    }
    else //throw connection error if it couldn't connect.
    {
        throw{
            name: "Connection_Error",
            message: "Could not connect to the database.",
            toString: function ()
            {
                return this.name + ": " + this.message;
            }
        }
    }

    //Don't know if this is still needed??
    exports.mongoose = mongoose;
    module.exports.restrict = Restriction;

}

//TODO Make a connection helper function and include it within the call of the AddAuthorization function
//TODO All code outside of main function should either be placed in helper function or main code


//testing to see if connection was successfull.
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
//TODO Use databasestuff schemas
//creating schema




//creating schema
//TODO Use databasestuff schema

//compile the schema to allow objects to be made of it


//creating schema

//compile the schema to allow objects to be made of it

//function to addAuthorizationRestricions
//TODO change parameters to buzzspaceName, statusPoints, role, objectName, objectMethod
//TODO remember if deleted there is a flag
function addAuthorizationRestrictions(buzzspaceID, statusPoints, Role, ServiceID) {
    //...Creating models and database schemas... (starts here)
    //TODO if ID in buzzspace schema is not updated to string let me know && use database stuff schemas


    //compile the schema to allow objects to be made of it


    /*Using a call back function so that this function
     doesn't go on ahead before it is authorized to do so...*/



    //TODO Check if buzzSpace exists, objectName and Method exists. Throw errors if they don't exist.
    //TODO Search database via buzzspaceName, objectName, objectMethod and throw relevant error
    //TODO Remember to check if the deleted field is true

}


exports.add = addAuthorizationRestrictions;




