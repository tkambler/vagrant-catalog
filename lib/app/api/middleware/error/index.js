'use strict';

module.exports = () => {

    return (err, req, res, next) => {

        console.log(err, err.stack);

        return res.status(500).send({
            'error': err.toString()
        });

    };

};
