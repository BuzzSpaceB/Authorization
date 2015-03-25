//------------------------Defining Class-----------------------------------//
function Authorized(sService, sRole, sbuzzspace)
{
	//Variables
	this.service = sService;
	this.role = sRole;
	this.buzzspace = sbuzzspace;
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
    mongoose.connect('mongodb://localhost/BuzzDB');

    //Testing if database connection was successful
    var db = mongoose.connection;
    if (db != null)
    {
        connected = true;
    }

    //Model needs to be imported from the defining file. So if possible, the file that created the database needs to export
    //the model so that this class can use it. "dbconfig" was used here only as a temporary fix

    //Schema to be used.
    var BuzzSpaces = new mongoose.Schema ({
        id: Number,
        name: String,
        code:  String
    });


    var services = new mongoose.Schema({
        ID: String,
        details: String
    });

    var Roles = new mongoose.Schema({
        ID: Number,
        Name:String
    });
    var restrictions = new mongoose.Schema({
        id: String,
        buzzfeedPost: [BuzzSpaces],
        servicesID: [services],
        minimumRole: [Roles],
        minimumStatusPoints: Number
    });
    var BuzzSpace = mongoose.model('BuzzSpace', BuzzSpaces);
    var Service = mongoose.model('Service', services);
    var Restriction = mongoose.model('Restriction', restrictions);

    if (connected == true)
    {
        var returnVar ='none';
        Restriction.findOne({buzzFeedPost : [this.getBuzzspace()], servicesID: [this.getService()]}, function(err, rest){
            if (err)console.log("Error: " + err);
            else if (rest == undefined)
            {
                returnVar = true;
            }
            else
            {
                console.log("sadsasdasd");
                console.log(rest);
                //throw user unauthorized exception
               /* throw{
                    name: "Unauthorized Error",
                    message: "User is unauthorized to use this service.",
                    toString:    function(){return this.name + ": " + this.message;}
                }*/
                returnVar = false;
            }
        });
    }
    else
    {
        console.log("Not connected");
    }
    mongoose.disconnect();
    return returnVar;
};

//--------------------------------------------------------------------------//

exports.a = Authorized;