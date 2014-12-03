define([
    'components/_gapminder/buttonlist/dialogs/dialog',
    'lodash',
    'jquery'
], function(Dialog, _, $) {

    var selector;

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
            selector = this.element.select("vzb-entity-picker");
            
            $(".vzb-select dd ul li a").on('click', function() {
                $(".vzb-select dd ul").hide();
            });

            function getSelectedValue(id) {
                return $("#" + id).find("dt a span.value").html();
            }

            $('.vzb-select-list input[type="checkbox"]').on('click', function() {

                var title = $(this).closest('.vzb-select-list').find('input[type="checkbox"]').val(),
                    title = $(this).attr('data') + ",";

                if ($(this).is(':checked')) {
                    var html = '<span title="' + title + '">' + title + '</span>';
                    $('.vzb-selected-entities').append(html);
                    $(".hida").hide();
                } else {
                    $('span[title="' + title + '"]').remove();
                    var ret = $(".hida");
                    $('.vzb-select dt a').append(ret);

                }
            });

            this._super();
        },

        update: function() {
            var _this = this,
                data = this.model.data.getItems(),
                entities = this.model.state.entities.selected;

            _.each(data, function(element) {
                _this.template_data.options.push({
                    'id': element['geo'],
                    'name': element['geo.name'],
                    'selected': (entities.indexOf(element['geo']) >= 0 ? true : false)
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