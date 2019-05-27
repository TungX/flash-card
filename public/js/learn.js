/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extensions = ['.active .examples', '.active .word-families', '.active .word-descriptions', '.active .word-relationships'];

$(document).ready(function() {
    loadWord();
    catchEventMoveSlide();
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
});

function loadWord() {
    if ($('#wrapper .learning').length !== 1) {
        return;
    }
    $.ajax({
        method: "GET",
        url: "/api/words/learn"
    }).done(function(response) {
        if (response.status === 0) {
            alert("Has error " + response.message);
        } else {
            var words = response.words;
            // if (words.length === 0) {
            //     alert("words is empty");
            //     return;
            // }
            // for (var i = 0; i < words.length; i++) {
            //     var element = $('.slide.learning.pattern').clone().removeClass('pattern').removeClass('non-display').removeClass('active');
            //     element.addClass('slide-' + i);
            //     element.data('index', i);
            //     element.css({ 'left': i * 100 + '%' });
            //     setInfoWord(words[i], element);
            //     $('#wrapper').append(element);
            // }
            // if (words.length > 0)
            //     $('.slide.slide-0').addClass('active');
            // catchEventChooseDot();
            // catchEventClickAudioIcon();
            // catchEventClickEnglish();

            var practices = response.practices;
            console.log(practices);
        }
    }).fail(function(e) {
        alert("Has error when load words");
    });
}

function catchEventMoveSlide() {
    var mouseDown = false;
    var mouseXStart = 0;
    var mouseYStart = 0;
    //    var timeStart = 0;
    $('#wrapper').on('vmousedown', function(e) {
        mouseXStart = e.clientX;
        mouseYStart = e.clientY;
    });
    $('#wrapper').on('vmouseup', function(e) {
        var distance = e.clientX - mouseXStart;
        if (Math.abs(distance) > 20 && Math.abs(e.clientY - mouseYStart) < Math.abs(distance)) {
            if (distance < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });

    //    $('#wrapper').on('vmousemove', function (e) {
    //        if (mouseDown && (new Date()).getTime() - timeStart > 300)
    //            console.log('move: ' + e.clientX);
    //    });
}

function nextSlide() {
    var indexCurrent = $('.slide.active .extend.active').data('index');
    if (indexCurrent === 3) {
        nextScreen();
    } else {
        selectSlideItem(indexCurrent + 1);
    }
}

function prevSlide() {
    var indexCurrent = $('.slide.active .extend.active').data('index');
    if (indexCurrent === 0) {
        prevScreen();
    } else {
        selectSlideItem(indexCurrent - 1);
    }
}

function nextScreen() {
    var index = $('.slide.active').data('index');
    if (index < $('.slide').length - 2) {
        $('.slide.active').animate({ 'left': '-100%' });
        $('.slide.slide-' + (index + 1)).animate({ 'left': '0%' });
        $('.slide.active').removeClass('active');
        $('.slide.slide-' + (index + 1)).addClass('active');
        selectSlideItem(0);
    }
}

function prevScreen() {
    var index = $('.slide.active').data('index');
    if (index > 0) {
        $('.slide.active').animate({ 'left': '100%' });
        $('.slide.slide-' + (index - 1)).animate({ 'left': '0%' });
        $('.slide.active').removeClass('active');
        $('.slide.slide-' + (index - 1)).addClass('active');
        selectSlideItem(0);
    }
}

function setInfoWord(word, wrapper) {
    var wordInfo = wrapper.find('.word-info');
    wordInfo.find('.word .content').html(word.content);
    wordInfo.find('.word .type').html(word.type);

    setPronc(word.proncs[0], wordInfo.find('.pronc'));
    for (var i = 1; i < word.proncs.length; i++) {
        var element = wordInfo.find('.pattern').clone().removeClass('pattern');
        setPronc(word.proncs[i], element);
        wordInfo.append(element);
    }

    var examples = wrapper.find('.examples .description');
    setExample(word.examples[0], examples.find('.detail'));
    for (var i = 1; i < word.examples.length; i++) {
        var element = examples.find('.pattern').clone().removeClass('pattern');
        setExample(word.examples[i], element);
        examples.append(element);
    }

    var wordFamilies = wrapper.find('.word-families .description');
    setWordFamilies(word.word_families[0], wordFamilies.find('.detail'));
    for (var i = 1; i < word.word_families.length; i++) {
        var element = wordFamilies.find('.pattern').clone().removeClass('pattern');
        setWordFamilies(word.word_families[i], element);
        wordFamilies.append(element);
    }

    var descriptions = wrapper.find('.word-descriptions .description');
    setDescription(word.descriptions[0], descriptions.find('.detail'));
    for (var i = 1; i < word.descriptions.length; i++) {
        var element = descriptions.find('.pattern').clone().removeClass('pattern');
        setDescription(word.descriptions[i], element);
        descriptions.append(element);
    }

    var wordRelationships = wrapper.find('.word-relationships .description');
    for (var i = 0; i < word.relationships.length; i++) {
        var element = wordRelationships.find('.pattern').clone().removeClass('pattern').removeClass('non-display');
        setWordRelationship(word.relationships[i], element);
        wordRelationships.find('.' + word.relationships[i].type).append(element);
    }
}

function setWordRelationship(val, element) {
    if (!val) {
        return;
    }
    element.find('.word').html(val.content);
    element.find('.examle').html(val.example);
}

function setDescription(val, element) {
    if (!val) {
        return;
    }
    element.html(val.content);
}

function setWordFamilies(val, element) {
    if (!val) {
        return;
    }
    element.find('.content').html(val.content);
    element.find('.type').html(val.type);
    element.find('.example').html(val.example);
}

function setPronc(val, element) {
    if (!val) {
        return;
    }
    element.find('.content').html(val.content);
    element.find('.dialect').html(val.dialect);
    element.find('img').data('src', val.audio_url);
}

function setExample(val, element) {
    if (!val) {
        return;
    }
    element.find('.english').html(val.content);
    element.find('.vietnamese').html(val.content_vi);
    if (!!val.audio_url)
        element.find('.english').data('src', val.audio_url);
}


function catchEventChooseDot() {
    $('.slide-nav .dot').on('click', function() {
        console.log('dot click');
        var indexChoose = $(this).data('index');
        selectSlideItem(indexChoose);
    });
}

function selectSlideItem(indexChoose) {
    var indexCurrent = $('.slide.active .extend.active').data('index');
    if (indexCurrent === undefined) {
        indexCurrent = 0;
    }
    $('.slide-nav .active').removeClass('active');
    $('.slide-nav .dot-' + indexChoose).addClass('active');
    if (indexChoose === indexCurrent) {
        return;
    }
    var eCurrent = $(extensions[indexCurrent]);
    eCurrent.removeClass('active');
    var eChoose = $(extensions[indexChoose]).removeClass('non-display');
    eChoose.addClass('active');
    if (indexChoose < indexCurrent) {
        eCurrent.animate({ 'left': '100%' }, function() {
            eCurrent.addClass('non-display');
        });
        eChoose.css({ 'left': '-100%' });
        eChoose.animate({ 'left': '0%' });
    } else {
        eCurrent.animate({ 'left': '-100%' }, function() {
            eCurrent.addClass('non-display');
        });
        eChoose.css({ 'left': '100%' });
        eChoose.animate({ 'left': '0%' });
    }
}

function catchEventClickAudioIcon() {
    $('.pronc img').on('click', function() {
        var src = $(this).data('src');
        if (src === undefined) {
            return;
        }
        var audio = $('audio');
        var player = audio[0];
        player.src = src;
        audio.on('loadeddata', function() {
            player.play();
        });
    });
}

function catchEventClickEnglish() {
    $('.english').on('click', function() {
        var src = $(this).data('src');
        if (src === undefined) {
            return;
        }
        var audio = $('audio');
        var player = audio[0];
        player.src = src;
        audio.on('loadeddata', function() {
            player.play();
        });
    });
}