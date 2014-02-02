/*!
 * vizabi.js
 */

(function (root, factory) {

    if (typeof module === "object" && module && typeof module.exports === "object") {
        // Expose vizabi as module.exports in loaders that implement the Node
        // module pattern (including browserify). Do not create the global, since
        // the user will be storing it themselves locally, and globals are frowned
        // upon in the Node module world.
        module.exports = factory();
    } else {
        // Otherwise expose vizabi to the global object as usual
        window.vizabi = factory();

        // Register as a named AMD module, since vizabi can be concatenated with other
        // files that may use define, but not via a proper concatenation script that
        // understands anonymous AMD modules. A named AMD is safest and most robust
        // way to register. Lowercase vizabi is used because AMD module names are
        // derived from file names, and vizabi is normally delivered in a lowercase
        // file name. Do this after creating the global so that if an AMD module wants
        // to call noConflict to hide this version of vizabi, it will work.
        if (typeof define === "function" && define.amd) {
            define("vizabi", [], factory);
        }
    }

}(this, function () {


