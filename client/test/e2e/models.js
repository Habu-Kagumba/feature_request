import { Selector } from 'testcafe';
import faker from '../libs/faker.min';

const form = Selector('form');

export const factories = () => {
  return {
    user: {
      username: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'Engineer',
    },
  };
};

class Role {
  constructor() {
    this.select = form.find('select[name="role"]');
    this.choose = text => this.select.find('option').withText(text);
  }
}

export class Page {
  constructor() {
    // Form Elements
    this.form = form;
    this.usernameInput = this.form.find('input[name="username"]');
    this.emailInput = this.form.find('input[name="email"]');
    this.usernameEmailInput = this.form.find('input[name="username-email"]');
    this.passwordInput = this.form.find('input[name="password"]');
    this.confirmPasswordInput = this.form.find('input[name="confirm-password"]');
    this.roleInput = new Role();
    this.button = this.form.find('button');

    // Navigation Elements
    this.homeLink = Selector('a').withText('Home');
    this.signupLink = Selector('a').withText('Signup');
    this.loginLink = Selector('a').withText('Login');
    this.logoutLink = Selector('a').withText('Logout');
  }
}
