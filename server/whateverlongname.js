// Triggered when user changes the filter

let allow_time_error = 0.5;

let Providers = require('./load_providers');
let UserChoice = require('./load_userchoice');

Providers.sort(function(a,b) {
    let a_matchscore = 0;
    let b_matchscore = 0;
    UserChoice.dinning_hall.forEach(function(hall) {
        a[hall + '_t'].forEach(function(time) {
            a_matchscore += (Math.abs(UserChoice.time - time) <= allow_time_error) ? 1 : 0;
        });
        b[hall + '_t'].forEach(function(time) {
            b_matchscore += (Math.abs(UserChoice.time - time) <= allow_time_error) ? 1 : 0;
        });
    });
    console.log('a_matchscore : ' + a_matchscore);
    console.log('b_matchscore : ' + b_matchscore);
    return b_matchscore - a_matchscore;
});

Providers.forEach(function(provider) {
    console.log(provider.name);
});