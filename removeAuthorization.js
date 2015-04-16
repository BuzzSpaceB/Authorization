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
 * @throws {String} Object of a certain type are not found in the database
 * @throws {String} Object of a certain type is not found in the database
 * @throws {String} Could not establish a connection to the database
 */

var mongoose = require("mongoose");

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
				else
				{
					
				}				
			}
		}		
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