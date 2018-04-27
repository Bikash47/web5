
const INITIAL_STATE = {data: {},badCell: '', goodCell: '', remark: ""};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case "data":
            return {...state, data: action.payload};
        default:
            return state;
    }
}