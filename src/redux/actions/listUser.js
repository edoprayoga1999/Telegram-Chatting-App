/* eslint-disable no-undef */
import axios from 'axios';
export const getListUser = (token, name) => {
	return {
		type: 'GET_LIST_USER',
		payload: axios({
			method: 'GET',
			url: `${process.env.REACT_APP_BACKEND_URL}/user/list?name=${name}`,
			headers: {
				token
			}
		})
	};
};