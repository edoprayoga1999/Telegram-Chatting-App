const initialState = {
	data: [],
	isLoading: false,
	isError: false,
	errorMessage: ''
};

// pending, fulfilled, reject
const myProfile = (state = initialState, action) => {
	switch (action.type) {
	case 'GET_MY_PROFILE_PENDING':
		return { ...state, isLoading: true };
	case 'GET_MY_PROFILE_FULFILLED':
		return { ...state, isLoading: false, isError: false, data: action.payload.data.data };
	case 'GET_MY_PROFILE_REJECTED':
		return { ...state, isLoading: false, isError: true, errorMessage: action.payload.err.response.data.message };
	default:
		return state;
	}
};
export default myProfile;
