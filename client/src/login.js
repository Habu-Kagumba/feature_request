import ko from 'knockout';

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
  role: {
    requiredError: 'Role field is required',
  },
};

class loginView {
  constructor() {
    this.username = ko.observable().extend({
      required: { message: ERRORS.username.requiredError },
      alphanumeric: { message: ERRORS.username.matchError },
      availability: { message: ERRORS.username.availableError, model: 'users' },
    });
    this.email = ko.observable().extend({
      required: { message: ERRORS.email.requiredError },
      availability: { message: ERRORS.email.availableError, model: 'users' },
      email: { message: ERRORS.email.matchError },
    });
    this.role = ko.observable().extend({ required: { message: ERRORS.role.requiredError } });

    this.onUsernameKeyup = ko.observable(false);
    this.onEmailKeyup = ko.observable(false);
    this.onRoleChange = ko.observable(false);
    this.inputClass = ko.pureComputed(() => (this.username.errors().length === 0 ? 'is-success' : 'is-danger'), this);

    this.roles = ko.pureComputed(() => ['Role 1', 'Role 2', 'Role 3'], this);
  }

  showUsernameStatus() {
    if (this.username() !== undefined) this.onUsernameKeyup(true);
  }

  showEmailStatus() {
    if (this.email() !== undefined) this.onEmailKeyup(true);
  }

  showRoleStatus() {
    if (this.role() !== undefined) this.onRoleChange(true);
  }

  allValid() {
    return (this.onEmailKeyup() && this.onUsernameKeyup() && this.onRoleChange() &&
      this.username.errors().length === 0 && this.email.errors().length === 0 &&
      this.role.errors().length === 0);
  }

  loginUser() {
    if (!this.allValid()) return;

    const payload = {
      username: this.username(),
      email: this.email(),
      role: this.role(),
    };

    fetch('http://192.168.99.100/users/', {
      method: 'POST',
      body: ko.toJSON(payload),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => {
      if (response.ok) {
        location.href = '/';
      }
    });
  }
}

export { loginView as default };
