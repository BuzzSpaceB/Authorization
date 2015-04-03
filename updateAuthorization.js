/**
 * Created by Kale-ab on 2015-04-02.
 */
/**
 * Created by Kale-ab on 2015-04-01.
 */
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