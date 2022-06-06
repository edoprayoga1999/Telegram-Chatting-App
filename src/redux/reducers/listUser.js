const initialState = {
	data: [],
	isLoading: false,
	isError: false,
	errorMessage: ''
};

// pending, fulfilled, reject
const listUser = (state = initialState, action) => {
	switch (action.type) {
	case 'GET_LIST_USER_PENDING':
		return { ...state, isLoading: true };
	case 'GET_LIST_USER_FULFILLED':
		return { ...state, isLoading: false, isError: false, data: action.payload.data.data };
	case 'GET_LIST_USER_REJECTED':
		console.log(action.payload);
		return { ...state, isLoading: false, isError: true, errorMessage: action.payload.response.data.message };
	default:
		return state;
	}
};
export default listUser;
