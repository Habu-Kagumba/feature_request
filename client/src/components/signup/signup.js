/* eslint-disable object-curly-newline */

import ko from 'knockout';
import { connect } from 'knockout-store';
import _ from 'lodash';

const ERRORS = {
  username: {
    requiredError: 'Username field is required.',
    matchError: 'Username must be between 3 and 25 in length and only contain letters, digits and the characters _ and -.',
    availableError: 'Username already exists.',
  },
  email: {
    requiredError: 'Email field is required.',
    matchError: 'Email is not valid.',
    availableError: 'Email already registered.',
  },
  password: {
    requiredError: 'Password field is required.',
    confirmError: 'Passwords do not match.',
    matchError: 'Password too short. Minimum length is 8.',
  },
  role: {
    requiredError: 'Role field is required.',
  },
};

class Signup {
  constructor(params) {
    this.params = params;

    this.username = ko.observable().extend({
      required: { message: ERRORS.username.requiredError },
      alphanumeric: { message: ERRORS.username.matchError },
      availability: { message: ERRORS.username.availableError, model: 'users', exist: false },
    });
    this.email = ko.observable().extend({
      required: { message: ERRORS.email.requiredError },
      availability: { message: ERRORS.email.availableError, model: 'users', exist: false },
      email: { message: ERRORS.email.matchError },
    });
    this.password = ko.observable().extend({
      required: { message: ERRORS.password.requiredError },
      minLength: { message: ERRORS.password.matchError, min: 8 },
    });
    this.confirmPassword = ko.observable().extend({
      required: { message: ERRORS.password.requiredError },
      passwordMatch: { message: ERRORS.password.confirmError, element: 'password' },
    });
    this.role = ko.observable().extend({ required: { message: ERRORS.role.requiredError } });

    this.onUsernameKeyup = ko.observable(false);
    this.onEmailKeyup = ko.observable(false);
    this.onPasswordKeyup = ko.observable(false);
    this.onConfirmPasswordFocus = ko.observable(false);
    this.onRoleChange = ko.observable(false);

    this.isAuthenticated = this.params.isAuthenticated;
    this.roles = this.params.roles;
  }

  showUsernameStatus() {
    if (!_.isUndefined(this.username())) this.onUsernameKeyup(true);
  }

  showEmailStatus() {
    if (!_.isUndefined(this.email())) this.onEmailKeyup(true);
  }

  showPasswordStatus() {
    if (!_.isUndefined(this.password())) this.onPasswordKeyup(true);
  }

  showConfirmPasswordStatus() {
    if (!_.isUndefined(this.password())) this.onConfirmPasswordFocus(true);
  }

  showRoleStatus() {
    if (!_.isUndefined(this.role())) this.onRoleChange(true);
  }

  userAuthenticated() {
    return (this.isAuthenticated() === 'true');
  }

  allValid() {
    const eventChecks = (this.onEmailKeyup() && this.onUsernameKeyup() &&
      this.onPasswordKeyup() && this.onConfirmPasswordFocus() && this.onRoleChange());

    const inputChecks = (this.username.errors().length === 0 &&
      this.email.errors().length === 0 && this.role.errors().length === 0 &&
      this.password.errors().length === 0 && this.confirmPassword.errors().length === 0);

    return eventChecks && inputChecks;
  }

  registerUser() {
    if (!this.allValid()) return;

    const payload = {
      username: this.username(),
      email: this.email(),
      password: this.password(),
      role: this.role(),
    };

    fetch('/auth/signup', {
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
        if (_.indexOf([201, 202], respObj.status) > -1) {
          window.location.href = '#/login';
        } else {
          this.params.showFlash(true);
          this.params.flashClass('is-danger');
          this.params.flashMessage(respObj.data.message);
        }
      });
  }
}

function mapStateParams({ isAuthenticated, showFlash, flashClass, flashMessage, roles }) {
  return { isAuthenticated, showFlash, flashClass, flashMessage, roles };
}

export default connect(mapStateParams)(Signup);
