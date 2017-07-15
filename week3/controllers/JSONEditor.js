"use strict"
var fs          = require('fs');

class JSONEditor {
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

    change_field(id, property, value) {
        var that = this;
        console.log(id, property, value);
        return new Promise(function(resolve, reject){
            that.get_file_data()
                .then(function(data) {
                    var objects = JSON.parse(data);
                    objects.forEach(function(element, index){
                        if(element.id === id) {
                            objects[index][property] = value;
                        }
                    });
                    var options = { flag : 'w' };
                    fs.writeFile("data/" + that.file_name, JSON.stringify(objects), options, function(err){
                        if(err) {
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    });
                })
                .catch(function(err){
                    console.log("ERROR READ DATA: ", err);
                });
        });
    }

    change_resource(resource) {
        var that = this;
        return new Promise(function(resolve, reject){
            that.get_file_data()
                .then(function(data){
                    var objects = JSON.parse(data);
                    objects.forEach(function(element, index){
                        if(element.id === resource.id) {
                            objects[index] = JSON.parse(resource.to_json());
                        }
                    });
                    var options = { flag : 'w' };
                    fs.writeFile("data/" + that.file_name, JSON.stringify(objects), options, function(err){
                        if(err) {
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    });

                })
                .catch(function(err){
                    console.log(err);
                });
        });
    }
}

module.exports = JSONEditor;