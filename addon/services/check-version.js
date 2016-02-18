import Ember from 'ember';

var getMetaTag = function(name) {
  return Ember.$('meta[name=' + name + ']').attr("content");
};

var computedMetaTag = function(name) {
  return Ember.computed(function() {
    return getMetaTag(name);
  });
};

export default Ember.Service.extend({
  request: null,
  environment: null,
  isAvailable: false,

  currentVersion: computedMetaTag('front-end-build-version'),
  url: computedMetaTag('front-end-build-url'),

  isPollable: Ember.computed('currentVerison', 'url', function() {
    var env = this.get('environment.environment');

    return env !== "development" &&
      env !== "test" &&
      this.get('url') &&
      this.get('currentVersion');
  }),

  check: function() {
    var url = this.get('url'),
        currentVersion = this.get('currentVersion'),
        isPollable = this.get('isPollable'),
        service = this,
        request;

    if (isPollable) {
      request = Ember.$.ajax({
        type: 'get',
        url: url
      });

      this.set('request', request);

      request.then(function(response) {
        if (response && response.version && response.version > currentVersion) {
          service.set('isAvailable', true);
        } else {
          Ember.run.later(service, 'check', 30000);
        }
      });
    }
  }
});

