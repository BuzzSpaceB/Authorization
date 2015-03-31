function main ()
{
    var addAuth = require('./AddAuthorization.js');
    var remAuth = require('./removeAuthorization.js');

    //Create object of type removeAuthorisation
    removeAuth = new remAuth.rem('COS301addPost');

    //adding authentication
    addAuth.add('COS301', 25,'noviceUser' ,'addPost');

    //removing authentication
    removeAuth.remove('COS301addPost');
}

main();
