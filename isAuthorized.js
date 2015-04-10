var mongoose = require("mongoose");
//TODO use provided template - Done
//TODO throw errors for errors(Don't console log them) - Done
//TODO update parameteres to : buzzspaceName, objectName, objectMethod, userID, statusPoints - Done
//TODO check if objects all exists && check if restriction exists. Throw relevant errors. - Done
//TODO use databasestuff schemas -
//TODO use helper functions where possible(Simpilify reading of code) -> especially with multiple if statements. Rather call a helper functions that either returns a value or throws an error - attempted this, couldn't get around the asynchronous calls.
//TODO simplification of code.
//TODO-Trevor I will be updating the schema to include a services table as well as providing functionality to check where roles rank. If this has not been done and you would like to test. GET ON MY CASE. Won't take me longer than 20 mins.

/**
 * @module buzzAuthorisation
 * @author AuthorisationB - Sphelele Malo
 * @version 0.2
 */

/**
 * Checks where a user is authorised to use a specified service on a specific buzzspace.
 * @param {String} buzzspaceName -  name of the buzz space for which Authorisation is being requested
 * @param {String} objectName - Fully qualified name of Service being requested
 * @param {String} objectMethod - method_name of Service 'objectName'.
 * @param {String} userID - ID of the user requesting to use the service
 * @param {Number} statusPoints - status_value of the user requesting to use the service
 * @throws {type} Object of a certain type are not found in the database
 * @throws {Error} Could not establish a connection to the database
 * @throws {Error} User unauthorised to utilise service11
 */
exports.isAuthorized = function isAuthorized(buzzspaceName, objectName, objectMethod, userID, statusPoints)
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
