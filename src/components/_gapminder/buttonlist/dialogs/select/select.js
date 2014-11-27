define([
    'components/_gapminder/buttonlist/dialogs/dialog',
    'lodash'
], function(Dialog, _) {

    var selector,
        data_list;

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
            selector = this.element.select("vzb-entity-picker"),
                data_list = this.element.select("entity_selector");

            this._super();
        },

        update: function() {
            var _this = this,
                data = this.model.data.getItems();

            _.each(data, function(element) {
                _this.template_data.options.push({
                    'name': element['geo'],
                    'value': element['geo.name'],
                    'selected': false
                });
            });

            // make sure duplicats are removed
            this.template_data.options = _.uniq(this.template_data.options, 'name');

            // TODO: better to perform this with D3
            this.loadTemplate().then(function() {
                _this.postRender();
            });
        }

    });

    return SelectDialog;
});