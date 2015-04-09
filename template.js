/**
 * @module moduleName
 * @author Name
 * @version 0.*
 */

/**
 * Function details
 * @param {type} parameters -  details
 * @throws {type} details
 */
exports.functionName = function functionName(parameters) {
    //Do some stuff
    if (/*Condition*/false) {
        throw {
            name: "Name",
            message: "Message details",
            toString: function () {
                return this.name + ": " + this.message;
            }
        }
        //DO SOME MORE STUFF
        //general commenting
        helperFunction(/*parameter*/);
    }
}
/**
 * Function details
 * @param {type} parameters -  details
 * @throws {type} details
 */
function helperFunction(parameters) {

}

//NB make sure that you use ** otherwise jsdoc will not pick up the commenting