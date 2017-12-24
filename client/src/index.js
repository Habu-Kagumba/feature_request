import ko from 'knockout';
import _ from 'lodash';

import './styles/index.scss';

class UsersViewModel {
  constructor() {
    this.users = ko.observableArray([]);
    this.constructor.getUsers()
      .then(data => this.loadUsers(data))
      .catch(reason => console.error(reason.message));
  }

  loadUsers(data) {
    _.map(data, (n) => {
      this.users.push({ username: n.username, email: n.email, role: n.role });
    });
  }

  static async getUsers() {
    const data = await (await fetch('/users/')).json();
    return data;
  }
}

ko.applyBindings(new UsersViewModel());
