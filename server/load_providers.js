function Provider(name, dn_t, covel_t, bp_t, feast_t) { // De Neve, Covel, Bruin Plate, FEAST at Rieber
                                                        // These para are arrays of times (double)
                                                        // Providers can only provide times that are int or int.5
    this.name = name;
    this.dn_t = dn_t;
    this.covel_t = covel_t;
    this.bp_t = bp_t;
    this.feast_t = feast_t;
}

// test start
let Peter = new Provider('Peter', [4, 5.5, 13, 17.5], [], [], []);
let John = new Provider('John', [], [14, 15.5, 13, 17.5], [], []);
let Jack = new Provider('Jack', [15.5, 16.5, 18.5, 18], [], [], []);
let Jane = new Provider('Jane', [19.5, 12, 14.5, 17], [], [], []);

let Providers = [];
Providers.push(Peter);
Providers.push(John);
Providers.push(Jack);
Providers.push(Jane);
// test end

module.exports = Providers;
