"use strict"
var fs          = require('fs');

class JSONDeleter {
    constructor(file_name, id) {
        this.file_name      = file_name;
        this.id             = id;
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

    delete() {
        var that = this;
        this.get_file_data()
        .then(function(data){
            var objects = JSON.parse(data);
            objects.forEach(function(element, index) {
                if(element.id === that.id) {
                    objects.splice(index, 1);
                }
            });
            var options = { flag : 'w' };
            fs.writeFile("data/" + that.file_name, JSON.stringify(objects), options, function(err){
                if(err) throw err;
            });
        })
        .catch(function(err){
            console.log("ERROR: ", err);
        });
    }
}

module.exports = JSONDeleter;