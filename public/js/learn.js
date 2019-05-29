/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extensions = ['.active .examples', '.active .word-families', '.active .word-descriptions', '.active .word-relationships'];
var form_types = {'fill_blank_by_type': 'type',
    'fill_blank_by_choose': 'choose',
    'select_word_from_desciption': 'choose',
    'type_word_from_desciption': 'type',
    'listen_word': 'listen-and-type',
    'listen_sentence': 'sort',
    'speak_word': 'speak',
    'speak_sentence': 'speak'};
var recognition;
var final_transcript = '';
$(document).ready(function () {
    console.log('document on ready');
    loadWord();
    catchEventMoveSlide();
    catchEventCheckClick();
    catchEventYesClick();
    catchEventNoClick();
});
var recognition;
function catchEventMicroClick() {
    $('.micro').on('click', function () {
        if (!('webkitSpeechRecognition' in window)) {
            alert('brower non support speech to text');
        } else {
            if ($(this).data('status') === 'running') {
                $(this).data('status', 'stoped');

                $(this)[0].src = "/imgs/microphone-2104091_960_720.png";
                if (recognition) {
                    recognition.stop();
                }
                return;
            }
            $(this)[0].src = "/imgs/BitesizedDevotedIbizanhound-small.gif";
            $(this).data('status', 'running');
            window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            if (!recognition) {
                recognition = new window.SpeechRecognition();
                recognition.lang = "en-US";
                recognition.interimResults = true;
                recognition.maxAlternatives = 10;
                recognition.continuous = true;
                recognition.onresult = function (event) {
                    if (typeof (event.results) === 'undefined') {
                        recognition.onend = null;
                        recognition.stop();
                        return;
                    }
                    for (var i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            $('.slide.active .speak .answer-area').html(capitalize(event.results[i][0].transcript));
                        }
                    }
                    recognition.stop();
                    $(this)[0].src = "/imgs/microphone-2104091_960_720.png";
                };
            }
            recognition.start();
        }
    });
}

var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function (m) {
        return m.toUpperCase();
    });
}
function success() {
    var wordId = $('.slide.active').data('word_id');
    if (wordId) {
        var skill = $('.slide.active').data('skill');
        var data = {'word_id': wordId, 'status': true, 'skill': skill};
    }
    $.ajax({
        method: "PUT",
        url: "/api/practices",
        data: data
    }).done(function (response) {
        console.log(response);
    }).fail(function (e) {
        alert("Update status of practice fail");
    });

    setTimeout(nextPractice, 500);
}

function fail() {

}
function loadWord() {
    if ($('#wrapper .learning').length !== 1) {
        return;
    }
    $.ajax({
        method: "GET",
        url: "/api/words/learn"
    }).done(function (response) {
        if (response.status === 0) {
            alert("Has error " + response.message);
        } else {
            var words = response.words;
            if (words.length === 0) {
                alert("words is empty");
                return;
            }
//            words = [];
            for (var i = 0; i < words.length; i++) {
                var element = $('.slide.learning.pattern').clone().removeClass('pattern').removeClass('non-display').removeClass('active');
                element.addClass('slide-' + i);
                element.data('index', i);
                if (i === 0)
                    element.css({'left': '0%'});
                else
                    element.css({'left': '100%'});
                setInfoWord(words[i], element);
                $('#wrapper').append(element);
            }
//            if (words.length > 0)
//                $('.slide.slide-0').addClass('active');

            var practices = response.practices;
            for (var i = 0; i < practices.length; i++) {
                var element = $('.slide.practice.pattern').clone().removeClass('pattern').removeClass('non-display').removeClass('active');
                element.addClass('slide-' + (words.length + i));
                element.data('index', (words.length + i));
                if ((i + words.length) === 0) {
                    element.css({'left': '0%'});
                } else {
                    element.css({'left': '100%'});
                }
                setPractice(practices[i], element);
                $('#wrapper').append(element);
            }
//            $('.slide.slide-0').css({'left': '-100%'});
//            $('.slide.slide-6').css({'left': '0%'});
            if ($('.slide.slide-0').length)
                $('.slide.slide-0').addClass('active');
            if (words.length)
                $('.check-and-next').addClass('non-display');
            else
                $('.slide-nav').addClass('non-display');
            catchEventChooseDot();
            catchEventClickAudioIcon();
            catchEventClickEnglish();
            catchEventSelectToken();
            catchEventTypeAnswer();
            catchEventChooseAnswer();
            catchEventMicroClick();
        }
    }).fail(function (e) {
        alert("Has error when load words");
    });
}

function catchEventTypeAnswer() {
    $('.slide.active .answers input').on('keyup', function (e) {
        var value = $(this).val().toLowerCase();
        var ans = $(this).data('answer').toLowerCase();
        if (ans.startsWith(value)) {
            $(this).parent('.ui-input-text').css({'border-color': '#ddd'});
        } else {
            $(this).parent('.ui-input-text').css({'border-color': 'red'});
        }
        if (ans === value) {
            $(this).parent('.ui-input-text').css({'border-color': 'greenyellow'});
            //next sentence
            success();
        }
    });
}

function catchEventChooseAnswer() {
    $('.slide.active .answers .content').on('click', function (e) {
        if ($(this).data('type')) {
            $(this).css({'background-color': 'greenyellow'});
            success();
        } else {
            $(this).css({'background-color': '#ffa4a4'});
        }
    });
}
function catchEventCheckClick() {
    $('.check-and-next').on('click', function () {
        console.log('check click');
        if ($(this).data('status') === 'next') {
            nextPractice();
        } else {
            if ($('.slide.active .group.type').length) {
                $('.slide.active .group.type input').val($('.slide.active .group.type input').data('answer'));
                $('.slide.active .group.type .ui-input-text').css({'border-color': 'red'});
            } else if ($('.slide.active .group.choose').length) {
                var answers = $('.slide.active .group.choose .answers .content');
                for (var i = 0; i < answers.length; i++) {
                    if ($(answers[i]).hasClass('pattern')) {
                        continue;
                    }
                    if ($(answers[i]).data('type')) {
                        $(answers[i]).css({'border-color': 'red'});
                        break;
                    }
                }
            } else if ($('.slide.active .group.sort').length) {
                console.log('sort');
                if ($('.slide.active .answer-area').text().trim() === $('.slide.active .answer-area').data('answer')) {
                    success();
                } else {
                    $('.slide.active .group.sort .message').html($('.slide.active .answer-area').data('answer'));
                    fail();
                }
            } else if ($('.slide.active .group.listen-and-type').length) {
                console.log('listen-and-type');
                $('.slide.active .group.listen-and-type input').val($('.slide.active .group.listen-and-type input').data('answer'));
                $('.slide.active .group.listen-and-type .ui-input-text').css({'border-color': 'red'});
                fail();
            } else if ($('.slide.active .group.speak').length) {
                console.log('speak');
            }
            $('.check-and-next').html('Next');
            $('.check-and-next').data('status', 'next');
        }
    });
}
function nextPractice() {
    var index = $('.slide.active').data('index');
    if (index < $('.slide').length - 2) {
        $('.slide.active').animate({'left': '-100%'});
        $('.slide.slide-' + (index + 1)).animate({'left': '0%'});
        $('.slide.active').removeClass('active');
        $('.slide.slide-' + (index + 1)).addClass('active');
        $('.check-and-next').html('Check');
        $('.check-and-next').data('status', 'check');
    }
    catchEventChooseAnswer();
    catchEventTypeAnswer();
    catchEventSelectToken();
}

function setPractice(val, element) {
    element.data('word_id', val.word_id);
    element.data('skill', val.skill);
    var form_type = form_types[val.type];
    switch (form_type) {
        case 'choose':
            setChooseQuestion(val, element);
            break;
        case 'type':
            setTypeQuestion(val, element);
            break;
        case 'sort':
            setSortQuestion(val, element);
            break;
        case 'listen-and-type':
            setListenAndTypeQuestion(val, element);
            break;
        case 'speak':
            setSpeakQuestion(val, element);
            break;
    }
}

function setSpeakQuestion(val, element) {
    var group = $('.practice-groups .speak').clone();
    group.find('.question .content').html(val.answers[0].content);
    group.find('.question img').data('src', val.content);
    element.find('.slide-content').append(group);
}

function setChooseQuestion(val, element) {
    var group = $('.practice-groups .choose').clone();
    group.find('.question .content').html(val.content);
    var answers = group.find('.answers');
    while (val.answers.length > 1) {
        var ae = answers.find('.pattern').clone().removeClass('pattern').removeClass('non-display');
        var index = Math.round((val.answers.length - 1) * Math.random());
        var answer = val.answers.splice(index, 1)[0];
        ae.html(answer.content);
        ae.data('type', answer.type);
        if (val.answers.length % 2 === 1) {
            ae.addClass('left');
        } else {
            ae.addClass('right');
        }
        answers.append(ae);
    }
    if (val.answers.length > 0) {
        var ae = answers.find('.pattern').clone().removeClass('pattern').removeClass('non-display');
        var answer = val.answers.splice(0, 1)[0];
        ae.html(answer.content);
        ae.data('type', answer.type);
        ae.addClass('right');
        answers.append(ae);
    }
    element.find('.slide-content').append(group);
}

function setTypeQuestion(val, element) {
    var group = $('.practice-groups .type').clone();
    group.find('.question .content').html(val.content);
    group.find('.answers input').data('answer', val.answers[0].content.toLowerCase());
    element.find('.slide-content').append(group);
}

function setSortQuestion(val, element) {
    var group = $('.practice-groups .sort').clone();
    group.find('.question img').data('src', val.content);
    var ansContent = val.answers[0].content.toLowerCase();
    group.find('.answers .answer-area').data('answer', ansContent);
    var tokens = ansContent.match(/\S+/g) || [];
    var eTokens = group.find('.answers .tokens-area');
    while (tokens.length > 1) {
        var eToken = eTokens.find('.pattern').clone().removeClass('pattern').removeClass('non-display');
        var index = Math.round((tokens.length - 1) * Math.random());
        var token = tokens.splice(index, 1)[0];
        eToken.html(token);
        eTokens.append(eToken);
        eTokens.append(" ");
    }
    if (tokens.length > 0) {
        var eToken = eTokens.find('.pattern').clone().removeClass('pattern').removeClass('non-display');
        var token = tokens.splice(0, 1)[0];
        eToken.html(token);
        eTokens.append(eToken);
        eTokens.append(" ");
    }
    element.find('.slide-content').append(group);
}

function setListenAndTypeQuestion(val, element) {
    var group = $('.practice-groups .listen-and-type').clone();
    group.find('.question img').data('src', val.content);
    group.find('.answers input').data('answer', val.answers[0].content.toLowerCase());
    element.find('.slide-content').append(group);
}

function catchEventSelectToken() {
    $('.slide.active .answers .token').on('click', function () {
        var toggleClass = '.answer-area';
        if ($(this).parent().hasClass('answer-area'))
            toggleClass = '.tokens-area';

        $(this).parents('.answers').find(toggleClass).append($(this)).append(' ');
        if ($('.slide.active .tokens-area .token:visible').length === 0) {
            if ($('.slide.active .answer-area').text().trim() === $('.slide.active .answer-area').data('answer')) {
                success();
            }
        }
    });
}
var moveSlideEnable = true;
function catchEventMoveSlide() {
    var mouseDown = false;
    var mouseXStart = 0;
    var mouseYStart = 0;
    //    var timeStart = 0;
    $('#wrapper').on('vmousedown', function (e) {
        mouseXStart = e.clientX;
        mouseYStart = e.clientY;
    });
    $('#wrapper').on('vmouseup', function (e) {
        if (!moveSlideEnable) {
            return;
        }
        var distance = e.clientX - mouseXStart;
        if (Math.abs(distance) > 20 && Math.abs(e.clientY - mouseYStart) < Math.abs(distance)) {
            if (distance < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });
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
    if (index < $('.slide.learning').length - 2) {
        $('.slide.active').animate({'left': '-100%'});
        $('.slide.slide-' + (index + 1)).animate({'left': '0%'});
        $('.slide.active').removeClass('active');
        $('.slide.slide-' + (index + 1)).addClass('active');
        selectSlideItem(0);
    } else {
        $('.slide.active').animate({'left': '-100%'});
        $('.slide.question-want-practice').animate({'left': '0%'});
    }
}

function catchEventYesClick() {
    $('.slide.question-want-practice .yes').on('click', function () {
        var index = $('.slide.active').data('index');
        $('.slide.slide-' + (index + 1)).animate({'left': '0%'});
        $('.slide.question-want-practice').animate({'left': '-100%'});
        $('.slide.active').removeClass('active');
        $('.slide.slide-' + (index + 1)).addClass('active');
        moveSlideEnable = false;
        catchEventSelectToken();
        catchEventTypeAnswer();
        catchEventChooseAnswer();
        $('.check-and-next').removeClass('non-display');
        $('.slide-nav').addClass('non-display');
    });
}

function catchEventNoClick() {
    $('.slide.question-want-practice .no').on('click', function () {
        $('.slide.question-want-practice').animate({'left': '100%'});
        $('.slide.active').animate({'left': '0%'});
        selectSlideItem(0);
    });
}

function prevScreen() {
    var index = $('.slide.active').data('index');
    if (index > 0) {
        $('.slide.active').animate({'left': '100%'});
        $('.slide.slide-' + (index - 1)).animate({'left': '0%'});
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
    $('.slide-nav .dot').on('click', function () {
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
        eCurrent.animate({'left': '100%'}, function () {
            eCurrent.addClass('non-display');
        });
        eChoose.css({'left': '-100%'});
        eChoose.animate({'left': '0%'});
    } else {
        eCurrent.animate({'left': '-100%'}, function () {
            eCurrent.addClass('non-display');
        });
        eChoose.css({'left': '100%'});
        eChoose.animate({'left': '0%'});
    }
}

function catchEventClickAudioIcon() {
    $('.audio img').on('click', function () {
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
