import { connect } from 'knockout-store';

import './app.scss';
import { Controller } from '../../utils/controller';

class App {
  constructor(params) {
    this.params = params;
    this.isAuthenticated = this.params.isAuthenticated;

    this.controller = new Controller({
      views: [
        {
          name: 'landing',
          routes: ['/'],
        },
        {
          name: 'login',
          routes: ['/login'],
        },
        {
          name: 'logout',
          routes: ['/logout'],
        },
        {
          name: 'signup',
          routes: ['/signup'],
        },
      ],
      defaultView: {
        name: 'landing',
        params: {},
      },
    });
  }
}

function mapStateParams({ isAuthenticated }) {
  return { isAuthenticated };
}

export default connect(mapStateParams)(App);
