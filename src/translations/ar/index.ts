
import { common } from './common';
import { auth } from './auth';
import { dashboard } from './dashboard';
import { navigation } from './navigation';
import { trips } from './trips';
import { users } from './users';
import { companies } from './companies';
import { vans } from './vans';

export const ar = {
  ...common,
  ...auth,
  ...dashboard,
  ...navigation,
  ...trips,
  ...users,
  ...companies,
  ...vans,
};
