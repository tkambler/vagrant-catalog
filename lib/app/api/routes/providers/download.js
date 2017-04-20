'use strict';

module.exports = (req, res, next) => {

    const fs = require('app/fs');

    return Promise.resolve()
        .then(() => {

            let filePath = req.provider.getFilePath();

            return fs.statAsync(filePath)
                .then((stats) => {
                    res.writeHead(200, {
                        'Content-Type': 'application/octet-stream',
                        'Content-Length': stats.size
                    });
                    return fs.createReadStream(filePath).pipe(res);
                });

        })
        .catch(next);

};
