//initiate 
$(document).ready(init());

function init(){
    addTooltip();  
    emailSentPop();
    addPost();
    post_provider();
    post_demander();
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


function send_request(URL, message, storeplace) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function(object) { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            document.getElementById(storeplace).value = xmlHttp.responseText;
        }
    }
    xmlHttp.open("GET", URL, false); // true for asynchronous 
    xmlHttp.send(message);
}

function string_to_ArrayOfPeople(str) {
    let People = [];
    let lines = str.split("\n");
    lines.forEach(function(line) {
        if (line != "") {
            let arr = line.split(" ");
            let dn_t = [], covel_t = [], bp_t = [], feast_t = [];
            let tmp = "";
            tmp = arr[1].substr(1, arr[1].length - 2);
            if (tmp.length > 0) dn_t.push(tmp);
            tmp = arr[2].substr(1, arr[2].length - 2);
            if (tmp.length > 0) covel_t.push(tmp);
            tmp = arr[3].substr(1, arr[3].length - 2);
            if (tmp.length > 0) bp_t.push(tmp);
            tmp = arr[4].substr(1, arr[4].length - 2);
            if (tmp.length > 0) feast_t.push(tmp);
    
            People.push(new Person(arr[0], dn_t, covel_t, bp_t, feast_t, arr[5]));
        }
    });
    console.log(People);
    return People;
}

function load_providers() {
    send_request("http://localhost:9011/", null, 'store_providers');
    let str = document.getElementById('store_providers').value;
    let Providers = string_to_ArrayOfPeople(str);
    return Providers;
}

function load_demanders() {
    send_request("http://localhost:9012/", null, 'store_demanders');
    let str = document.getElementById('store_demanders').value;
    let Demanders = string_to_ArrayOfPeople(str);
    return Demanders;
}

function format_time(time) {
    time = Number(time);
    if (time === 11)
        return("11a.m. - 12p.m.");
    else if (time === 12)
        return("12p.m. - 1p.m.");
    else {
        time = time - 12;
        return(time.toString() + "p.m. - " + (time + 1).toString() + "p.m.");
    }
}

function search() {
    post_demander();
    let match_score = {};
    let Providers = load_providers();
    let demander_choice = read_demander_choice();
    let time = demander_choice[0];
    let dinning_hall = demander_choice[1];
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
        console.log(provider.name + " : " + match_score[provider.name]);
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

function post_provider() {
    let Providers = load_providers();
    var sellerTableBody = document.getElementById('seller-table-body');
    while (sellerTableBody.hasChildNodes()) {   
        sellerTableBody.removeChild(sellerTableBody.firstChild);
    }
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

function post_demander() {
    let Demanders = load_demanders();
    var buyerTableBody = document.getElementById('buyer-table-body');
    while (buyerTableBody.hasChildNodes()) {   
        buyerTableBody.removeChild(buyerTableBody.firstChild);
    }
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