var debug = require('debug');

function padNumeric(value) {
    return ('0' + value).slice(-2);
}

function getDate() {
    var now = new Date();

    var month = padNumeric(now.getMonth() + 1);
    var day = padNumeric(now.getDate());
    var year = now.getFullYear();
    var hour = padNumeric(now.getHours());
    var minutes = padNumeric(now.getMinutes());
    var seconds = padNumeric(now.getSeconds());
    
    var date = month + '-' + day + '-' + year;
    var time = hour + ':' + minutes + ':' + seconds;

    return '[' + date + ' ' + time + ']';
}

module.exports = function (source) {
    var _debug = debug(source);
    
    return {
        debug: function () {
            return _debug(getDate(), ...arguments);
        },
        log: function () {
            return console.log(source, getDate(), ...arguments);
        }
    };
}