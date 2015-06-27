function serializeObject(object) {
    var result = [];
    return JSON.stringify(object, function(key, value) {
        if (value = toJsonReplacer(key, value), isObject(value)) {
            if (result.indexOf(value) >= 0) return "<<already seen>>";
            result.push(value);
        }
        return value;
    });
}
