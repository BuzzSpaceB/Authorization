function main ()
{
    var file = require('./Authorized');

    var Authorised = file.a;

    var obj = new Authorised('service', 'role', 'buzz');

    console.log(obj.isAuthorized());

}

main();
