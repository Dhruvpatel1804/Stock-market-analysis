// project imports
import config from 'config';

// action - state management
import * as actionTypes from './actions';

export const initialState = {
    isOpen: [], // for active default menu
    defaultId: 'default',
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
    nifty50: 0,
    nifty50high: 0,
    nifty50low: 0
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
    let id;
    switch (action.type) {
        case actionTypes.MENU_OPEN:
            id = action.id;
            return {
                ...state,
                isOpen: [id]
            };
        case actionTypes.SET_MENU:
            return {
                ...state,
                opened: action.opened
            };
        case actionTypes.SET_FONT_FAMILY:
            return {
                ...state,
                fontFamily: action.fontFamily
            };
        case actionTypes.SET_BORDER_RADIUS:
            return {
                ...state,
                borderRadius: action.borderRadius
            };
        case 'nifty50':
            return {
                ...state,
                nifty50: action.payload
            };
        case 'nifty50high':
            return {
                ...state,
                nifty50high: action.payload
            };
        case 'nifty50low':
            return {
                ...state,
                nifty50low: action.payload
            };
        default:
            return state;
    }
};

export default customizationReducer;
