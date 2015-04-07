This works when running the dbconfig.js 
file once and closing it to 
initialize the database and its components. 
(also inserts 1 record to the roles and restrictions components)

Afterwards running AddAuthorization.js will insert
1 record to restrictions for testing purposes and if run again
it will update that restriction, because it already exists.
Unfortunately i couldn't externalise the schema's it only works 
when it's included inside. This was without any node.js since that
is part of the integration teams job, so goodluck Integration team.

The important function/service here is: addAuthorizationRestriction 
