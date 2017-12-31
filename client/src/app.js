import ko from 'knockout';

import loginTemplate from './templates/login.html';
import './styles/index.scss';
import Controller from './controller';
import loginView from './login';
import './extenders/validations';

class App {
  constructor() {
    this.controller = new Controller({
      views: [
        {
          name: 'login',
          componentConfig: {
            viewModel: loginView,
            template: loginTemplate,
          },
          routes: ['/login'],
        },
      ],
      defaultView: {
        name: 'login',
        params: {},
      },
    });
  }
}

ko.applyBindings(new App());
