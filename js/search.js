let dinning_hall = [];
let time = [];
let Providers = [];
function read_demander_choice() {
    let input_hall = document.getElementById("hall").value;
    let input_time = document.getElementById("time").value;
    if (input_hall === "Default") dinning_hall = ["dn", "covel", "bp", "feast"];
    else dinning_hall = [input_hall];
    if (input_time === "Default") time = [11, 12, 13, 14, 17, 18, 19, 20];
    else time = [input_time];
}

function load_providers() {
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
    let Peter = new Provider('Peter', [4, 5, 13, 18], [], [], []);
    let John = new Provider('John', [], [14, 15, 13, 18], [], []);
    let Jack = new Provider('Jack', [15, 16, 17, 18], [], [], []);
    let Jane = new Provider('Jane', [19, 12, 14, 17], [], [], []);

    Providers = [];
    Providers.push(Peter);
    Providers.push(John);
    Providers.push(Jack);
    Providers.push(Jane);
}

function search() {
    let match_score = {};
    load_providers();
    read_demander_choice();
    Providers.forEach(function(provider) {
        let score = 0;
        dinning_hall.forEach(function(hall) {
            provider[hall + '_t'].forEach(function(time_can_provide) {
                score += (time.includes(time_can_provide.toString())) ? 1 : 0;
            });
        });
        match_score[provider.name] = score;
    });

    Providers.sort(function(a,b) {
        return match_score[b.name] - match_score[a.name];
    });

    Providers.forEach(function(provider) {
        console.log(provider.name + match_score[provider.name]);
    });
}