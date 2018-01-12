import { Page } from './models';

const { TEST_URL } = process.env;

const page = new Page();

export async function signupUser(t, { username, email, password, role }) {
  await t
    .navigateTo(`${TEST_URL}#/signup`)
    .typeText(page.usernameInput, username)
    .typeText(page.emailInput, email)
    .typeText(page.passwordInput, password)
    .typeText(page.confirmPasswordInput, password)
    .click(page.roleInput.select)
    .click(page.roleInput.choose(role))
    .click(page.button);
}

export async function loginUser(t, { email, password }) {
  await t
    .navigateTo(`${TEST_URL}#/login`)
    .typeText(page.usernameEmailInput, email)
    .typeText(page.passwordInput, password)
    .click(page.button);
}

export async function logoutUser(t) {
  await t
    .navigateTo(`${TEST_URL}#/logout`);
}
