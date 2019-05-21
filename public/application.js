/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extensions = ['#examples', '#word-family', '#word-description', '#word-relationship'];
$(document).ready(function () {
    catchEventChooseDot();
    catchEventClickAudioIcon();
    catchEventClickEnglish();
});

function catchEventChooseDot() {
    $('#slide-nav .dot').on('click', function () {
        var indexChoose = $(this).data('index');
        var indexCurrent = $('.active').data('index');
        if (indexCurrent === undefined) {
            indexCurrent = 0;
        }
        if (indexChoose === indexCurrent) {
            return;
        }
        var eCurrent = $(extensions[indexCurrent]);
        var eChoose = $(extensions[indexChoose]);
        $('.active').removeClass('active');
        if (indexChoose < indexCurrent) {
            eCurrent.animate({'left': '100%'});
            eChoose.animate({'left': '0%'});
        } else {
            eCurrent.animate({'left': '-100%'});
            eChoose.animate({'left': '0%'});
        }
        $(this).addClass('active');
    });
}

function catchEventClickAudioIcon(){
    $('.pronc img').on('click', function (){
        var src = $(this).data('src');
        if(src === undefined){
            return;
        }
        var audio = $('audio');
        var player = audio[0];
        player.src = src;
        audio.on('loadeddata', function (){
            player.play();
        });
    });
}

function catchEventClickEnglish(){
    $('.english').on('click', function (){
        var src = $(this).data('src');
        if(src === undefined){
            return;
        }
        var audio = $('audio');
        var player = audio[0];
        player.src = src;
        audio.on('loadeddata', function (){
            player.play();
        });
    });
}