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
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        connected = true;
    });

    if (connected == true)
    {
        var Restriction = mongoose.model('Restriction', restrictions);

        Restriction.find({role : this.role,
                          service : this.service,
                          buzzSpace : this.buzzSpace}, function (err, Restriction)
			  {
				try
				{
					if (Restriction != null)
					{
						//throw user unauthorized exception
						throw{
							name: "Unauthorized Error",
							message: "Error detected. Could not find specified restriction.",
							toString:    function(){return this.name + ": " + this.message;} 
						}
					}
					else
					{
						return true;
					}
				}
				catch(e)
				{
					alert(e.toString);					
				}
					})
    }

};

//--------------------------------------------------------------------------//

var service;
var role;	//Need to define variables
var buzzspace;

//Creating class instance
var authorized = new Authorized(service, role, buzzspace); //Need to define parameters

var result;
result = authorized.isAuthorized();