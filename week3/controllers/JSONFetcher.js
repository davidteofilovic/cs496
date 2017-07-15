"use strict"
var fs          = require('fs');

class JSONFetcher {
    constructor(file_name) {
        this.file_name = file_name;
    }

    get_file_data() {
        var that = this;
        return new Promise(function(resolve, reject){
            fs.readFile("data/" + that.file_name, function(err, data){
                if(err) {
                    reject(err);
                }
                resolve(data.toString('utf8'));
            });
        });
    }

    single(id) {
        var that = this;
        return new Promise(function(resolve, reject){
            that.get_file_data()
            .then(function(data){
                var desired_object = null;
                var objects = JSON.parse(data);
                objects.forEach(function(element, index){
                    if(element.id === id) {
                        desired_object = objects[index];
                    }
                });
                resolve(desired_object);
            });
        });
    }

    all() {
        var that = this;
        return new Promise(function(resolve, reject){
            that.get_file_data()
            .then(function(data){
                resolve(data);
            })
        });
    }
}

module.exports = JSONFetcher;