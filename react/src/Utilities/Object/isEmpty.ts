function isEmpty<T extends object>(obj: T | undefined) {
    if (!obj) {
        return false;
    }

    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }

    return true;
}

export default isEmpty;
