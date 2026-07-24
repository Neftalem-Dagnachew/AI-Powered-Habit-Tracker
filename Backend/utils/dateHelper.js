

/**
 * @param {Date|String} date 
 * @returns {String} YYYY-MM-DD
 */
exports.formatToYYYYMMDD = (date = new Date()) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

exports.isToday = (dateString) => {
    const today = exports.formatToYYYYMMDD(new Date());
    return dateString === today;
};