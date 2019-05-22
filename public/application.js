/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extensions = ['#examples', '#word-family', '#word-description', '#word-relationship'];
$(document).ready(function() {
    catchEventChooseDot();
    catchEventClickAudioIcon();
    catchEventClickEnglish();
    catchEventClickAddElement();
    catchEventClickRemoveElement();
    catchEventClickNavItem();
    catchEventWordFormSubmit();
});

function catchEventChooseDot() {
    $('#slide-nav .dot').on('click', function() {
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
            eCurrent.animate({ 'left': '100%' });
            eChoose.animate({ 'left': '0%' });
        } else {
            eCurrent.animate({ 'left': '-100%' });
            eChoose.animate({ 'left': '0%' });
        }
        $(this).addClass('active');
    });
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

function catchEventClickAddElement() {
    $('.add-element').on('click', function() {
        var classPattern = 'pattern' + ($(this).data('type') || '');
        var wrapperContent = $(this).parent().find('.wrapper-content');
        var element = wrapperContent.find('.' + classPattern).clone().removeClass(classPattern);
        element.find('.remove-element').removeClass('non-display');
        element.find('input').val('');
        element.find('textarea').val('');
        wrapperContent.append(element);
        catchEventClickRemoveElement();
    });
}

function catchEventClickRemoveElement() {
    $('.remove-element a').on('click', function() {
        var group = $(this).parents('.group');
        group.remove();
    });
}

function catchEventClickNavItem() {
    $('#add-word .nav-item a').on('click', function() {
        console.log('remove element');
        $('.' + $('#add-word .active').data('class')).addClass('non-display');
        $('#add-word .active').removeClass('active');
        $(this).addClass('active');
        var tabClass = $(this).data('class');
        console.log(tabClass);
        $('.' + tabClass).removeClass('non-display');
    });
}

function catchEventWordFormSubmit() {
    $('#add-word form').on('submit', function(e) {
        e.preventDefault();
        console.log('abc');
        var data = {};
        var wordInfo = $('.word-info');
        data['content'] = wordInfo.find('input').val();
        data['type'] = wordInfo.find('select').val();

        var proncs = $('.pronunciations .group');
        data['proncs'] = [];
        for (var i = 0; i < proncs.length; i++) {
            var group = $(proncs[i]);
            var pronc = {};
            pronc.content = group.find('.content').val();
            pronc.audio_url = group.find('.audio_url').val();
            pronc.dialect = group.find('.dialect').val();
            data['proncs'].push(pronc);
        }

        var wordFamilies = $('.word-families .group');
        data['word_families'] = [];
        for (var i = 0; i < wordFamilies.length; i++) {
            var group = $(wordFamilies[i]);
            var pronc = {};
            pronc.content = group.find('.content').val();
            pronc.type = group.find('select').val();
            pronc.example = group.find('.example').val();
            data['word_families'].push(pronc);
        }

        var examples = $('.examples .group');
        data['examples'] = [];
        for (var i = 0; i < examples.length; i++) {
            var group = $(examples[i]);
            var pronc = {};
            pronc.content = group.find('.content').val();
            pronc.content_vi = group.find('.content_vi').val();
            pronc.audio_url = group.find('.audio_url').val();
            data['examples'].push(pronc);
        }

        var descriptions = $('.descriptions .group');
        data['descriptions'] = [];
        for (var i = 0; i < descriptions.length; i++) {
            var group = $(descriptions[i]);
            var pronc = {};

            pronc.content = group.find('.content').val();
            if (pronc.content === '') {
                continue;
            }
            pronc.type = 'text';
            if (group.find('.content').is('input')) {
                pronc.type = 'image';
            }
            data['descriptions'].push(pronc);
        }

        var relationships = $('.word-relationships .group');
        data['relationships'] = [];
        for (var i = 0; i < relationships.length; i++) {
            var group = $(relationships[i]);
            var pronc = {};
            pronc.content = group.find('.content').val();
            pronc.type = group.find('select').val();
            pronc.example = group.find('.example').val();
            data['relationships'].push(pronc);
        }
        console.log(data);

        return false;
    });
}