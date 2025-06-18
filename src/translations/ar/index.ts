
import { navigation } from './navigation';
import { common } from './common';
import { auth } from './auth';
import { dashboard } from './dashboard';
import { companies } from './companies';
import { users } from './users';
import { vans } from './vans';
import { trips } from './trips';

export const ar = {
  ...navigation,
  ...common,
  ...auth,
  ...dashboard,
  ...companies,
  ...users,
  ...vans,
  ...trips,
};
