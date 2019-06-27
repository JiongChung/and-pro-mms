import { combineReducers } from 'redux';
import {
    userGrade,
    oilCardType
} from './actions';

const userGradeList = (state = [], action) => {
    if(action.type === userGrade.text){
        return action.list;
    }
    return state;
}

const oilCardTypeList = (state = [], action) => {
    if(action.type === oilCardType.text){
        return action.list;
    }
    return state;
}

const reducer = combineReducers({
    userGradeList,
    oilCardTypeList
});
    
export default reducer;