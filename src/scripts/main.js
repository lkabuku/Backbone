'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var _ = require('underscore');

Backbone.history.start();


var ItemView = Marionette.ItemView.extend({
  tagName: 'li',

  template: _.template('<%= name %>')
});

var ListView = Marionette.CollectionView.extend({
  tagName: 'ul',

  childView: ItemView,

  initialize: function() {
    this.collection = new Backbone.Collection([
      {name: "Tim", age: 5},
      {name: "Ida", age: 26},
      {name: "Rob", age: 55}
    ]);
  }
});

var list = new ListView();
list.render();

$('body').find('.content').append(list.$el.html());

