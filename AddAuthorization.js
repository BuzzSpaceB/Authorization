/**
 * @module buzzAuthorization
 * @author AuthorizationB - Armand Pieterse
 * @version 0.2
 */

/**
 * Checks where a user is authorised to use a specified service on a specific buzzspace.
 * @param {ObjectID} buzzspaceID -  ID of the buzz space for which  a restriction is being added.
 * @param {Number} statusPoints - minimum status_value of a user, added to the restriction of the service.
 * @param {ObjectID} Role - The minimum role restriction to be added.
 * @param {ObjectID} ServiceID - The ID of the Service to add the restriction to.
 * @throws {Error} Could not connect to the database
 * @throws {Error} Restriction for the buzzSpace already exists
 * @throws {Error} BuzzSpace doesn't exist
 * @throws {Error} Service doesn't exist
 * @throws {Error} Role doesn't exist/is invalid
 * @throws {Error} Minimum StatusPoint is invalid
 */

//TODO Remember to check if the deleted field is true
exports.addAuthorizationRestrictions = function addAuthorizationRestrictions(buzzspaceID, ServiceID, role, statusPoints)
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

        BuzzSpace.find({'module_id': buzzspaceID}, function (err, docs) {
            if (docs.toString() == "") //Check if the Service exists
            {
                throw{
                    name: "BuzzSpace doesn't exist",
                    message: "The selected buzzSpace doesn't exist",
                    toString: function () {
                        return this.name + ": " + this.message;
                    }

                }

            }
        });

        Services.find({'service_id': ServiceID}, function (err, docs) {
            if (docs.toString() == "") //Check if the Service exists
            {
                throw{
                    name: "Service Non-existant",
                    message: "The service specified doesn't exist",
                    toString: function () {
                        return this.name + ": " + this.message;
                    }
                }

            }
        });

        Role.find({'role_id': role.role_id}, function (err, docs) {
            if (docs.toString() == "") //Check if the Service exists
            {
                throw{
                    name: "Invalid Role",
                    message: "The selected role doesn't exist",
                    toString: function () {
                        return this.name + ": " + this.message;
                    }
                }

            }
        });

        if (statusPoints < 0) //Check if the minimum statuspoints is valid
        {
            throw{
                name: "StatusPoints Invalid",
                message: "The minimus status points are less than 0",
                toString: function () {
                    return this.name + ": " + this.message;
                }
            }

        }



        //this id will be unique for each buzzSpace and Service
        var newID = buzzspaceID + ServiceID; //For now this will generate the id for restrictions...

        ServiceRestriction.find({'restriction_id': newID}, function (err, docs) { //Check if the restriction exists
            if (docs.toString() == "") {
                var rest = new ServiceRestriction({
                    'restriction_id': newID,
                    'buzz_space_id': buzzspaceID,
                    'service_id': ServiceID,
                    'minimum_role': role.role_id,
                    'minimum_status_points': statusPoints,
                    'deleted': false
                });
                rest.save(function (err, t) {
                    if (err) return console.error(err)
                });
                console.log("inserted");

            }
            else //restriction already exists
            {

                if (docs.deleted == true ) // change to false
                {
                    var query = { restriction_id: restrictionID };
                    var options = { multi: false };
                    var update =  { deleted: false };
                    Restriction.update(query, { $set: update}, options , callback);
                    function callback (error, numAffected){console.log("Set to true")}
                }
                else
                {
                    //Pre-conditon - authorization restriction for that role and buzzSpace don't exist.
                    throw{
                        name: "Restriction_Exists",
                        message: "The restriction for this service on the current buzz space already exists.",
                        toString: function () {
                            return this.name + ": " + this.message;
                        }
                    }
                }


            }

        });



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


    mongoose.disconnect();
}

//function to addAuthorizationRestricions





    //compile the schema to allow objects to be made of it


    /*Using a call back function so that this function
     doesn't go on ahead before it is authorized to do so...*/













