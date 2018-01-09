/* eslint-disable newline-per-chained-call */

import { Selector } from 'testcafe';

const { TEST_URL } = process.env;

fixture('Navigation')
  .page(`${TEST_URL}/`);

test('Should be able to navigate to the Signup page', async (t) => {
  const signUpLink = Selector('a').withText('Signup');
  const emailLabel = Selector('label').withText('Email');
  const usernameLabel = Selector('label').withText('Username');
  const passwordLabel = Selector('label').withText('Password');
  const confirmPasswordLabel = Selector('label').withText('Confirm Password');
  const roleLabel = Selector('label').withText('Role');

  await t
    .click(signUpLink)
    .expect(usernameLabel.exists).ok()
    .expect(emailLabel.exists).ok()
    .expect(passwordLabel.exists).ok()
    .expect(confirmPasswordLabel.exists).ok()
    .expect(roleLabel.exists).ok();
});

test('Should navigate to the Login page', async (t) => {
  const loginLink = Selector('a').withText('Login');
  const usernameEmailLabel = Selector('label').withText('Username / Email');

  await t
    .click(loginLink)
    .expect(usernameEmailLabel.exists).ok();
});

test('Should navigate to the Landing/Home page', async (t) => {
  const homeLink = Selector('a').withText('Home');
  const homeTitle = Selector('h1').withText('Feature Request Application');
  const homeSubtitle = Selector('h2').withText('Create client feature requests easily and conviniently.');

  await t
    .click(homeLink)
    .expect(homeTitle.exists).ok()
    .expect(homeSubtitle.exists).ok();
});
