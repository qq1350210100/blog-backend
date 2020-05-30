"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToBoolean = void 0;
exports.mapToBoolean = key => {
    const values = {
        trues: ['true', 'Y', 'y', '1'],
        falses: ['false', 'N', 'n', '0']
    };
    const belongToTrue = values.trues.some(item => key === item);
    const belongToFalse = values.falses.some(item => item === key);
    if (belongToTrue) {
        return true;
    }
    else if (belongToFalse) {
        return false;
    }
    else {
        return key;
    }
};
