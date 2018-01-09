import { Selector } from 'testcafe';

const { TEST_URL } = process.env;

fixture('Landing page')
  .page(`${TEST_URL}/`);

test('Should be able to get to the Landing page', async (t) => {
  await t
    .expect(Selector('H1').withText('Feature Request Application').exists).ok();
});
