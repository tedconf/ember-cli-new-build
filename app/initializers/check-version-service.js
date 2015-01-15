import CheckVersionService from 'ember-cli-new-build/services/check-version';
import environment from '../config/environment';

export function initialize(container, application) {
  var service;

  application.register(
    'service:new-build-check-version',
    CheckVersionService,
    { singleton: true }
  );

  application.inject('service:new-build-check-version', 'router', 'router:main');

  service = container.lookup('service:new-build-check-version');
  service.set('environment', environment);
  service.check();
}

export default {
  name: 'check-version-service',
  initialize: initialize
};
