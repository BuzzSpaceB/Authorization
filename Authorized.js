var mongoose = require("mongoose");


///////////////////////////// begin schema  /////////////////////////////////////////
var RoleSchema = mongoose.Schema({
    role_id         : String,           /* The id of the role */
    name            : String,           /* The name of the role, as from LDAP */
    role_weight     : Number            /* The weighting of the role, this is used for comparison of the roles*/
});

var Role = mongoose.model("roles", RoleSchema);
exports.Role = Role;

var ServiceRestrictionSchema = mongoose.Schema({
    restriction_id              : String, /*buzz_id + service_id */
    buzz_space_id               : String,
    service_id                  : mongoose.Schema.ObjectId,
    minimum_role                : String,
    minimum_status_points       : Number,
    deleted                     : Boolean
});

var ServiceRestriction = mongoose.model('servicerestrictions', ServiceRestrictionSchema);

var ServiceSchema = mongoose.Schema({
    service_id                  : String,
    service_name                : String, /*Fully qualified service name */
    method_name                 : String,
    deleted                     : Boolean
});

Services = mongoose.model('services', ServiceSchema);

var SpaceSchema = mongoose.Schema({
    module_id           : String,
    registered_users    : [{ user_id: String }],
    academic_year       : String,
    is_open           	: Boolean,
    root_thread_id		: String,
    administrators		: [{ user_id: String}]
});

var BuzzSpace = mongoose.model("spaces", SpaceSchema);

var ModuleSchema = mongoose.Schema({
    module_id           : String,           /* The id of the module */
    name                : String,           /* The full name of the module */
    code                : String            /* The module code */
});

var Module = mongoose.model("modules", ModuleSchema);

var UserSchema = mongoose.Schema({
	user_id             : String,           /* PK, this is the user_id as in LDAP i.e student number */
    username            : String,           /* The user's preferred username, like first name */
    roles               : [{role_name : [String], module: [String]}],      /* Array of Roles & modules of the user as from LDAP */
    modules      		: [String],          /* Array of Modules that is active for the user */
	post_count			: Number,
	status_value		: Number, 			 /* The status of the user as calculated by a status calculator */
	profile_pic		    : String 			 /* The status of the user as calculated by a status calculator */
});

UserSchema.methods.validPassword = function(password) {
    console.log("Validating password : " + password);
	//Todo: Get password from LDAP and compare with passed variable.
	// e.g var ldapPWD = ldap.getPassword(this.user_id);
    return password == "password";
};

var User = mongoose.model('users', UserSchema);

////////////////////////////// End Schema //////////////////////////////////////
/**
 * @module buzzAuthorisation
 * @author AuthorisationB - Sphelele Malo
 * @version 0.2
 */

/**
 * Checks whether a user is authorised to use a specified service on a specific buzzspace.
 * @param {String} authorizedID -  id of the restriction object in the database
 * @param {String} role - role userID - ID of the user requesting to use the service
 * @param {Number} statusPoints - status_value of the user requesting to use the service
 * @throws {String} Object of a certain type are not found in the database
 * @throws {String} Could not establish a connection to the database
 * @throws {String} User unauthorised to utilise service11
 */
exports.isAuthorized = function isAuthorized(authorizedID, role, statusPoints)
{

    mongoose.connect("mongodb://d3user:DdJXhhsd2@proximus.modulusmongo.net:27017/purYv9ib");
    var db = null;
    db = mongoose.connection;

    if (db != null)
    {
        //checking the validity of the provided status points
        if (statusPoints < 0)
        {
            throw{
                name: "Error: ",
                message: 'Status Points provided are invalid',
                toString:    function(){return this.name + ": " + this.message;}
            }
        }
        else
        {
            //locating role object in database
            Role.findOne({role_id: role}, function(err, _rol){

                if (err)
                {
                    throw{
                        name: "Unauthorized User: ",
                        message: err,
                        toString:    function(){return this.name + ": " + this.message;}
                    }
                }
                else if (_rol == null)
                {
                    throw{
                        name: "Object not found: ",
                        message: 'Specified Role does not exist in database',
                        toString:    function(){return this.name + ": " + this.message;}
                    }
                }
                else
                {
                    console.log(_rol.role_id);
                    //locating restriction object in database
                    ServiceRestriction.findOne({restriction_id: authorizedID}, function(err, rest)
                    {
                        if (err)
                        {
                            console.log(rest);
                            throw{
                                name: "Error",
                                message: err,
                                toString:    function(){return this.name + ": " + this.message;}
                            }
                        }

                        else if (rest == null)
                        {
                            return true;
                        }
                        else
                        {
                            Role.findOne({role_id :rest.minimum_role}, function(err, _role)
                            {
                                if (err)
                                {
                                    throw{
                                        name: "Error",
                                        message: err,
                                        toString:    function(){return this.name + ": " + this.message;}
                                    }
                                }

                                else if (_role == null)
                                {
                                    throw{
                                        name: "Object Not Found",
                                        message: 'Could not locate role in database',
                                        toString:    function(){return this.name + ": " + this.message;}
                                    }
                                }

                                else
                                {
                                    //switch statement comparing restriction minimum role to the user requesting the service's role
                                    switch (_role)
                                    {
                                        case 'lecturer':
                                            if (role == 'lecturer')
                                            {
                                                if (rest.minimum_status_points > statusPoints)
                                                {
                                                    throw{
                                                        name: "Unauthorized User: ",
                                                        message: 'User is unauthorized to use this service',
                                                        toString:    function(){return this.name + ": " + this.message;}
                                                    }
                                                }
                                                else
                                                {
                                                    return true;
                                                }
                                            }
                                            else
                                            {
                                                throw{
                                                    name: "Unauthorized User: ",
                                                    message: 'User is unauthorized to use this service',
                                                    toString:    function(){return this.name + ": " + this.message;}
                                                }
                                            }
                                            break;
                                        case 'teachingAssistant':
                                            if (role == 'student' || role == 'tutor')
                                            {
                                                throw{
                                                    name: "Unauthorized User: ",
                                                    message: 'User is unauthorized to use this service',
                                                    toString:    function(){return this.name + ": " + this.message;}
                                                }
                                            }
                                            else if (role == 'teachingAssistant')
                                            {
                                                if (rest.minimum_status_points > statusPoints)
                                                {
                                                    throw{
                                                        name: "Unauthorized User: ",
                                                        message: 'User is unauthorized to use this service',
                                                        toString:    function(){return this.name + ": " + this.message;}
                                                    }
                                                }
                                                else
                                                    return true;
                                            }
                                            else
                                                return true;
                                            break;
                                        case 'tutor':
                                            if (role == 'student')
                                            {
                                                throw{
                                                    name: "Unauthorized User: ",
                                                    message: 'User is unauthorized to use this service',
                                                    toString:    function(){return this.name + ": " + this.message;}
                                                }
                                            }
                                            else if (role == 'tutor')
                                            {
                                                if (rest.minimum_status_points > statusPoints)
                                                {
                                                    throw{
                                                        name: "Unauthorized User: ",
                                                        message: 'User is unauthorized to use this service',
                                                        toString:    function(){return this.name + ": " + this.message;}
                                                    }
                                                }
                                                else
                                                {
                                                    return true;
                                                }
                                            }
                                            else
                                            {
                                                return true;
                                            }
                                            break;
                                        case 'student':
                                            if (role == 'student')
                                            {
                                                if (rest.minimum_status_points > statusPoints)
                                                {
                                                    throw{
                                                        name: "Unauthorized User: ",
                                                        message: 'User is unauthorized to use this service',
                                                        toString:    function(){return this.name + ": " + this.message;}
                                                    }
                                                }
                                                else
                                                {
                                                    return true;
                                                }
                                            }
                                            else
                                            {
                                                return true;
                                            }
                                            break;
                                        default:
                                            throw{
                                                name: "Unauthorized User: ",
                                                message: 'User is unauthorized to use this service',
                                                toString:    function(){return this.name + ": " + this.message;}
                                            }
                                            break;
                                    }
                                }
                            });

                        }
                    });
                }

            });
        }
    }

};


////////////////////////////////////// AddAuthorization ////////////////////////////////////////////

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
                //function pretests()//this function tests for the 4 other prerequisites that needs to be met.
                //{
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
                            return false;
                        }

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
                                return false;
                            }

                            Role.find({'role_id': role}, function (err, docs) {
                                if (docs.toString() == "") //Check if the Service exists
                                {
                                    //console.log(role);
                                    throw{
                                        name: "Invalid Role",
                                        message: "The selected role doesn't exist",
                                        toString: function () {
                                            return this.name + ": " + this.message;
                                        }
                                    }
                                    return false;
                                }

                                if (statusPoints < 0) //Check if the minimum statuspoints is valid
                                {
                                    throw{
                                        name: "StatusPoints Invalid",
                                        message: "The minimus status points are less than 0",
                                        toString: function () {
                                            return this.name + ": " + this.message;
                                        }
                                    }
                                    return false;
                                }
                                else {
                                    continueOn();
                                }

                            });

                        });

                    });


                //}

            function continueOn()
            {
                //this id will be unique for each buzzSpace and Service
                var newID = buzzspaceID + ServiceID; //For now this will generate the id for restrictions...

                ServiceRestriction.find({'restriction_id': newID}, function (err, docs) { //Check if the restriction exists
                    if (docs.toString() == "") {
                        var rest = new ServiceRestriction({
                            'restriction_id': newID,
                            'buzz_space_id': buzzspaceID,
                            'service_id': ServiceID,
                            'minimum_role': role,
                            'minimum_status_points': statusPoints,
                            'deleted': false
                        });
                        rest.save(function (err, t) {
                            if (err) return console.error(err)
                            console.log("inserted");
                        });


                    }
                    else //restriction already exists
                    {

                        if (docs.deleted == true) // change to false
                        {
                            var query = {restriction_id: restrictionID};
                            var options = {multi: false};
                            var update = {deleted: false};
                            Restriction.update(query, {$set: update}, options, callback);
                            function callback(error, numAffected) {
                                console.log("Set to true")
                            }
                        }
                        else {
                            //Pre-conditon - authorization restriction for that role and buzzSpace don't exist.
                            throw{
                                name: "Restriction_Exists",
                                message: "The restriction for this service on the current buzz space already exists.",
                                toString: function () {
                                    return this.name + ": " + this.message;
                                }
                            }
                            return;
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
                toString: function () {
                    return this.name + ": " + this.message;
                }
            }
        }

}

//exports.addAuthorizationRestrictions = addAuthorizationRestrictions;

//////////////////////////////////////////// removeAuthorisation ///////////////////////////////////////

/**
 * @module buzzAuthorisation
 * @author AuthorisationB - Jessica Lessev
 * @version 0.2
 */

/**
 * Removes a users ability to use a specific service by setting a deleted flag to false.
 * @param {String} buzzspaceName -  name of the buzz space for which Authorisation is being requested
 * @param {String} objectName - Fully qualified name of Service being requested
 * @param {String} objectMethod - method_name of Service 'objectName'.
 * @throws {type} Object of a certain type are not found in the database
 * @throws {Error} Object of a certain type is not found in the database
 * @throws {Error} Could not establish a connection to the database
 */

//var mongoose = require("mongoose");

//Main Function
exports.removeAuthorization = function removeAuthorization(/*buzzspaceName, objectName, objectMethod*/restrictionID)
{
    //Testing if database connection was successful
    //Connecting to the database
   // mongoose.connect("mongodb://d3user:DdJXhhsd2@proximus.modulusmongo.net:27017/purYv9ib");

    var db = mongoose.connection;
    if (db != null)
    {
        connected = true;
    }
    else
    {
        connected = false;
    }

    if (connected == true)
    {
        //find the user object from the userID
        //console.log("ID : "+ID);
        ServiceRestriction.findOne({restriction_id: restrictionID}, function(err, _Res)
        {
            if (err)
            {
                throw{
                    name: "Error",
                    message: err,
                    toString: function()
                    {
                        return this.name + ": " + this.message;
                    }
                }
            }
            else
            if (_Res == null)
            {
                throw{
                    name: "Object Not Found",
                    message: 'Could not find Restriction in database',
                    toString: function(){
                        return this.name + ": " + this.message;
                    }
                }
            }
            else
            {
                if (_Res.deleted == false)
                {

                }
                else
                {
                    //Defining parameters to update deleted field
                    var query = { restriction_id: restrictionID };
                    var options = { multi: false };
                    var update =  { deleted: true };

                    ServiceRestriction.update(query, { $set: update}, options , callback);

                    function callback (error, numAffected)
                    {
                        // numAffected is the number of updated documents - should be 1
                        //console.log("Num Affected: " + numAffected);
                    }
                }
            }
       });
    }
    else
    {
        throw{
            name: "Connection Error",
            message: "Could not establish a connection to the database.",
            toString:    function(){return this.name + ": " + this.message;}
        }
    }
};

/////////////////////////////////////////////// updateAuthorization ///////////////////////////////////////////

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
    //var connected = false;
    //var db = mongoose.connection;
    //if (db != null)
    //{
    //    connected = true;
    //}
    //
    //return connected;
    return true;
}

function checkValues(rle,stat){
    var validValues = false;
    //var RoleSchema = mongoose.Schema({
    //    role_id         : String,           /* The id of the role */
    //    name            : String,            /* The name of the role, as from LDAP */
    //    role_weight     : Number            /* The weighting of the role, this is used for comparison of the roles*/
    //});
    //var Role = mongoose.model('roles', RoleSchema);
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

    //var ServiceRestrictionSchema = new mongoose.Schema(
    //    {
    //        restriction_id: String,
    //        buzz_space_id: [mongoose.Schema.Types.ObjectID],
    //        service_id: [mongoose.Schema.Types.ObjectID],
    //        minimum_role: [mongoose.Schema.Types.ObjectID],
    //        minimum_status_points: Number,
    //        deleted: Boolean
    //    });



    if (connect == true) {
        setNewParameters(aID, rl, sP);

       // var restrictions = mongoose.model('servicerestrictions', ServiceRestrictionSchema);
        //Looks for a BuzzSpace with the matching ID AND deleted = false
        //Find didn't work with the save function. So it only affects the first found one.
        //Alt try removing save and use find.
        ServiceRestriction.findOne({'buzz_space_id': aID,'deleted':false}, function (err, docs)
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
 //       mongoose.disconnect();
    }
    else {
        throw{
            name: "Connection Error",
            message: "Could not establish a connection to the database.",
            toString:    function(){return this.name + ": " + this.message;}
        }
    }
}
//////////////////////////////////////////////// getAuthorization //////////////////////////////////////////

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
    //var connected = false;
    //var db = mongoose.connection;
    //if (db != null)
    //{
    //    connected = true;
    //}
    //
    //return connected;
    return true;
}

//Actual Function - get all the restrictions for a specific BuzzSpace.
function getAut(bID){
    //TODO create connect helper function
    mongoose = require("mongoose");
    mongoose.connect("mongodb://d3user:DdJXhhsd2@proximus.modulusmongo.net:27017/purYv9ib");
    var connect =  checkConnection();

    //var ServiceRestrictionSchema = new mongoose.Schema(
    //    {
    //        restriction_id: String,
    //        buzz_space_id: [mongoose.Schema.Types.ObjectID],
    //        service_id: [mongoose.Schema.Types.ObjectID],
    //        minimum_role: [mongoose.Schema.Types.ObjectID],
    //        minimum_status_points: Number,
    //        deleted: Boolean
    //    });
    //TODO check if database exists
    if (connect == true) {
        //var restrictions = mongoose.model('servicerestrictions', ServiceRestrictionSchema);
        setID(bID);

        //var Restriction2 = mongoose.model('Restriction', restrictions);
        //Looks for a BuzzSpace with the matching ID AND deleted = false
        ServiceRestrictionSchema.find({'buzz_space_id': bID,'deleted':false}, function (err, docs)
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
        //mongoose.disconnect();
    }
    else {
        throw{
            name: "Connection Error",
            message: "Could not establish a connection to the database.",
            toString:    function(){return this.name + ": " + this.message;}
        }
    }
}