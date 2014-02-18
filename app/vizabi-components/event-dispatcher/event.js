define([
    ],
    function() {
        function dispatch(element, eventName, args) {
            // Create the event.
            var event = document.createEvent('Event');

            // Define that the event name is `e`.
            event.initEvent(eventName, true, true);

            // target can be any Element or other EventTarget.
            element.dispatchEvent(event);
        }

        return {
            dispatch: dispatch
        }
    }
);
