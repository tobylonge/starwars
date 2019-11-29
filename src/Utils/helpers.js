export const _getYear = (date) => {
    return new Date(date).getUTCFullYear();
 };

export const _sumEle = (data) => {
    return data.reduce((acc, char) => {
    if(!isNaN(char.height)) {
        acc += Number(char.height);
    }
    return acc;
    }, 0);
}

export const _sortDescNumbers = (data, element) => {
    return data.sort((a,b) => (b[element] - a[element]));
}

export const _sortDescLetters = (data, element) => {
    return data.sort((a,b) => (a[element] > b[element]) ? -1 : ((b[element] > a[element]) ? 1 : 0));
}

export const _sortAscNumbers = (data, element) => {
    return data.sort((a,b) => (a[element] - b[element]));
}

export const _sortAscLetters = (data, element) => {
    return data.sort((a,b) => (a[element] > b[element]) ? 1 : ((b[element] > a[element]) ? -1 : 0));
}