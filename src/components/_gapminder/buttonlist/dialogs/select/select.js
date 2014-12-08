define([
    'components/_gapminder/buttonlist/dialogs/dialog',
    'lodash',
    'jquery'
], function(Dialog, _, $) {

    var SelectDialog = Dialog.extend({
        /**
         * Initializes the dialog component
         * @param config component configuration
         * @param context component context (parent)
         */
        init: function(config, parent) {
            this.name = 'select';
            this.template_data = {
                options: []
            };

            this._super(config, parent);
        },


        postRender: function() {
            this.selector = this.element.select("vzb-entity-picker");
        },

        //TODO: check why update is being called multiple times
        update: function() {
            var _this = this,
                data = this.model.data.getItems(),
                entities = this.model.state.entities.selected;

            var list = this.element.select('.vzb-select-list')
                .select('ul');

            var labels = list.selectAll('li')
                .data(data)
                .enter()
                .append('li')
                .append('label')
                .on('click', function(d, i) {
                    //_this.model.state.entities.selectEntity(this.value);
                    var label = _this.element.select('.vzb-selected-entities'),
                        input = d3.select(this).select('input'),
                        span = d3.select(this).selectAll('span');

                    if (input.property('checked')) {
                        label.append('span')
                            .attr('title', d['geo.name'])
                            .html(d['geo.name'] + ",");
                    } else {
                        label.selectAll('span').filter(function() {
                            return this.title === d['geo.name'];
                        }).remove();
                    }
                })
                .on('mouseover', function(d, i) {
                    //_this.model.state.entities.hoverEntity(d);
                })
                .on('mouseover', function(d, i) {
                    //_this.model.state.entities.hoverEntity(d);
                });


            labels.append('input')
                .attr('type', 'checkbox')
                .attr('value', function(d)  {
                    return d['geo'];
                })
                .attr('name', function(d) {
                    return d['geo.name'];
                })
                .attr('data', function(d) {
                    return d['geo.name'];
                });

            labels.append('span').text(function(d) {
                return d['geo.name'];
            });

            this._super();
        }

    });

    return SelectDialog;
});