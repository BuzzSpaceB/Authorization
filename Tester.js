function main ()
{
  // var addAuth = require('./AddAuthorization.js');
  // var isAuth = require('./isAuthorized.js');
    var Auth = require('./Authorized.js');

   //var remAuth = require('./removeAuthorization.js');

    //Create object of type removeAuthorisation
    //removeAuth = new remAuth.removeAuthorization('COS301addPost');

    //adding authentication
    //addAuth.add('COS301', 25,'noviceUser' ,'addPost');
    //addAuth.add('COS226', 20,'noviceUser' ,'removePost');
    //addAuth.add('COS333', 25,'noviceUser' ,'createThread');
    //removing authentication
    //removeAuth.remove('COS301addPost');

   // var Author = new isAuth.Authorized("addPost","lecturer","COS301");
    //var val = Author.isAuthorized(, ,,);

    var role1 = new Auth.Role({
        'role_id': '552fb83fa23b2958293e73d6',
        'name':'test',
        'role_weight': 5
    });
   /* var service1 = new Auth.Service({
        'service_id': '552fd20b05ab44fc2574f245',
        'service_name':'Thread',
        'method_name':'closeThread',
        'deleted': false
    });*/

    //Auth.addAuthorizationRestrictions("COS332",'552fd20b05ab44fc2574f245',role1,10);
   // Auth.addAuthorizationRestrictions("COS301",'552fd20b05ab44fc2574f247',role1,15);
   //Auth.addAuthorizationRestrictions("COS301",'552fd20b05ab44fc2574f243',role1,9);

    //buzzSpace doesn't exist exception
    //Auth.addAuthorizationRestrictions("COS302",'552fd20b05ab44fc2574f245',role1,10);

    //Service Doesn't exist exception
    //Auth.addAuthorizationRestrictions("COS332",'552323d20b05ab44fc2574f2',role1,10);

    //invalid role exception
    //Auth.addAuthorizationRestrictions("COS332",'552fd20b05ab44fc2574f245','552fd20b05ab44fc2574f243',10);

    //invalid statuspoints exception
   //Auth.addAuthorizationRestrictions("COS332",'552fd20b05ab44fc2574f245',role1,-1);

}

main();
