import { Page, factories } from './models';
import { signupUser, loginUser, logoutUser } from './helpers';

const page = new Page();
const { user } = factories();

fixture('Logout page');

test('Should logout a user', async (t) => {
  await signupUser(t, { ...user });
  await loginUser(t, { ...user });
  await logoutUser(t);

  await t
    .expect(page.logoutLink.visible).notOk();
});
