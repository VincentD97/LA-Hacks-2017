//initiate 
$(document).ready(init());

function init(){
    addTooltip();  
    emailSentPop();
    addPost();
    console.log("...");
    init_post_demander();
    init_post_provider();
}

//add toolstips to all table rows
function addTooltip(){
    $('[data-toggle="tooltip"]').tooltip();   
}

//popover email sent notification modal
function emailSentPop(){
    $(".sentMail").click(function(){
        $("#sentMail").modal();
    });
}

//initiate plus button
function addPost() {
    var diningHallMapper = function(letter) {
        switch (letter) {
            case 'A':
                return 'De Neve';
            case 'B':
                return 'Covel';
            case 'C':
                return 'Bruin Plate';
            case 'D':
                return 'Feast at Rieber';
        }
        return '';
    };

    $('#seller-switch-btn').on('click', function() {
        $('#plus-btn').attr('data-target', '#postProvider');
    });

    $('#buyer-switch-btn').on('click', function() {
        $('#plus-btn').attr('data-target', '#postDemander');
    });

    $('#postDemander').on('click', '#post-demander-btn', function() {
        var newDemanderName = $('#demander-name')[0].value;
        var newDemanderDiningHall = diningHallMapper($('#demander-dining-hall')[0].value);
        var newDemanderContactInfo = $('#demander-contact-info')[0].value;

        var newDemanderJson = {
            'name': newDemanderName,
            'diningHall': newDemanderDiningHall,
            'contact': newDemanderContactInfo,
        };
        console.log($('#demander-time')[0].value);
        var buyerTableBody = $('#buyer-table table tbody');
        buyerTableBody.append(`<tr data-original-title="Click to Match Me!" data-toggle="tooltip" data-placement="top" data-container="body" class="sentMail">
          <td>${newDemanderJson.name}</td>
          <td class="text-center col2">${newDemanderJson.diningHall}</td>
          <td>${format_time($('#demander-time')[0].value)}</td>
          <td class="text-center col4">${newDemanderJson.contact}</td>
        </tr>`);
        addTooltip();
    });

    $('#postProvider').on('click', '#post-provider-btn', function() {
        var newProviderName = $('#provider-name')[0].value;
        var newProviderDiningHall = diningHallMapper($('#provider-dining-hall')[0].value);
        var newProviderContactInfo = $('#provider-contact-info')[0].value;

        var newProviderJson = {
            'name': newProviderName,
            'diningHall': newProviderDiningHall,
            'contact': newProviderContactInfo,
        };

        console.log($('#provider-time'));
        var sellerTableBody = $('#seller-table table tbody');
        sellerTableBody.append(`<tr data-original-title="Click to Match Me!" data-toggle="tooltip" data-placement="top" data-container="body" class="sentMail">
          <td class="text-center col1">${newProviderJson.name}</td>
          <td>${newProviderJson.diningHall}</td>
          <td class="text-center col3">${format_time($('#provider-time')[0].value)}</td>
          <td>${newProviderJson.contact}</td>
        </tr>`);
        addTooltip();
    });
}

   




/* ---------------- Search ---------------- */
let dinning_hall = [];
let time = [];

function read_demander_choice() {
    let input_hall = document.getElementById("hall").value;
    let input_time = document.getElementById("time").value;
    if (input_hall === "Default") dinning_hall = ["dn", "covel", "bp", "feast"];
    else dinning_hall = [input_hall];
    if (input_time === "Default") time = [11, 12, 13, 14, 17, 18, 19, 20];
    else time = [input_time];
    return [ time, dinning_hall ];
}

function Person(name, dn_t, covel_t, bp_t, feast_t, contact) {  // De Neve, Covel, Bruin Plate, FEAST at Rieber
                                                                // These para are arrays of times (double)
                                                                // Providers can only provide times that are int or int.5
        this.name = name;
        this.dn_t = dn_t;
        this.covel_t = covel_t;
        this.bp_t = bp_t;
        this.feast_t = feast_t;
        this.contact = contact;
}

function load_demanders() {
    // test start
    let Peter = new Person('Peter', [18], [], [], [], "vincent_dong97@outlook.com");
    let John = new Person('John', [], [18], [], [], "aaa");
    let Jack = new Person('Jack', [18], [], [], [], "bbb");
    let Jane = new Person('Jane', [17], [], [], [], "ccc");

    Demanders = [];
    Demanders.push(Peter);
    Demanders.push(John);
    Demanders.push(Jack);
    Demanders.push(Jane);
    return Demanders;
}

function load_providers() {
    // test start
    let Peter = new Person('Peter', [18], [], [], [], "vincent_dong97@outlook.com");
    let John = new Person('John', [], [18], [], [], "aaa");
    let Jack = new Person('Jack', [18], [], [], [], "bbb");
    let Jane = new Person('Jane', [17], [], [], [], "ccc");

    Providers = [];
    Providers.push(Peter);
    Providers.push(John);
    Providers.push(Jack);
    Providers.push(Jane);
    return Providers;
}

function format_time(time) {
    time = Number(time);
    console.log(time);
    if (time === 11)
        return("11a.m. - 12p.m.");
    else if (time === 12)
        return("12p.m. - 1p.m.");
    else {
        time = time - 12;
        console.log(time);
        console.log(time.toString() + "p.m. - " + (time + 1).toString() + "p.m.");
        return(time.toString() + "p.m. - " + (time + 1).toString() + "p.m.");
    }
}

function search() {
    let match_score = {};
    let Providers = load_providers();
    let demander_choice = read_demander_choice();
    console.log(demander_choice);
    let time = demander_choice[0];
    let dinning_hall = demander_choice[1];
    Providers.forEach(function(provider) {
        let score = 0;
        dinning_hall.forEach(function(hall) {
            console.log("...");
            console.log(hall);
            console.log("...");
            console.log(provider);
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

    var sellerTableBody = document.getElementById('seller-table-body');
    while (sellerTableBody.hasChildNodes()) {   
        sellerTableBody.removeChild(sellerTableBody.firstChild);
    }

    Providers.forEach(function(provider) {
        let tmp_hall = "", tmp_time = "NA";
        console.log(provider.dn_t === []);
        if (provider.dn_t.length > 0) {
            tmp_hall = "De Neve";
            tmp_time = provider.dn_t[0];
        }
        else if (provider.covel_t.length > 0) {
            tmp_hall = "Covel";
            tmp_time = provider.covel_t[0];
        }
        else if (provider.bp_t.length > 0) {
            tmp_hall = "Bruin Plate";
            tmp_time = provider.bp_t[0];
        }
        else if (provider.feast_t.length > 0) {
            tmp_hall = "FEAST at Rieber";
            tmp_time = provider.feast_t[0];
        }
        
        sellerTableBody.innerHTML += `<tr data-original-title="Click to Match Me!" data-toggle="tooltip" data-placement="top" data-container="body" class="sentMail">
            <td class="text-center col1">${provider.name}</td>
            <td>${tmp_hall}</td>
            <td class="text-center col3">${format_time(tmp_time)}</td>
            <td>${provider.contact}</td>
        </tr>`;
    });
}

function init_post_demander() {
    let Demanders = load_demanders();
    var buyerTableBody = document.getElementById('buyer-table-body');
    Demanders.forEach(function(demander) {
        let tmp_hall = "", tmp_time = "NA";
        if (demander.dn_t.length > 0) {
            tmp_hall = "De Neve";
            tmp_time = demander.dn_t[0];
        }
        else if (demander.covel_t.length > 0) {
            tmp_hall = "Covel";
            tmp_time = demander.covel_t[0];
        }
        else if (demander.bp_t.length > 0) {
            tmp_hall = "Bruin Plate";
            tmp_time = demander.bp_t[0];
        }
        else if (demander.feast_t.length > 0) {
            tmp_hall = "FEAST at Rieber";
            tmp_time = demander.feast_t[0];
        }
        
        buyerTableBody.innerHTML += `<tr data-original-title="Click to Match Me!" data-toggle="tooltip" data-placement="top" data-container="body" class="sentMail">
            <td>${demander.name}</td>
            <td class="text-center col2">${tmp_hall}</td>
            <td>${format_time(tmp_time)}</td>
            <td class="text-center col4">${demander.contact}</td>
        </tr>`;
    });
}

function init_post_provider() {
    let Providers = load_providers();
    var sellerTableBody = document.getElementById('seller-table-body');
    Providers.forEach(function(provider) {
        let tmp_hall = "", tmp_time = "NA";
        if (provider.dn_t.length > 0) {
            tmp_hall = "De Neve";
            tmp_time = provider.dn_t[0];
        }
        else if (provider.covel_t.length > 0) {
            tmp_hall = "Covel";
            tmp_time = provider.covel_t[0];
        }
        else if (provider.bp_t.length > 0) {
            tmp_hall = "Bruin Plate";
            tmp_time = provider.bp_t[0];
        }
        else if (provider.feast_t.length > 0) {
            tmp_hall = "FEAST at Rieber";
            tmp_time = provider.feast_t[0];
        }
        
        sellerTableBody.innerHTML += `<tr data-original-title="Click to Match Me!" data-toggle="tooltip" data-placement="top" data-container="body" class="sentMail">
            <td class="text-center col1">${provider.name}</td>
            <td>${tmp_hall}</td>
            <td class="text-center col3">${format_time(tmp_time)}</td>
            <td>${provider.contact}</td>
        </tr>`;
    });
}
