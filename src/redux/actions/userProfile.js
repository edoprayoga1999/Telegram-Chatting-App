/* eslint-disable no-undef */
import axios from 'axios';

export const getUserProfile = (id, token) => {
	return {
		type: 'GET_USER_PROFILE',
		payload: axios({
			method: 'GET',
			url: `${process.env.REACT_APP_BACKEND_URL}/user/profile/${id}`,
			headers: {
				token
			}
		})
	};
};