*All code is encapsulated within a class called removeAuthorization.

*The class contains one variable
	- authID: this is the specific id that is needed in order to locate the restriction within the database
	
*The class also contains two helper functions:
	-getID()
	-setID()
	*each helper function is a getter or setter function to get or set the values from the respective variables in the class.
	
*Finally the class has a main function called remove.
remove is a function contained in the class removeAuthorization. 
It is a void function and does not return any value.
The aim of the function is "remove" an authorization of a restriction by setting a "deleted" flag to true. 

*Function prototype: removeAuthorization.prototype.remove = function()  { ... code ... }
The function does not take any parameters as it uses the variables declared inside the class to achieve its goal.
This means that in order to use it, an object of type removeAuthorization must be created and initialised
with the database objects ID.

*Pre-conditions: 
	-The user, within a specific buzzspace must request or attempt to remove someones authorization for a specific service.
	-The user has to have some form of status within the system
	-The user must attempt to use the specific service from a specific buzzspace.
	
*Post-conditions:
	-The role / status of the user will be evaluated.
	-The user will be granted permission to remove an authorization from the database and the flag for the specified authorization will be set to true - removed.
	-The user will be denied the right to remove an authorization from the database and no alterations will be made.
	
*Function Outline
1. remove() first finds, tests, connects and open the database that contains all the data regarding services, statuses, restrictions and other information about the system.
2. If the function cannot connect to the database an error is thrown.
3. If a connection is established then the function  isAuthorized() is called to see if the user has the priviledge to remove authorizations.
4. If true is returned then the function reads the database and attempts to find the record with the matching ID as the one passed in the object creation.
	4.1. If no such record is found or a restriction is not found it means no restriction exists and so the user cannot remove something that doesnt exist; ie function returns error.
	4.2. Otherwise if the ID exists then the "deleted" flag for that restriction is set to true.
5. Otherwise an error is shown.	
	