'use strict';

const md5 = require('md5');

module.exports = {
    myMd5(data) {
        return md5(data)
    }
}