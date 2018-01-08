import ko from 'knockout';
import _ from 'lodash';
import { setState } from 'knockout-store';

// Extenders
import './extenders/validation';
import './extenders/localStorage';

import dummyData from './data/data';
import './components/app';

ko.deferUpdates = true;

const state = {
  isAuthenticated: ko.observable().extend({ localStore: 'isAuthenticated' }),
  showFlash: ko.observable().extend({ localStore: 'showFlash' }),
  flashClass: ko.observable().extend({ localStore: 'flashClass' }),
  flashMessage: ko.observable().extend({ localStore: 'flashMessage' }),
  roles: ko.observableArray([]).extend({ localStore: 'roles' }),
  clients: ko.observableArray([]).extend({ localStore: 'clients' }),
  productAreas: ko.observableArray([]).extend({ localStore: 'productAreas' }),
};

setState(state);

// Simulate Data Fetch TOREMOVE!!!!
setTimeout(() => {
  const observedRoles = _.map(dummyData.roles, ({ id, title }) => {
    return {
      id: ko.observable(id),
      title: ko.observable(title),
    };
  });
  const observedProductAreas = _.map(dummyData.productAreas, ({ id, title }) => {
    return {
      id: ko.observable(id),
      title: ko.observable(title),
    };
  });
  const observedClients = _.map(dummyData.clients, ({ id, name, featureRequests }) => {
    return {
      id: ko.observable(id),
      name: ko.observable(name),
      featureRequests: ko.observableArray(featureRequests),
    };
  });

  state.roles(observedRoles);
  state.clients(observedClients);
  state.productAreas(observedProductAreas);
}, 100);

ko.applyBindings();
