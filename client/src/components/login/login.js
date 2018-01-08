/* eslint-disable object-curly-newline */

import ko from 'knockout';
import { connect } from 'knockout-store';
import _ from 'lodash';

import { router } from '../../utils/controller';

const ERRORS = {
  usernameEmail: {
    requiredError: 'Username or Email field is required.',
    availableError: 'Username or Email does not exist.',
  },
  password: {
    requiredError: 'Password field is required',
  },
};

class Login {
  constructor(params) {
    this.params = params;

    this.usernameEmail = ko.observable().extend({
      required: { message: ERRORS.usernameEmail.requiredError },
      availability: { message: ERRORS.usernameEmail.availableError, model: 'users', exist: true },
    });
    this.password = ko.observable().extend({
      required: { message: ERRORS.password.requiredError },
    });

    this.onUsernameEmailKeyup = ko.observable(false);
    this.onPasswordKeyup = ko.observable(false);

    this.isAuthenticated = this.params.isAuthenticated;
  }

  showUsernameEmailStatus() {
    if (!_.isUndefined(this.usernameEmail())) this.onUsernameEmailKeyup(true);
  }

  showPasswordStatus() {
    if (!_.isUndefined(this.password())) this.onPasswordKeyup(true);
  }

  allValid() {
    const eventChecks = (this.onUsernameEmailKeyup() && this.onPasswordKeyup());
    const inputChecks = (this.usernameEmail.errors().length === 0 &&
      this.password.errors().length === 0);

    return eventChecks && inputChecks;
  }

  loginUser() {
    if (!this.allValid()) return;

    const payload = {
      username: this.usernameEmail(),
      password: this.password(),
    };

    fetch('/auth/login', {
      method: 'POST',
      body: ko.toJSON(payload),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((response) => {
        return response.json().then(data => ({
          data,
          status: response.status,
        }));
      })
      .then((respObj) => {
        if (respObj.status === 200) {
          window.localStorage.setItem('authToken', respObj.data.auth_token);
          this.isAuthenticated(true);
          router.navigate('/');
        } else {
          this.params.showFlash(true);
          this.params.flashClass('is-danger');
          this.params.flashMessage(respObj.data.message);
        }
      });
  }
}

function mapStateParams({ isAuthenticated, showFlash, flashClass, flashMessage }) {
  return { isAuthenticated, showFlash, flashClass, flashMessage };
}

export default connect(mapStateParams)(Login);
