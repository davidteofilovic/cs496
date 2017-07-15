"use strict"
var fs          = require('fs');


class JSONAppender {
    constructor(file_name, data) {
        this.file_name = file_name;
        this.data = data;
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

    write_to_file(data) {
        fs.writeFile("data/" + this.file_name, data, function(err){
            if(err) throw err;
        });
    }

    append() {
        var that = this;
        this.get_file_data()
        .then(function(data){
            var objects = JSON.parse(data);
            objects.push(that.data);
            that.write_to_file(JSON.stringify(objects));
        })
        .catch(function(err){
            console.log("ERROR: ", err);
        });
    }

}

module.exports = JSONAppender;