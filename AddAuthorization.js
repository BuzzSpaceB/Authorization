/**
 * Created by Armand Pieterse on 21-Mar-15.
 */

   //Connecting to the database
    var mongoose = require("mongoose");
    mongoose.connect('mongodb://localhost/test');
    //var file = require("./dbconfig.js");

    //testing to see if connection was successfull.
     var db = mongoose.connection;
     db.on('error', console.error.bind(console, 'connection error:'));
     db.once('open', function (callback) {

         //outputs to terminal if no exceptions were thrown (success)
         //creating schema
         var Roles = new mongoose.Schema({
             ID: Number,
             Name: String
         })

         //compile the schema to allow objects to be made of it
         var Role = mongoose.model('Role', Roles);
         //creating schema
         var services = new mongoose.Schema({
             ID: String,
             details: String
         })
         //compile the schema to allow objects to be made of it
         var Service = mongoose.model('Service', services);

         //creating schema
         var BuzzSpaces = new mongoose.Schema
         ({
             id: String,
             name: String,
             code: String
         })
         //compile the schema to allow objects to be made of it
         var BuzzSpace = mongoose.model('BuzzSpace', BuzzSpaces);

         //...Creating models and database schemas... (starts here)
         var restrictions = new mongoose.Schema({
             id: String,
             buzzSpace: [BuzzSpaces],
             servicesID: [services],
             minimumRole: [Roles],
             minimumStatusPoints: Number
         })

         //compile the schema to allow objects to be made of it
         var Restriction = mongoose.model('Restriction', restrictions);
         //...Creating models and database schemas...(ends here)

         //Getter functions for models (not really needed atm since I couldn't externalise the AddAuthor. Function)
         /*function getRestriction()
         {
             return Restriction;
         }
         function getBuzzSpace()
         {
             return BuzzSpace;
         }
         function getRole()
         {
             return Role;
         }
         function getService()
         {
             return Service;
         }*/


         //invoke the function call of addAuthorizationRestrictions
         var user = new Role({ID:3,Name:"User"});
         var comment = new Service({ID:"2",details:"Commenting on a post."});
         var buzz = new BuzzSpace({id:"2",name:"Programming Languages",code:"COS333"});
         addAuthorizationRestrictions(user, buzz, comment, user, 11);
         console.log("Success");


         //function to addAuthorizationRestricions
         function addAuthorizationRestrictions(userRole,buzzspace,serv,minRole,minStatusPoints)
         {
             //Calling is Authorized to check if the user is of the minimum role(Admin in this case) to use this service.
             if (isAuthorized())  // addAuthorizationRestrictions is the service being used by the user.
             {
                 //console.log(buzzspace+" "+serv);
                 //query documents

                 //this id will be unique for each buzzSpace and Service
                 var newID = buzz.code+serv.ID; //For now this will generate the id for restrictions...

                     Restriction.find({ 'id': newID},function (err, docs)
                     {
                         //console.log(docs.toString());
                         if (docs.toString() == "")
                         {
                             var rest = new Restriction({'id':newID,'buzzSpace':buzzspace,'servicesID':serv,'minimumRole':minRole,'minimumStatusPoints':minStatusPoints});
                             rest.save(function (err, t) {
                                 if (err) return console.error(err)});
                             console.log("inserted");
                         }
                         else //updates if this restriction exists for a buzzSpace and service
                         {
                         //   console.log("this restriction already exists, updating now.");
                         //   Restriction.findOne({ 'id': newID}, function (err, doc){
                         //        doc.minimumRole = minRole;
                         //        doc.minimumStatusPoints = minStatusPoints;
                         //        doc.save();
                         // });
                             console.log("The restriction for this role in this BuzzSpace already exists."); //Pre-conditon - authorization restriction for that role and buzzSpace don't exist.
                         }
                     });

             }
             else
             {
                 console.log("The user isn't an Admin and doesn't have the authority to use this service.");
             }
         }

         //For testing purposes a dummy isAuthorized function
         function isAuthorized(){return true;}

});



