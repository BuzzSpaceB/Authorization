//------------------------Defining Class-----------------------------------//
function removeAuthorization(authorizedID)
{
	//Variables
	this.authID = authorizedID;
}

module.exports.removeAuthorization = removeAuthorization;

//--------------------------------------------------------------------------//
//------------------------Adding functions--------------------------------//

//Helper Function
removeAuthorization.prototype.getID = function() 
{
	return this.authID;
};

//Helper Function
removeAuthorization.prototype.setID = function(authorizedID) 
{
	this.authID = authorizedID;
};

//Main Function
removeAuthorization.prototype.remove = function() 
{
	//Initial connection status set to false
	var connected = false;
	
	//Connecting to the database
	var mongoose = require("mongoose");
	mongoose.connect('mongodb://localhost/test');

	//Testing if database connection was successful
	
	//var file = require("./AddAuthorization.js");
	//var Restriction = file.restrict;
	//var mongoose = file.mongoose;

	var db = mongoose.connection;
	if (db != null)
	{
		connected = true;
	}
	else
	{
		connected = false;
	}
	
	//Creating models and database schemas for testing

	var restrictions = new mongoose.Schema(
	{
		 ID: String,
		 buzzspace_id: [mongoose.Schema.Types.ObjectID],
		 servicesID: [mongoose.Schema.Types.ObjectID],
		 minimumRole: [mongoose.Schema.Types.ObjectID],
		 minimumStatusPoints: Number,
		 deleted: Boolean
	});
	
	 var Restriction = mongoose.model('Restriction', restrictions);


	if (connected == true)
	{
	
	Restriction.find({'ID': this.authID}, function (err, docs) 
	{
		//Check to see that restriction exists
		if (docs.toString() == "") 
		{
			console.log("The restriction for this role in this BuzzSpace does not exist.");
		}
		//restriction exists
		else 
		{
			//Defining parameters to update deleted field
			var query = { ID: this.authID };
			var options = { multi: false };
			var update =  { deleted: true };
			
			Restriction.update(query, { $set: update}, options , callback);
			
			function callback (error, numAffected) 
			{
			  // numAffected is the number of updated documents - should be 1
			}			
			console.log("removed");
		}
	});

	}
	else
	{
	    console.log("Could not establish a connection to the database.");
	}

};

//--------------------------------------------------------------------------//

var id;

//Creating class instance
//var removerAuth = new removeAuthorization(id); //Need to define parameters


// removeAuthorization.remove();
