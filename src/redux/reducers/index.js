import { combineReducers } from 'redux';
import userProfile from './userProfile';
import listUser from './listUser';
import myProfile from './myProfile';

export default combineReducers({
	userProfile,
	listUser,
	myProfile
});
