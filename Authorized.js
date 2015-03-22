//------------------------Defining Class-----------------------------------//
function Authorized(sService, sRole, sbuzzspace)
{
	//Variables
	this.service = function(sService) 
	{
		return sService;
	};
	this.role = function(sRole) 
	{
		return sRole;
	};
	this.buzzspace =  function(sbuzzspace) 
	{
		return sbuzzspace;
	};
}
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
Authorized.prototype.isAuthorized = function() {

    var connected = false;
    //Connecting to the database
    var mongoose = require("mongoose");
    mongoose.connect('mongodb://localhost/test');

    //Testing if database connection was successful
    var db = mongoose.connection;
    if (db != null)
	{
		connected = true;
	}

    if (connected == true)
    {
	//Model needs to be imported from the defining file. So if possible, the file that created the database needs to export
	//the model so that this class can use it. "dbconfig" was used here only as a temporary fix
	var file = require("./dbconfig");
	var Restriction = file.restrict;
	Restriction.findOne({buzzSpace : [this.buzzSpace], role: [this.getRole()], servicesID: [this.getService()]}, function(err, rest){
		if (err)console.log("Error: " + err);
		else if (rest == null)
		{
			return true;
		}
		else
		{
			//throw user unauthorized exception
			throw{
			name: "Unauthorized Error",
			message: "User is unauthorized to use this service.",
			toString:    function(){return this.name + ": " + this.message;}
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
var authorized = new Authorized(service, role, buzzspace); //Need to define parameters

var result;
result = authorized.isAuthorized();