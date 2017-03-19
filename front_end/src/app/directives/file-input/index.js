'use strict';

// http://stackoverflow.com/questions/14438187/javascript-filereader-parsing-long-file-in-chunks

const app = require('app');

app.directive('fileInput', function($timeout, $parse, $log) {

    return {

        'scope': {
            'callback': '='
        },

        'require': ['?ngModel'],

        'link': function (scope, $el, attrs, ctrl) {

//             function parseFile(file, callback) {
//                 var fileSize   = file.size;
//                 var chunkSize  = 64 * 1024; // bytes
//                 var offset     = 0;
//                 var self       = this; // we need a reference to the current object
//                 var chunkReaderBlock = null;
//
//                 var readEventHandler = function(evt) {
//                     if (evt.target.error == null) {
//                         // offset += evt.target.result.length;
//                         offset += chunkSize;
//                         callback(evt.target.result); // callback for handling read chunk
//                     } else {
//                         console.log("Read error: " + evt.target.error);
//                         return;
//                     }
//                     if (offset >= fileSize) {
//                         console.log("Done reading file");
//                         return;
//                     }
//
//                     // of to the next chunk
//                     chunkReaderBlock(offset, chunkSize, file);
//                 }
//
//                 chunkReaderBlock = function(_offset, length, _file) {
//                     var r = new FileReader();
//                     var blob = _file.slice(_offset, length + _offset);
//                     r.onload = readEventHandler;
//                     r.readAsText(blob);
//                 };
//
//                 // now let's start the read with the first block
//                 chunkReaderBlock(offset, chunkSize, file);
//             }

            const ngModel = ctrl[0];

            if (ngModel) {
                $el[0].addEventListener('change', function() {
                    let reader = new FileReader();
                    reader.onload = (data) => {
                        ngModel.$setViewValue(data.target.result);
                    };
                    reader.readAsDataURL(this.files[0]);
                }, false);
            }

//             if (scope.callback) {
//                 $el[0].addEventListener('change', function() {
//                     let reader = new FileReader();
//                     return scope.callback({
//                         'read': (cb) => {
//                             return parseFile(this.files[0], cb);
//                         }
//                     });
//                 }, false);
//             }

            if (scope.callback) {
                $el[0].addEventListener('change', function() {
                    return scope.callback(this.files[0]);
                }, false);
            }


        }

    };

});
