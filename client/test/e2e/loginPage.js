import { Page, factories } from './models';
import { signupUser, loginUser, logoutUser } from './helpers';

const { TEST_URL } = process.env;

const page = new Page();
const { user } = factories();

fixture('Login page')
  .page(`${TEST_URL}#/login`);

test('Should login a user', async (t) => {
  await signupUser(t, { ...user });
  await loginUser(t, { ...user });
  await logoutUser(t);

  await t
    .expect(page.logoutLink.visible).notOk();
});
