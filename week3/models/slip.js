"use strict"

class Slip {
    constructor(id, number, current_boat, arrival_date) {
        this.id = id;
        this.number = number;
        this.current_boat = current_boat;
        this.arrival_date = arrival_date;
    }

    to_json() {
        return JSON.stringify(
            {
                "id": this.id,
                "number": this.number,
                "current_boat": this.current_boat,
                "arrival_date": this.arrival_date
            }
        );
    }
}

module.exports = Slip;