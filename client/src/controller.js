/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

import ko from 'knockout';
import Grapnel from 'grapnel';

class Controller {
  constructor(config) {
    this.config = config;
    this.defaults = {
      views: [],
    };
    this.settings = ko.utils.extend(this.defaults, this.config || {});
    this.router = new Grapnel();

    this.viewName = ko.observable(this.settings.defaultView.name);
    this.viewParams = ko.observable(this.settings.defaultView.params || {});
    this.isTransitioning = ko.observable(false);

    this.init();
  }

  loadView(viewName, routeParams) {
    this.isTransitioning(true);

    setTimeout(() => {
      this.viewParams(routeParams);
      this.viewName(viewName);
      this.isTransitioning(false);
    }, 0);
  }

  init() {
    ko.utils.arrayForEach(this.settings.views, (v) => {
      ko.components.register(v.name, v.componentConfig);
      if (v.routes && v.routes.length > 0) {
        ko.utils.arrayForEach(v.routes, (r) => {
          this.router.get(r, (req, _e) => {
            this.loadView(v.name, req.params);
          });
        });
      }
    });
  }
}

export { Controller as default };
