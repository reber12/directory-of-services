import { combineReducers } from 'redux';

import loginAuth from './loginAuth';
import flashMessages from './flashMessages';
import { filteredBranchsByCategory, organisationsList, listOfUsers } from './storeApiData';

export default combineReducers({
  loginAuth,
  flashMessages,
  filteredBranchsByCategory,
  organisationsList,
  listOfUsers
});
