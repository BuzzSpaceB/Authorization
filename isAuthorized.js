//------------------------Defining Class-----------------------------------//
function Authorized(sService, sRole, sbuzzspace)
{
	//Variables (I changed it from functions to normal variables didn't work otherwise)
	this.service = sService;
	this.role = sRole;
	this.buzzspace =  sbuzzspace;

    console.log(this.service.ID);
}
module.exports.Authorized = Authorized;
//--------------------------------------------------------------------------//
//------------------------Adding functions--------------------------------//

//Helper Function
Authorized.prototype.getService = function() {
	return this.service;
};

//Helper Function
Authorized.prototype.getRole = function() {
	return this.role;
};

//Helper Function
Authorized.prototype.getBuzzspace = function() {
	return this.buzzspace;
};

//Main Function
Authorized.prototype.isAuthorized = function(moduleID, objectName, objectMethod, userID)
{

    var connected = false;
    //Connecting to the database
    //var mongoose = require("mongoose");
    //mongoose.connect("mongodb://d3user:DdJXhhsd2@proximus.modulusmongo.net:27017/purYv9ib");

    //Testing if database connection was successful
    var file = require("./AddAuthorization.js");
    var Restriction = file.restrict;
    var mongoose = file.mongoose;

    var db = mongoose.connection;
    if (db != null)
	{
		connected = true;
	}

    if (connected == true)
    {
        var ServiceSchema = mongoose.Schema({
            service_id                  : ObjectId,
            service_name                : String, /*Fully qualified service name */
            method_name                 : String,
            deleted                     : Boolean
        });

        var RoleSchema = mongoose.Schema({
            role_id         : String,           /* The id of the role */
            name            : String            /* The name of the role, as from LDAP */
        });

        var Role = new mongoose.model('Role', RoleSchema);
        Service = new mongoose.model('Service', ServiceSchema);
        var UserSchema = mongoose.Schema({
            user_id             : String,           /* PK, this is the user_id as in LDAP i.e student number */
            username            : String,           /* The user's preferred username, like first name */
            roles               : [{role_name : [String], module: [String]}],      /* Array of Roles & modules of the user as from LDAP */
            modules      		: [String],          /* Array of Modules that is active for the user */
            post_count			: Number,
            statusPoints        : Number
        });

        User = new mongoose.model('User', UserSchema);

        //find the user object from the userID
        User.findOne({user_id: userID}, function(err, _user){
            if (err){console.log(err);}
            else
            {
                for (var  i = 0;i < _user.roles.length; i++ )
                {
                    if (_user.roles[i].module == moduleID) //User is registered for this buzz module
                    {
                        var userRole = user.roles[i].role_name;

                        //find the service object for the service being requested
                        Service.findOne({method_name: objectMethod, service_name: objectName}, function (err, result)
                        {
                            if (err)
                            {
                                console.log("Error: " + err);
                            }

                            else
                            {
                                var newID = moduleID + result.service_id; //create the Restriction objects ID

                                //find the restriction object for the requested service
                                Restriction.findOne({ID: newID}, function(err, rest){
                                    if (err)console.log("Error: " + err);
                                    else if (rest.toString() == "")
                                    {
                                        return true;
                                    }
                                    else
                                    {
                                        //find the restrictions minimumRole object
                                        Role.findOne({_id : rest.minimumRole}, function (err, rol){
                                            if (err){console.log("Error: " + err);}

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
                                                                if (_user.statusPoints < rest.minimumStatusPoints)
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
                                                        //throw user unauthorized exception

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
	    console.log("Could not establish a connection to the database.");
    }

};

//--------------------------------------------------------------------------//

var service;
var role;	//Need to define variables. must be database objects
var buzzspace;

//Creating class instance
//var authorized = new Authorized(service, role, buzzspace); //Need to define parameters

//var result;
//result = authorized.isAuthorized();