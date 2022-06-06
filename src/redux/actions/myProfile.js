/* eslint-disable no-undef */
import axios from 'axios';

export const getMyProfile = (token) => {
	return {
		type: 'GET_MY_PROFILE',
		payload: axios({
			method: 'GET',
			url: `${process.env.REACT_APP_BACKEND_URL}/user/profile`,
			headers: {
				token
			}
		})
	};
};