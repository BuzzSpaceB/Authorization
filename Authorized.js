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
    minimum_role                : mongoose.Schema.ObjectId,
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

    var connected = false;



    //Testing if database connection was successful
    var ServiceRestrictionSchema = new mongoose.Schema({
        restriction_id: String,
        buzz_space_id: [mongoose.Schema.Types.ObjectID],
        service_id: [mongoose.Schema.Types.ObjectID],
        minimum_role: [mongoose.Schema.Types.ObjectID],
        minimum_status_points: Number,
        deleted: Boolean
    });
    var Restriction = mongoose.model('servicerestrictions', ServiceRestrictionSchema);

    //Connecting to the database
    mongoose.connect("mongodb://d3user:DdJXhhsd2@proximus.modulusmongo.net:27017/purYv9ib");

    var db = mongoose.connection;
    if (db != null)
    {
        connected = true;
    }

    if (connected == true)
    {

        var RoleSchema = mongoose.Schema({
            role_id         : String,           /* The id of the role */
            name            : String,            /* The name of the role, as from LDAP */
            role_weight     : Number            /* The weighting of the role, this is used for comparison of the roles*/
        });
        var Role = mongoose.model('roles', RoleSchema);

        var ServiceSchema = mongoose.Schema({
            service_id                  : ObjectId,
            service_name                : String, /*Fully qualified service name */
            method_name                 : String,
            deleted                     : Boolean
        });
        var Service = mongoose.model('services', ServiceSchema);

        var UserSchema = mongoose.Schema({
            user_id             : String,           /* PK, this is the user_id as in LDAP i.e student number */
            username            : String,           /* The user's preferred username, like first name */
            roles               : [{role_name : [String], module: [String]}],      /* Array of Roles & modules of the user as from LDAP */
            modules      		: [String],          /* Array of Modules that is active for the user */
            post_count			: Number,
            status_value        : Number
        });

        var User = mongoose.model('users', UserSchema);

        //find the user object from the userID
        User.findOne({user_id : userID}, function(err, _user){
            if (err){
                throw{
                    name: "Error",
                    message: err,
                    toString: function(){
                        return this.name + ": " + this.message;
                    }
                }
            }
            else if (_user == null)
            {
                throw{
                    name: "Object Not Found",
                    message: 'Could not find User in database',
                    toString: function(){
                        return this.name + ": " + this.message;
                    }
                }
            }
            else
            {
                console.log("Found User with ID: "+_user.user_id);
                for (var  i = 0;i < _user.roles.length; i++ )
                {
                    if (_user.roles[i].module == buzzspaceName) //User is registered for this buzz module
                    {
                        var userRole = _user.roles[i].role_name;
                        console.log("User Role is: " + userRole + " for this module");
                        //find the service object for the service being requested
                        Service.findOne({method_name: objectMethod, service_name: objectName}, function (err, result)
                        {
                            if (err)
                            {
                                throw{
                                    name: "Error",
                                    message: err,
                                    toString: function(){
                                        return this.name + ": " + this.message;
                                    }
                                }
                            }
                            else if (result == null)
                            {
                                throw{
                                    name: "Object Not Found",
                                    message: 'Could not locate Service in database',
                                    toString: function(){
                                        return this.name + ": " + this.message;
                                    }
                                }
                            }
                            else
                            {
                                console.log("Found requested service object");
                                var newID = buzzspaceName + result.service_id; //create the Restriction objects ID

                                //find the restriction object for the requested service
                                Restriction.findOne({restriction_id: newID}, function(err, rest){
                                    if (err){
                                        throw{
                                            name: "Error",
                                            message: err,
                                            toString: function(){
                                                return this.name + ": " + this.message;
                                            }
                                        }
                                    }
                                    else if (rest == null)
                                    {
                                        return true;
                                    }
                                    else
                                    {
                                        console.log("Restriction found. Analyzing...");

                                        //find the restrictions minimumRole object
                                        Role.findOne({_id : rest.minimum_role}, function (err, rol){
                                            if (err){
                                                throw{
                                                    name: "Error",
                                                    message: err,
                                                    toString: function(){
                                                        return this.name + ": " + this.message;
                                                    }
                                                }
                                            }
                                            else if (rol.toString() == "")
                                            {
                                                {
                                                    throw{
                                                        name: "Object Not Found",
                                                        message: "Role Not Found In Database",
                                                        toString: function(){
                                                            return this.name + ": " + this.message;
                                                        }
                                                    }
                                                }
                                            }
                                            else
                                            {
                                                //test user role against restriction minimum role to see if user is authorised
                                                switch (rol.name) {
                                                    case 'lecturer' :
                                                        if (userRole != 'lecturer')
                                                        {
                                                            throw{
                                                                name: "Unauthorized Error",
                                                                message: "User is unauthorized to use this service.",
                                                                toString:    function(){return this.name + ": " + this.message;}
                                                            }
                                                        }
                                                        else
                                                        {
                                                            return true;
                                                        }
                                                        break;
                                                    case 'teachingAssistant' :
                                                        if (userRole == 'tutor' || userRole == 'student')
                                                        {
                                                            throw{
                                                                name: "Unauthorized Error",
                                                                message: "User is unauthorized to use this service.",
                                                                toString:    function(){return this.name + ": " + this.message;}
                                                            }
                                                        }
                                                        else
                                                        {
                                                            return true;
                                                        }
                                                        break;
                                                    case 'tutor' :
                                                        if (userRole == 'student')
                                                        {
                                                            throw{
                                                                name: "Unauthorized Error",
                                                                message: "User is unauthorized to use this service.",
                                                                toString:    function(){return this.name + ": " + this.message;}
                                                            }
                                                        }
                                                        else
                                                        {
                                                            return true;
                                                        }
                                                        break;
                                                    case 'student' :
                                                        if (userRole == 'student')
                                                        {
                                                            if (statusPoints < rest.minimum_status_points)
                                                            {
                                                                throw{
                                                                    name: "Unauthorized Error",
                                                                    message: "User is unauthorized to use this service.",
                                                                    toString:    function(){return this.name + ": " + this.message;}
                                                                }
                                                            }
                                                            else
                                                            {
                                                                return true;
                                                            }

                                                        }
                                                        break;
                                                    default :
                                                        throw{
                                                            name: "Unauthorized Error",
                                                            message: "User is unauthorized to use this service.",
                                                            toString:    function(){return this.name + ": " + this.message;}
                                                        }
                                                }

                                            }


                                        });

                                    }
                                });
                            }
                        });
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
    mongoose.disconnect();
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
    try {
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
                    }


                }

            });


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
    finally
    {
        mongoose.connection.close();
    }
}

//exports.addAuthorizationRestrictions = addAuthorizationRestrictions;

//////////////////////////////////////////// removeAuthorisation ///////////////////////////////////////

//TODO use template class
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

var mongoose = require("mongoose");

//Main Function
//TODO update the authorization delete value to false if not already false. If false ignore. - Done
//TODO throw errors for instead of console logging errors. Console log regular outputs. - Done
//TODO use database stuff schemas - Done
//TODO remember if deleted there is a flag. - Done
exports.removeAuthorization = function removeAuthorization(/*buzzspaceName, objectName, objectMethod*/restrictionID)
{
    //Testing if database connection was successful
    var ServiceRestrictionSchema = new mongoose.Schema(
        {
            restriction_id: String,
            buzz_space_id: [mongoose.Schema.Types.ObjectID],
            service_id: [mongoose.Schema.Types.ObjectID],
            minimum_role: [mongoose.Schema.Types.ObjectID],
            minimum_status_points: Number,
            deleted: Boolean
        });

    var Restriction = mongoose.model('servicerestrictions', ServiceRestrictionSchema);

    //Connecting to the database
    mongoose.connect("mongodb://d3user:DdJXhhsd2@proximus.modulusmongo.net:27017/purYv9ib");

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
        var RoleSchema = mongoose.Schema({
            role_id         : String,           /* The id of the role */
            name            : String,            /* The name of the role, as from LDAP */
            role_weight     : Number            /* The weighting of the role, this is used for comparison of the roles*/
        });
        var Role = mongoose.model('roles', RoleSchema);

        var ServiceSchema = mongoose.Schema({
            service_id                  : ObjectId,
            service_name                : String, /*Fully qualified service name */
            method_name                 : String,
            deleted                     : Boolean
        });
        var Service = mongoose.model('services', ServiceSchema);

        var UserSchema = mongoose.Schema({
            user_id             : String,           /* PK, this is the user_id as in LDAP i.e student number */
            username            : String,           /* The user's preferred username, like first name */
            roles               : [{role_name : [String], module: [String]}],      /* Array of Roles & modules of the user as from LDAP */
            modules      		: [String],          /* Array of Modules that is active for the user */
            post_count			: Number,
            status_value        : Number
        });

        var User = mongoose.model('users', UserSchema);

        //find the user object from the userID
        //console.log("ID : "+ID);
        User.findOne({restriction_id: restrictionID}, function(err, _Res)
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

                    Restriction.update(query, { $set: update}, options , callback);

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
    mongoose.disconnect();
};

/////////////////////////////////////////////// updateAuthorization ///////////////////////////////////////////

/**
 * Created by Kale-ab on 2015-04-02.
 */
/**
 * Created by Kale-ab on 2015-04-01.
 */

//    TODO Use templates provided
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

//Actual Function - update Authorization
//TODO throw errors for errors(Don't console log them)
//TODO update parameteres to : buzzspaceName, statusPoints, role, objectName, objectMethod, newRole, newStatusPoints
//TODO check if objects all exists && check if restriction exists. Throw relevant errors.
//TODO remember if deleted there is a flag.
//TODO use databasestuff schemas
//TODO use helper functions where possible(Simpilify reading of code);
function updateAuthorization(aID, rl, sP){
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
        setNewParameters(aID, rl, sP);

        var Restriction3 = mongoose.model('Restriction', restrictions);
        //Looks for a User with the matching ID AND deleted = false
        // Find didn't work with the save function. So it only affects the first found one.
        //Alt try removing save and use find.
        Restriction3.findOne({'ID': aID,'deleted':false}, function (err, docs)
        {
            //if (err) return console.error(err);
            if (docs.toString() == "")
            {
                console.log("A buzzSpace with that Specified ID doesnt exist.");
            }
            else{

                docs.minimumRole = rl;
                docs.minimumStatusPoints = sP;
                docs.save();
                console.log("updated");

            }

        });
    }
    else {
        console.log("Error connection failed.");
    }
}

exports.updateAuthor = updateAuthorization;
var db;
var mongoose;

//////////////////////////////////////////////// getAuthorization //////////////////////////////////////////

/**
 * Created by Kale-ab on 2015-04-01.
 */

//TODO Use the template class

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
    //TODO check if database exists
    if (connect == true) {
        setID(bID);

        var Restriction2 = mongoose.model('Restriction', restrictions);
        //Looks for a BuzzSpace with the matching ID AND deleted = false
        Restriction2.find({'buzzspace_id': bID,'deleted':false}, function (err, docs)
        {
            //if (err) return console.error(err);
            //TODO throw an error instead of console logging
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