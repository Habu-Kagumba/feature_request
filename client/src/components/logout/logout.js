/* eslint-disable no-return-assign */
/* eslint-disable object-curly-newline */

import { connect } from 'knockout-store';

import { router } from '../../utils/controller';

class Logout {
  constructor(params) {
    this.params = params;

    this.isAuthenticated = this.params.isAuthenticated;
    this.logoutUser();
  }

  logoutUser() {
    const authToken = window.localStorage.getItem('authToken');

    fetch('/auth/logout', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      }),
    })
      .then((response) => {
        return response.json().then(data => ({
          data,
          status: response.status,
        }));
      })
      .then((respObj) => {
        this.params.showFlash(true);
        this.params.flashClass((respObj.status === 200) ? 'is-success' : 'is-danger');
        this.params.flashMessage(respObj.data.message);

        this.isAuthenticated(false);
        window.localStorage.removeItem('authToken');
        router.navigate('/login');
      });
  }
}

function mapStateParams({ isAuthenticated, showFlash, flashClass, flashMessage }) {
  return { isAuthenticated, showFlash, flashClass, flashMessage };
}

export default connect(mapStateParams)(Logout);
