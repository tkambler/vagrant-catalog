'use strict';
/* global XMLHttpRequest */

const app = require('app');
const _ = require('lodash');

app.factory('upload', function($log, cfpLoadingBar) {

    class Upload {

        upload(url, model, files) {

            return new Promise((resolve, reject) => {

                cfpLoadingBar.start();

                const xhr = new XMLHttpRequest();
                xhr.upload.addEventListener('progress', (ev) => {
                    let perc = ev.loaded / ev.total;
                    cfpLoadingBar.set(perc);
                }, false);

                xhr.onreadystatechange = (ev) => {
                    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        cfpLoadingBar.complete();
                        return resolve(xhr.responseText);
                    }
                };

                xhr.open('POST', url, true);

                const data = new FormData();
                _.each(files, (file, k) => {
                    data.append(k, file);
                });

                _.each(model, (v, k) => {
                    data.set(k, v);
                });

                return xhr.send(data);

            });

        }

    }

    return new Upload();

});
