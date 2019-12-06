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

export const _sortArrayLetters = (data, element, order="asc") => {
    let newArray; 
    
    if(order === 'asc') {
        newArray = [...data].sort((a,b) => (a[element] > b[element]) ? 1 : ((b[element] > a[element]) ? -1 : 0));
    }
    else {
        newArray = [...data].sort((a,b) => (a[element] > b[element]) ? -1 : ((b[element] > a[element]) ? 1 : 0));
    }

    return newArray
}

export const _sortArrayNumbers = (data, element, order="asc") => {
    let newArray; 
    
    if(order === 'asc') {
        newArray = [...data].sort((a,b) => (a[element] - b[element]));
    }
    else {
        newArray = [...data].sort((a,b) => (b[element] - a[element]));
    }

    return newArray
}
export const _convertFeetInch = (value) => {
    const inches = value / 2.54;
    const ft = Math.floor(inches / 12);
    const _in = (inches % 12).toFixed(2);
    return `${ft}ft ${_in} in`
}