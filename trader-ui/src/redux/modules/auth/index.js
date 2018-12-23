const AUTHENTICATED = 'auth://authenticated';

const authenticated = (accessToken) => ({type: AUTHENTICATED, accessToken});


const INITIAL_STATE = {
    accessToken: null
};

function auth(state = INITIAL_STATE, action) {
    switch (action.type) {
        case AUTHENTICATED: {
            const {accessToken} = action;
            return {
                ...state,
                accessToken
            };
        }
        default:
            return state;
    }
}


export {authenticated};
export default auth;
