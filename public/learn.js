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
    loadWord();
});

function loadWord() {
    if ($('#wrapper.learning').length !== 1) {
        return;
    }

    $.ajax({
        method: "GET",
        url: "/api/words/learn"
    }).done(function (response) {
        if (response.status === 0) {
            alert("Has error " + response.message);
        } else {
            console.log(response);
            var words = response.words;
            if (words.length === 0) {
                alert("words is empty");
                return;
            }

            setInfoWord(words[0]);

        }
    }).fail(function (e) {
        alert("Has error when load words");
    });
}

function setInfoWord(word) {
    var wordInfo = $('#word-info');
    wordInfo.find('.word .content').html(word.content);
    wordInfo.find('.word .type').html(word.type);

    setPronc(word.proncs[0], wordInfo.find('.pronc'));
    for (var i = 1; i < word.proncs.length; i++) {
        var element = wordInfo.find('.pattern').clone().removeClass('pattern');
        setPronc(word.proncs[i], element);
        wordInfo.append(element);
    }
    
    
    
    catchEventClickAudioIcon();
}

function setPronc(val, element) {
    if (!val) {
        return;
    }
    console.log('set pronc');
    element.find('.content').html(val.content);
    element.find('.dialect').html(val.dialect);
    element.find('img').data('src', val.audio_url);    
}


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

function catchEventClickAudioIcon() {
    $('.pronc img').on('click', function () {
        var src = $(this).data('src');
        if (src === undefined) {
            return;
        }
        var audio = $('audio');
        var player = audio[0];
        player.src = src;
        audio.on('loadeddata', function () {
            player.play();
        });
    });
}

function catchEventClickEnglish() {
    $('.english').on('click', function () {
        var src = $(this).data('src');
        if (src === undefined) {
            return;
        }
        var audio = $('audio');
        var player = audio[0];
        player.src = src;
        audio.on('loadeddata', function () {
            player.play();
        });
    });
}

