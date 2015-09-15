define([
    'jquery',
    'underscore',
    'backbone',
    // Pull in the Collection module from above,
    'collections/recipes',
    'views/flash/FlashView',
    'views/recipes/AddPictureView',
    'text!templates/recipes/newRecipeTemplate.html',
    'domready',
    'foundation.slider'
], function($, _, Backbone, Recipes, FlashView, AddPictureView, newRecipeTemplate, domready) {

    var NewRecipeView = Backbone.View.extend({
        el: $("#container"),

        events: {
            "submit #new-recipe-form": "addRecipe"
        },

        render: function(regions) {

            var data = {
                regions: regions.models,
                data: null,
                _: _
            };

            var compiledTemplate = _.template(newRecipeTemplate)(data);
            this.$el.html(compiledTemplate);

            domready(function() {
                $(document).foundation('slider', 'reflow');
            });
        },

        addRecipe: function(e) {
            e.preventDefault();

            $(document).trigger('close.fndtn.alert');

            var recipe = {};

            $('#new-recipe-form').serializeArray().forEach(function(el) {
                var currentObject = {};

                currentObject[el.name] = el.value;

                recipe = $.extend({}, recipe, currentObject);
            });

            var RecipeCollection = new Recipes();

            RecipeCollection.create(recipe, {
                success: function(model, resp) {
                    // Let's pass the model id and name to the second form
                    // I.E. form for adding a picture
                    AddPictureView.render(resp.id, resp.name);
                    //var flash = FlashView.render('success', 'Succesfully inserted new recipe');

                },
                error: function(model, error) {

                    var errorMsg = '';
                    errorMsg += '<b>' + error.status + '</b>';
                    errorMsg += ' Something went wrong. --->';
                    for (var i = 0; i < error.responseJSON.error.length; i++) {
                        errorMsg += ' <b>' + error.responseJSON.error[i] + '</b>';
                    }
                    var flash = FlashView.render('error', errorMsg);
                }
            });

        }
    });
    return new NewRecipeView();

});
