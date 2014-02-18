define([
    ],
    function() {
        var cache;
        var state;

        function init(c, s) {
            cache = c;
            state = s;
        }

        function getBubbleSize(value, scale) {
            return Math.sqrt(+value / +scale / Math.PI);
        }

        function transition(indicator, geo) {
            var d = cache[indicator][geo];

            var past = d[Math.floor(+state.year)];
            var future = d[Math.ceil(+state.year)];
            var factor = +state.year % 1;
            
            return past + (future - past) * factor;
        }

        return {
            init: init,
            getBubbleSize: getBubbleSize,
            getValue: transition
        }
    }
)