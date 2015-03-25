//Connecting to the database
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/BuzzDB2');

//testing to see if connection was successful.
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));



//creating schema
    var Roles = new mongoose.Schema({
        ID: Number,
        Name:String
    });

//compile the schema to allow objects to be made of it
    var Role = mongoose.model('Role', Roles);

//creating new roles
    var admin = new Role({ID : this.ObjectId, Name : 'administrator'});
    var experiencedUser = new Role({ID : this.ObjectId, Name : 'experiencedUser'});
    var intermediateUser = new Role({ID : this.ObjectId, Name : 'intermediateUser'});
    var noviceUser = new Role({ID : this.ObjectId, Name : 'noviceUser'});

//persisting roles to database
    admin.save(function (err, fluffy) {
        if (err) console.log(err)});

    experiencedUser.save(function (err, experienced) {
        if (err) console.log(err)});

    intermediateUser.save(function (err, intermediate) {
        if (err) console.log(err)});

    noviceUser.save(function (err, novice) {
        if (err) console.log(err)});


//creating schema
    var services = new mongoose.Schema({
        ID: String,
        details: String
    });

//compile the schema to allow objects to be made of it
    var Service = mongoose.model('Service', services);


//Creating service objects
    var postComment = new Service({ID : 'postComment', details : 'Allows a user to post a comment on a thread'});
    var deleteComment = new Service({ID : 'deletePost', details : 'Allows a user to delete a comment on a thread'});
    var editComment = new Service({ID : 'editComment', details : 'Allows a user to edit a comment on a post'});
    var createAuth = new Service({ID : 'createAuthorization', details : 'Allows an administrator to create an authorization restriction'});

//Persisting Service objects to database
    postComment.save(function (err, post) {
        if (err) console.log(err)});
    deleteComment.save(function (err, deleteComment) {
        if (err) console.log(err)});
    editComment.save(function (err, edit) {
        if (err) console.log(err)});
    createAuth.save(function (err, create) {
        if (err) {console.log(err)}
    });

//creating schema
    var BuzzSpaces = new mongoose.Schema ({
        id: Number,
        name: String,
        code:  String
    });

//compile the schema to allow objects to be made of it
    var BuzzSpace = mongoose.model('BuzzSpace', BuzzSpaces);


//Creating BuzzSpace Objects
    var COS301 = new BuzzSpace({id : this.ObjectId, name : 'Software Engineering', code : 'COS 301'});
    var COS332 = new BuzzSpace({id : this.ObjectId, name : 'Networking', code : 'COS 332'});
    var COS333 = new BuzzSpace({id : this.ObjectId, name : 'Programming Languages', code : 'COS 333'});

//Persisting BuzzSpace objects to Database
    COS301.save(function (err, cos301){
        if (err) {console.log(err);}
    });
    COS332.save(function (err, cos332){
        if (err) {console.log(err);}
    });
    COS333.save(function (err, cos333){
        if (err) {console.log(err);}
    });


//creating schema
    var restrictions = new mongoose.Schema({
        id: String,
        buzzfeedPost: [BuzzSpaces],
        servicesID: [services],
        minimumRole: [Roles],
        minimumStatusPoints: Number
    });


//compile the schema to allow objects to be made of it
    var Restriction = mongoose.model('Restriction', restrictions);
    var buzz1 = null, buzz2, buzz3;
    var service1 = null, service2, service3;
    var role1 = null, role2, role3;

    function initialise(err, found)
    {
        if (err){console.log(err);}
        else service1 = found;
    }
//finding objects in database to link to restriction objects
    BuzzSpace.findOne({code : 'COS 301', name : 'Software Engineering'}, function (err, found){
        if (err){console.log("Error: " + err);}
        else
            this.service1 = found;
        console.log(service1);
    });
    console.log(service1);
    Service.findOne({ID : 'deletePost'}, function (err, found){
        initialise(err,found);
    });

    Role.findOne({Name : 'experiencedUser'},function (err, found){
        if (err){console.log("Error: " + err);}
        else
            role1 = found;
    });

//Creating Restrictions
    var delRestrict = new Restriction({
        id: "deletePostRestriction", buzzfeedPost: [this.buzz1], servicesID: [this.service1],
        minimumRole: [this.role1], minimumStatusPoints: 50
    });



    var editRestrict = new Restriction({id:"editPostRestriction",buzzfeedPost:[BuzzSpace.findOne({code : 'COS 332'})], servicesID: [Service.findOne({ID : 'editComment'})],
        minimumRole:[Role.findOne({Name : 'intermediateUser'})], minimumStatusPoints:25});
    var createRestrict = new Restriction({id:"createAuthorizationRestriction",buzzfeedPost:[BuzzSpace.findOne({code : 'COS 301'})], servicesID: [Service.findOne({ID : 'createAuthorization'})],
        minimumRole:[Role.findOne({Name : 'administrator'})], minimumStatusPoints:100});

//Persisting restrictions to the database
    delRestrict.save(function (err, t) {
        if (err) return console.error(err)});
    editRestrict.save(function (err, t) {
        if (err) return console.error(err)});
    createRestrict.save(function (err, t) {
        if (err) return console.error(err)});

    console.log("Success");//outputs to terminal if no exceptions were thrown



mongoose.disconnect();


