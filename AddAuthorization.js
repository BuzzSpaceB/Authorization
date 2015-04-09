/**
 * Created by Armand Pieterse on 21-Mar-15.
 */
//TODO recreate class use template class provided
//Connecting to the database
//TODO Make a connection helper function and include it within the call of the AddAuthorization function
//TODO All code outside of main function should either be placed in helper function or main code
var mongoose = require("mongoose");
mongoose.connect("mongodb://d3user:DdJXhhsd2@proximus.modulusmongo.net:27017/purYv9ib");

//testing to see if connection was successfull.
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
//TODO Use databasestuff schemas
//creating schema
var Roles = new mongoose.Schema({
    ID: Number,
    Name: String
});

//compile the schema to allow objects to be made of it
var Role = mongoose.model('Role', Roles);
//creating schema
//TODO Use databasestuff schema
var services = new mongoose.Schema({
    ID: String,
    details: String
});
//compile the schema to allow objects to be made of it
var Service = mongoose.model('Service', services);

//creating schema

//compile the schema to allow objects to be made of it

//function to addAuthorizationRestricions
//TODO change parameters to buzzspaceName, statusPoints, role, objectName, objectMethod
//TODO remember if deleted there is a flag
function addAuthorizationRestrictions(buzzspaceID, statusPoints, Role, ServiceID) {
    //...Creating models and database schemas... (starts here)
    //TODO if ID in buzzspace schema is not updated to string let me know && use database stuff schemas
    var restrictions = new mongoose.Schema({
        ID: String,
        buzzspace_id: [mongoose.Schema.Types.ObjectID],
        servicesID: [mongoose.Schema.Types.ObjectID],
        minimumRole: [mongoose.Schema.Types.ObjectID],
        minimumStatusPoints: Number,
        deleted: Boolean
    });

    //compile the schema to allow objects to be made of it
    var Restriction = mongoose.model('Restriction', restrictions);

    /*Using a call back function so that this function
     doesn't go on ahead before it is authorized to do so...*/

    //this id will be unique for each buzzSpace and Service
    var newID = buzzspaceID + ServiceID; //For now this will generate the id for restrictions...
    //TODO Check if buzzSpace exists, objectName and Method exists. Throw errors if they don't exist.
    //TODO Search database via buzzspaceName, objectName, objectMethod and throw relevant error
    //TODO Remember to check if the deleted field is true
    Restriction.find({'ID': newID}, function (err, docs) {
        if (docs.toString() == "") {
            var rest = new Restriction({
                'ID': newID,
                'buzzspace_id': buzzspaceID,
                'servicesID': ServiceID,
                'minimumRole': Role,
                'minimumStatusPoints': statusPoints,
                'deleted': false
            });
            rest.save(function (err, t) {
                if (err) return console.error(err)
            });
            console.log("inserted");
        }
        else //restriction already exists
        {
            console.log("The restriction for this role in this BuzzSpace already exists."); //Pre-conditon - authorization restriction for that role and buzzSpace don't exist.
        }
    });

    module.exports.restrict = Restriction;
}

exports.mongoose = mongoose;

//For testing purposes a dummy isAuthorized function
//function isAuthorized(){return true;}

//});

exports.add = addAuthorizationRestrictions;




