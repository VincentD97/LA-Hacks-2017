//initiate 
$(document).ready(init());

function init(){
    addTooltip();  
    emailSentPop();
    addPost();
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
    $('#seller-switch-btn').on('click', function() {
        $('#plus-btn').attr('data-target', '#postProvider');
        console.log($('#plus-btn'));
    })

    $('#buyer-switch-btn').on('click', function() {
        $('#plus-btn').attr('data-target', '#postDemander');
    })
}