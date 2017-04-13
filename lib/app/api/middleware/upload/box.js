'use strict';

module.exports = () => {

    const multer = require('multer');
    const config = require('app/config');
    const upload = multer({
        'dest': config.get('uploads_dir')
    });
    return upload.single('box');

};
