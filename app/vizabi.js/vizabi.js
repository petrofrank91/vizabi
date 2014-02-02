window.vizabi = window.vizabi || {};
(function () {

    function getScript(attr) {
        document.write('<' + 'script ' + attr +
            ' type="text/javascript"><' + '/script>');
    }

    var loadScriptTime = (new Date).getTime();
    getScript('{{vizabi-script-tag-attributes}}');

    function addEvent(evnt, func) {
        console.log('addEvent', vizabi, window.vizabi);
        if (this.addEventListener) { // W3C DOM
            this.addEventListener(evnt, func, false);
        } else if (this.attachEvent) { // IE DOM
            this.attachEvent("on" + evnt, func);
        } else { // No much to do
            this[evnt] = func;
        }
    }

    vizabi.ready = function (callback) {
        addEvent.call(window, 'vizabiLoaded', function (e) {
            callback();
        });
    }

})();
