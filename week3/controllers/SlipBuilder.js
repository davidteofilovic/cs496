"use strict"

var Slip         = require("../models/slip");

class SlipBuilder {
    constructor(number, arrival_date) {
        this.id     = this.rand_id();
        this.number = number;
        this.arrival_date = arrival_date;
    }

    rand_id() {
        var final = "";
        var chars = "abcedfghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

        for(var i = 0; i < 20; i++) {
            final += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return final;
    }

    get_slip() {
        return new Slip(this.id, this.number, null, this.arrival_date);
    }
}

module.exports = SlipBuilder;