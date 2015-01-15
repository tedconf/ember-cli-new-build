import Ember from 'ember';

var getMetaTag = function(name) {
  return Ember.$('meta[name=' + name + ']').attr("content");
};

var computedMetaTag = function(name) {
  return function() {
    return getMetaTag(name);
  }.property();
};

export default Ember.Object.extend({
  router: null,
  request: null,
  environment: null,
  alertedRouter: false,

  currentVersion: computedMetaTag('front-end-build-version'),
  url: computedMetaTag('front-end-build-url'),

  isPollable: function() {
    var env = this.get('environment.environment');

    return env !== "development" &&
      env !== "test" &&
      this.get('url') &&
      this.get('currentVersion');
  }.property('currentVersion', 'url'),

  check: function() {
    var url = this.get('url'),
        currentVersion = this.get('currentVersion'),
        isPollable = this.get('isPollable'),
        alertedRouter = this.get('alertedRouter'),
        service = this,
        request;

    if (isPollable) {
      request = Ember.$.ajax({
        type: 'get',
        url: url
      });

      this.set('request', request);

      request.then(function(response) {
        if (response && response.version && !alertedRouter && response.version > currentVersion) {
          service.newVersionAvailable(response.version);
        } else {
          Ember.run.later(service, 'check', 30000);
        }
      });
    }
  },

  newVersionAvailable: function(version) {
    this.set('alertedRouter', true);
    this.get('router').send('newBuild', version);
  }
});
