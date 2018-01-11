import { Selector } from 'testcafe';

import { Page } from './models';

const { TEST_URL } = process.env;
const page = new Page();

fixture('Landing page')
  .page(`${TEST_URL}/`);

test('Should be able to get to the Landing page', async (t) => {
  await t
    .expect(Selector('h1').withText('Feature Request Application').exists).ok()
    .expect(Selector('h2').withText('Create client feature requests easily and conviniently.').exists).ok()
    .expect(page.homeLink.visible).ok()
    .expect(page.signupLink.visible).ok()
    .expect(page.loginLink.visible).ok()
    .expect(page.logoutLink.visible).notOk();
});

