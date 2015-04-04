var mongoose = require("mongoose");

function isAuthorized(moduleID, objectName, objectMethod, userID)
{

    var connected = false;
    //Connecting to the database



    //Testing if database connection was successful
    var restrictions = new mongoose.Schema({
        ID: String,
        buzzspace_id: [mongoose.Schema.Types.ObjectID],
        servicesID: [mongoose.Schema.Types.ObjectID],
        minimumRole: [mongoose.Schema.Types.ObjectID],
        minimumStatusPoints: Number,
        deleted: Boolean
    });
    var Restriction = mongoose.model('Restriction', restrictions);
    mongoose.connect("mongodb://d3user:DdJXhhsd2@proximus.modulusmongo.net:27017/purYv9ib");

    var db = mongoose.connection;
    if (db != null)
	{
		connected = true;
	}

    if (connected == true)
    {
        var ServiceSchema = mongoose.Schema({
            service_id                  : String,
            service_name                : String, /*Fully qualified service name */
            method_name                 : String,
            deleted                     : Boolean
        });

        var RoleSchema = mongoose.Schema({
            role_id         : String,           /* The id of the role */
            name            : String            /* The name of the role, as from LDAP */
        });

        var Role = mongoose.model('Roles', RoleSchema);
        var Service = mongoose.model('Services', ServiceSchema);
        var UserSchema = mongoose.Schema({
            user_id             : String,           /* PK, this is the user_id as in LDAP i.e student number */
            username            : String,           /* The user's preferred username, like first name */
            roles               : [{role_name : [String], module: [String]}],      /* Array of Roles & modules of the user as from LDAP */
            modules      		: [String],          /* Array of Modules that is active for the user */
            post_count			: Number
           // statusPoints        : Number
        });

        var User = mongoose.model('user', UserSchema);

        //find the user object from the userID
        User.findOne({user_id : userID}, function(err, _user){
            if (err){console.log("fw earwefew:: " + err);}
            else if (_user == null)
            {
                throw{message : 'Could not find User in database'};
            }
            else
            {
                console.log("Found User with ID: "+_user.user_id);
                for (var  i = 0;i < _user.roles.length; i++ )
                {
                    if (_user.roles[i].module == moduleID) //User is registered for this buzz module
                    {
                        var userRole = _user.roles[i].role_name;
                        console.log("User Role is: " + userRole + " for this module");
                        //find the service object for the service being requested
                        Service.findOne({method_name: objectMethod, service_name: objectName}, function (err, result)
                        {
                            if (err)
                            {
                                console.log("Error: " + err);
                            }
                            else if (result == null)
                            {
                                throw{message: 'Could not locate Service in database'};
                            }
                            else
                            {
                                console.log("Found requested service object");
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
                                        console.log("Restriction found. Analyzing...");
                                        //find the restrictions minimumRole object
                                        Role.findOne({_id : rest.minimumRole}, function (err, rol){
                                            if (err){console.log("Error: " + err);}
                                            else if (rol.toString() == "")
                                            {
                                                {
                                                    throw{message : 'Could not find Role in database'};
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
   // mongoose.disconnect();
};

exports.isAuthorised = isAuthorized;