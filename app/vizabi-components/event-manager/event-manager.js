define([
    ],
    function() {
        'use strict';

        var ev = {};
        
        ev.events = {};
        ev.instances = [];

        function addEvent(context, name, func) {
            if (!context) return;

            if (!context.events[name]) {
                context.events[name] = [];
            }

            if (typeof func === 'function') {
                context.events[name].push(func);
            }
        }

        function register(context, instance) {
            context.instances.push(instance);
        }

        function bind(context, name, func) {
            if (typeof name === 'string') {
                addEvent(context, name, func);
            } else if ((Array.isArray && Array.isArray(name)) ||
                Object.prototype.toString.call(name) === '[object Array]') {
                for (var i = 0; i < name.length; i++) {
                    if (typeof name[i] === 'string') {
                        addEvent(context, name[i], func);
                    }
                }
            }
        }

        function unbind(context, name, func) {
            if (typeof func === 'function') {
                if (typeof name === 'string') {
                    if (context.events[name]) {
                        var evts = context.events[name];

                        while (evts.indexOf(func) !== -1) {
                            evts.splice(evts.indexOf(func), 1);
                        }
                    }
                }
            } else {
                if (typeof name === 'string' && context.events[name]) {
                    context.events[name] = [];
                }
            }
        }

        function trigger(context, name, args) {
            if (typeof name !== 'string' || !context.events[name]) return;

            for (var i = 0; i < context.events[name].length; i++) {
                var func = context.events[name][i];
                func(args);
            }
        }

        ev.bind = function(name, func) {
            bind(this, name, func);
        };

        ev.unbind = function(name, func) {
            unbind(this, name, func);
        };

        ev.unbindAll = function() {
            this.events = {};
        };

        ev.trigger = function(name, args) {
            trigger(this, name, args);

            // Global event triggers event on all instances
            for (var j = 0; j < this.instances; j++) {
                var instance = this.instances[j];
                instance.trigger(name, args);
            }
        };

        ev.instance = function() {
            var instance = {};

            instance.events = {};

            instance.bind = function(name, func) {
                bind(this, name, func);
            }

            instance.unbind = function(name, func) {
               unbind(this, name, func)
            }

            instance.unbindAll = function() {
                this.events = {};
            }

            instance.trigger = function(name, args) {
                trigger(this, name, args);
            }

            register(this, instance);

            return instance;
        }

        return ev;
    }
);
