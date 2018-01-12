import { Page, factories } from './models';
import { signupUser } from './helpers';

const { TEST_URL } = process.env;

const page = new Page();

fixture('Signup page')
  .page(`${TEST_URL}#/signup`);

test('Should register a user', async (t) => {
  await signupUser(t, { ...factories().user });

  await t
    .expect(page.roleInput.exists).notOk()
    .expect(page.confirmPasswordInput.exists).notOk();
});
