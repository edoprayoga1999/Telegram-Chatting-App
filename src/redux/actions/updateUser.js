/* eslint-disable no-undef */
import axios from 'axios';

export const updateProfile = (data, token) => {
	return new Promise((resolve, reject) => {
		axios.put(`${process.env.REACT_APP_BACKEND_URL}/user/update`, data, {
			headers: {
				token
			}
		})
			.then((result) => {
				resolve(result.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updatePhoto = (data, token) => {
	return new Promise((resolve, reject) => {
		axios.put(`${process.env.REACT_APP_BACKEND_URL}/user/update/photo`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
				token
			}
		})
			.then((result) => {
				resolve(result.data);
			})
			.catch((err) => {
				reject(err);
			});
	});

};