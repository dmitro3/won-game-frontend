export const isSafeValue = (val, isNumber) => {
    if (val) return val;
    if (isNumber) return 0;
    return '';
}

export const isEmpty = (val) => {
    if (!val) return true;
    if (val.length && val.length > 0) return false;
    if (Object.keys(val).length > 0) return false;

    return true;
}