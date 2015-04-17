/**
 * @module buzzAuthorisation
 * @author AuthorisationB - Kale-ab Tessera, Armand Pieterse
 * @version 0.2
 */

/**
 * Updates the StatusPoints and the role for a specific restriction.
 * @param {String} authorizedID -  ID of the authorization restriction being altered.
 * @param {String} role - role of the authorization restriction being altered.
 * @param {String} statusPoints - statusPoints of the authorization restriction being altered.
 * @throws {String} Role was not found in the database
 * @throws {String} StatusPoints was not a integer.
 * @throws {String} Could not establish a connection to the database
 */


var authID;
var rol;
var statPoints;

// Defining the class - Getters and Setters
function setNewParameters(authorizedID, role, statusPoints)
{
    this.authID = authorizedID;
    this.rol = role;
    this.statPoints = statusPoints;
}

function getAuthorizedID()
{
    return authID;
};

function getRole()
{
    return rol;
};

function getStatusPoints()
{
    return statPoints;
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

function checkValues(rle,stat){
    var validValues = false;
    var RoleSchema = mongoose.Schema({
        role_id         : String,           /* The id of the role */
        name            : String,            /* The name of the role, as from LDAP */
        role_weight     : Number            /* The weighting of the role, this is used for comparison of the roles*/
    });
    var Role = mongoose.model('roles', RoleSchema);
    //Checking if the role Exists
    Role.findOne({'name': rle}, function (err, docs){

        if (docs.toString() == "")
        {

            throw{
                name: "Role Error",
                message: "A role with that name was not found in the Database.",
                toString:    function(){return this.name + ": " + this.message;}
            }
        }
        else {
            //The ROle is valid, so we check if the status is valid
            if (stat === parseInt(stat, 10))
                validValues = true;
            else {
                throw{
                    name: "Status Error",
                    message: "A status values was not an integer.",
                    toString: function () {
                        return this.name + ": " + this.message;
                    }
                }
            }
        }
    });

    return validValues;

}

//Actual Function - update Authorization

function updateAuthorization(aID, rl, sP){
    mongoose = require("mongoose");
    mongoose.connect("mongodb://d3user:DdJXhhsd2@proximus.modulusmongo.net:27017/purYv9ib");
    var connect =  checkConnection();

    //Testing Purposes - Can be removed later.

    var ServiceRestrictionSchema = new mongoose.Schema(
        {
            restriction_id: String,
            buzz_space_id: [mongoose.Schema.Types.ObjectID],
            service_id: [mongoose.Schema.Types.ObjectID],
            minimum_role: [mongoose.Schema.Types.ObjectID],
            minimum_status_points: Number,
            deleted: Boolean
        });



    if (connect == true) {
        setNewParameters(aID, rl, sP);

        var restrictions = mongoose.model('servicerestrictions', ServiceRestrictionSchema);
        //Looks for a BuzzSpace with the matching ID AND deleted = false
        //Find didn't work with the save function. So it only affects the first found one.
        //Alt try removing save and use find.
        restrictions.findOne({'buzz_space_id': aID,'deleted':false}, function (err, docs)
        {
            //if (err) return console.error(err);
            if (docs.toString() == "")
            {
                throw{
                    name: "BuzzSpace Error",
                    message: "BuzzSpace with that ID was not found or it was deleted.",
                    toString:    function(){return this.name + ": " + this.message;}
                }

            }
            else{
                    //We know the BuzzSpace Exists and that it is not deleted.

                    var isValid = checkValues(rl,sP);
                    if(isValid == true) {
                        docs.minimum_role = rl;
                        docs.minimum_status_points = sP;
                        docs.save();
                    }
                    //console.log("updated");

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

exports.updateAuthor = updateAuthorization;
var db;
var mongoose;