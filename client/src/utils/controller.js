/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

import ko from 'knockout';
import Grapnel from 'grapnel';

const router = new Grapnel();

class Controller {
  constructor(config) {
    this.config = config;
    this.defaults = {
      views: [],
    };
    this.settings = ko.utils.extend(this.defaults, this.config || {});

    this.viewName = ko.observable(this.settings.defaultView.name);
    this.viewParams = ko.observable(this.settings.defaultView.params || {});

    this.init();
  }

  loadView(viewName, routeParams) {
    this.viewParams(routeParams);
    this.viewName(viewName);
  }

  init() {
    ko.utils.arrayForEach(this.settings.views, (v) => {
      if (v.routes && v.routes.length > 0) {
        ko.utils.arrayForEach(v.routes, (r) => {
          router.get(r, (req) => {
            this.loadView(v.name, req.params);
          });
        });
      }
    });
  }
}

export { Controller, router };
