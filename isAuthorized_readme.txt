*All code is encapsulated within a class called Authorized.

*The class contains three variables
	- service: this is the specific requested service
	- role: this is the user requesting the service's status (the privileges the user has)
	- buzzspace: specifies the specific buzzspace that the user is requesting the service from.
	
*The class also contains three helper functions:
	-getService()
	-getRole()
	-getBuzzspace()
	*each helper function is a getter function to get the values from the respective variables in the class.
	
*Finally the class has a main function called isAuthorized.
isAuthorized is a function contained in the class Authorization. 
The funtion returns a value of type boolean.
The aim of the function is to determine whether the user has the privileges to make use of the requested service.

*Function prototype: Authorized.prototype.isAuthorized = function() { ... code ... }
The function does not take any parameters as it uses the variables declared inside the class to achieve its goal.
This means that in order to use it, an object of type Authorized must be created and initialised
with the database objects service, role and buzzspace.

*Pre-conditions: 
	-The user, within a specific buzzspace must request or attempt to use a specific service.
	-The user has to have some form of status within the system
	-The user must attempt to use the specific service from a specific buzzspace.
	-The service the user is attemting to use must be clearly identified.
	
*Post-conditions:
	-Based on the service the user is attemting to make use of the role / status of the user will be evaluated.
	-The user will be granted permission (true will be returned) if the user has the priviledge to make use of the service.
	-The user will be denied the right (false will be returned) to make use of the service if the ststus of the user is not the same or higher than the status required to use the service.
	
*Function Outline
1. isAuthorized() first finds, tests, connects and open the database that contains all the data regarding services, statuses and other information about the system.
2. If the function cannot connect to the database an error is thrown.
3. If a connection is established then the function reads the database and attempts to find the record with the matching data as the service, role and buzzspace variables.
4.If no such record is found or a restriction is not found it means no restriction exists and so the user may use the service; ie function returns true.
5. Otherwise a "User Not Authorized" Exception is thrown and the user is denied access to that service.
	
