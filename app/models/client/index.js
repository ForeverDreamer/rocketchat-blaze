import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import { Users as users } from './models/Users';

const Users = _.extend({}, users, Meteor.users);

export {
    Users,
}
