function main ()
{
   var addAuth = require('./AddAuthorization.js');
   //var remAuth = require('./removeAuthorization.js');

    //Create object of type removeAuthorisation
    //removeAuth = new remAuth.removeAuthorization('COS301addPost');

    //adding authentication
    addAuth.add('COS301', 25,'noviceUser' ,'addPost');
    //addAuth.add('COS226', 20,'noviceUser' ,'removePost');
    //addAuth.add('COS333', 25,'noviceUser' ,'createThread');
    //removing authentication
    //removeAuth.remove('COS301addPost');
}

main();
