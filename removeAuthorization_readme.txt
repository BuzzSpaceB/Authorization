*All code is encapsulated within a class called removeAuthorization.

*The class contains one variable
	- authID: this is the specific id that is needed in order to locate the restriction within the database
	
*The class has a main function called removeAuthorization.
It is a void function and does not return any value.
The aim of the function is "remove" an authorization of a restriction by setting a "deleted" flag to true. 

*Function prototype: removeAuthorization(restrictionID)  { ... code ... }
The function takes one parameter-the od of the specified restriction.

*Pre-conditions: 
	-The user, within a specific buzzspace must request or attempt to remove someones authorization for a specific service.
	-The user has to have some form of status within the system
	-The user must attempt to use the specific service from a specific buzzspace.
	
*Post-conditions:
	-The role / status of the user will be evaluated.
	-The user will be granted permission to remove an authorization from the database and the flag for the specified authorization will be set to true - removed.
	-The user will be denied the right to remove an authorization from the database and no alterations will be made.
	-The "deleted" field in the database is set to true. - Thus authorizationis deleted.
	
*Function Outline
1. removeAuthorization() first finds, tests, connects and open the database that contains all the data regarding services, statuses, restrictions and other information about the system.
2. If the function cannot connect to the database an error is thrown.
3. If a connection is established, then the function locates the record with the specific restrictionID. 
4. If a record is found then it is testes to see if the deleted field is "True". If so it is ignored, otherwise it is set to "True".	
	