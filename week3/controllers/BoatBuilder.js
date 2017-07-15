"use strict"

var Boat         = require("../models/boat");

class BoatBuilder {
    constructor(name, type, length) {
        this.id     = this.rand_id();
        this.name   = name;
        this.type   = type;
        this.length = length;
        this.at_sea = true;
    }

    rand_id() {
        var final = "";
        var chars = "abcedfghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

        for(var i = 0; i < 20; i++) {
            final += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return final;
    }

    get_boat() {
        return new Boat(this.id, this.name, this.type, this.length, this.at_sea);
    }
}

module.exports = BoatBuilder;