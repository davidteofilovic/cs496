"use strict"

class Boat {
    constructor(id, name, type, length, at_sea) {
        this.id     = id;
        this.name   = name;
        this.type   = type;
        this.length = length;
        this.at_sea = at_sea;
    }

    to_json() {
        return JSON.stringify(
            {
                "id": this.id,
                "name": this.name,
                "type": this.type,
                "length": this.length,
                "at_sea": this.at_sea
            }
        );
    }
}

module.exports = Boat;