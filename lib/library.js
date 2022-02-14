// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-charts/blob/main/LICENSE

/** @module lib/library */


// executeScript options defaults
export const defaultMaxStatements = 1e7;


// Function map (name => fn)
export const calcFunctions = {
    'abs': ([number]) => Math.abs(number),
    'acos': ([number]) => Math.acos(number),
    'asin': ([number]) => Math.asin(number),
    'atan': ([number]) => Math.atan(number),
    'atan2': ([number]) => Math.atan2(number),
    'ceil': ([number]) => Math.ceil(number),
    'cos': ([number]) => Math.cos(number),
    'date': ([year, month, day]) => new Date(year, month - 1, day),
    'day': ([datetime]) => datetime.getDate(),
    'encodeURIComponent': ([text]) => encodeURIComponent(text),
    'indexOf': ([text, findText, index = 0]) => text.indexOf(findText, index),
    'fixed': ([number, decimals = 2]) => number.toFixed(decimals),
    'floor': ([number]) => Math.floor(number),
    'hour': ([datetime]) => datetime.getHours(),
    'len': ([text]) => text.length,
    'lower': ([text]) => text.toLowerCase(),
    'ln': ([number]) => Math.log(number),
    'log': ([number, base = 10]) => Math.log(number) / Math.log(base),
    'log10': ([number]) => Math.log10(number),
    'max': (args) => Math.max(...args),
    'min': (args) => Math.min(...args),
    'minute': ([datetime]) => datetime.getMinutes(),
    'month': ([datetime]) => datetime.getMonth() + 1,
    'now': () => new Date(),
    'pi': () => Math.PI,
    'rand': () => Math.random(),
    'replace': ([text, oldText, newText]) => text.replaceAll(oldText, newText),
    'rept': ([text, count]) => text.repeat(count),
    'round': ([number, digits]) => {
        const multiplier = 10 ** digits;
        return Math.round(number * multiplier) / multiplier;
    },
    'second': ([datetime]) => datetime.getSeconds(),
    'sign': ([number]) => Math.sign(number),
    'sin': ([number]) => Math.sin(number),
    'slice': ([text, beginIndex, endIndex]) => text.slice(beginIndex, endIndex),
    'sqrt': ([number]) => Math.sqrt(number),
    'text': ([value]) => `${value}`,
    'tan': ([number]) => Math.tan(number),
    'today': () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    },
    'trim': ([text]) => text.trim(),
    'upper': ([text]) => text.toUpperCase(),
    'value': ([text]) => parseFloat(text),
    'year': ([datetime]) => datetime.getFullYear()
};


// Script function map (name => fn)
export const scriptFunctions = {
    // Array functions
    'arrayCopy': ([array]) => [...array],
    'arrayGet': ([array, index]) => array[index],
    'arrayIndexOf': ([array, value, index = 0]) => array.indexOf(value, index),
    'arrayJoin': ([array, sep]) => array.join(sep),
    'arrayLength': ([array]) => array.length,
    'arrayNew': ([size = 0, value = 0]) => {
        const array = [];
        for (let ix = 0; ix < size; ix++) {
            array.push(value);
        }
        return array;
    },
    'arrayNewArgs': (args) => args,
    'arrayPush': ([array, ...values]) => array.push(...values),
    'arraySet': ([array, index, value]) => {
        array[index] = value;
    },
    'arraySize': ([size = 0, value = 0]) => new Array(size).fill(value),
    'arraySlice': ([text, start, end]) => text.slice(start, end),
    'arraySplit': ([text, sep]) => text.split(sep),

    // Object functions
    'objectCopy': ([obj]) => ({...obj}),
    'objectDelete': ([obj, key]) => {
        delete obj[key];
    },
    'objectGet': ([obj, key]) => obj[key],
    'objectKeys': ([obj]) => Object.keys(obj),
    'objectNew': () => ({}),
    'objectSet': ([obj, key, value]) => {
        obj[key] = value;
    },

    // Debug functions
    'debugLog': ([text], options) => {
        if (options !== null && 'logFn' in options) {
            options.logFn(text);
        }
    },

    // Fetch functions
    'fetchJSON': async ([url], options) => {
        const {fetchFn} = options;
        if (Array.isArray(url)) {
            const responses = await Promise.all(url.map((fetchURL) => (fetchFn ? fetchFn(fetchURL) : null)));
            // eslint-disable-next-line require-await
            return Promise.all(responses.map(async (response) => (response !== null && response.ok ? response.json() : null)));
        }
        const response = fetchFn ? await fetchFn(url) : null;
        return response !== null && response.ok ? response.json() : null;
    },
    'fetchText': async ([url], options) => {
        const {fetchFn} = options;
        if (Array.isArray(url)) {
            const responses = await Promise.all(url.map((fetchURL) => (fetchFn ? fetchFn(fetchURL) : null)));
            // eslint-disable-next-line require-await
            return Promise.all(responses.map(async (response) => (response !== null && response.ok ? response.text() : null)));
        }
        const response = fetchFn ? await fetchFn(url) : null;
        return response !== null && response.ok ? response.text() : null;
    },

    // Utility functions
    'typeof': ([obj]) => typeof obj
};