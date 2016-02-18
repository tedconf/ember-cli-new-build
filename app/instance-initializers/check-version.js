import environment from '../config/environment';

export function initialize(container) {
  const service = container.lookup('service:check-version');
  service.set('environment', environment);
  service.check();
}

export default {
  name: 'check-version',
  initialize
};
