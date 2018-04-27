import { combineReducers } from 'redux';
import Web5Reducer from './Web5Reducer';
export default combineReducers({
    //  coool: () =>[]
    auth: Web5Reducer
});