/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extensions = ['#examples', '#word-family', '#word-description', '#word-relationship'];
var form_method = 'post';
var word_id = undefined;
$(document).ready(function () {
    catchEventAddWordClick();
    catchEventChooseDot();
    catchEventClickAudioIcon();
    catchEventClickEnglish();
    catchEventClickAddElement();
    catchEventClickRemoveElement();
    catchEventClickNavItem();
    catchEventWordFormSubmit();
    loadWords();
    catchEventEditWordClick();
});

function catchEventAddWordClick() {
    $('.btn.addword').on('click', function () {
        form_method = 'post';
        $('#add-word').modal('show');
    });
}

function loadWords() {
    if ($('table#words').length !== 1) {
        return;
    }
    $.ajax({
        method: "GET",
        url: "/api/words"
    }).done(function (response) {
        if (response.status === 0) {
            alert("Has error " + response.message);
        } else {
            console.log(response);
            var words = response.words;
            for (var i = 0; i < words.length; i++) {
                var word = words[i];
                var row = $('table#words tr.pattern').clone().removeClass('pattern').removeClass('non-display');
                row.find('.order').html(i + 1);
                row.find('.type').html('(' + word.type + ')');
                row.find('.content').html(word.content);
                row.data('id', word._id);
                var proncs = row.find('.proncs ul');
                for (var j = 0; j < word.proncs.length; j++) {
                    var pronElement = proncs.find('li.pattern').clone().removeClass('pattern').removeClass('non-display');
                    pronElement.html('(' + word.proncs[j].dialect + ') ' + word.proncs[j].content);
                    proncs.append(pronElement);
                }

                var word_families = row.find('.word_families ol');
                for (var j = 0; j < word.word_families.length; j++) {
                    var element = word_families.find('li.pattern').clone().removeClass('pattern').removeClass('non-display');
                    element.html('(' + word.word_families[j].type + ') ' + word.word_families[j].content);
                    word_families.append(element);
                }

                var descriptions = row.find('.descriptions ol');
                for (var j = 0; j < word.descriptions.length; j++) {
                    var element = descriptions.find('li.pattern').clone().removeClass('pattern').removeClass('non-display');
                    element.html(word.descriptions[j].content);
                    descriptions.append(element);
                }

                var examples = row.find('.examples ol');
                for (var j = 0; j < word.examples.length; j++) {
                    var element = examples.find('li.pattern').clone().removeClass('pattern').removeClass('non-display');
                    element.html(word.examples[j].content);
                    examples.append(element);
                }

                var relationships = row.find('.relationships ul');
                for (var j = 0; j < word.relationships.length; j++) {
                    var type = word.relationships[j].type;
                    relationships.find('li.' + type).removeClass('non-display');
                    var element = relationships.find('li.' + type + ' li.pattern').clone().removeClass('pattern').removeClass('non-display');
                    element.html(word.relationships[j].content);
                    relationships.find('li.' + type + ' ol').append(element);
                }
                if (word.relationships.length > 0) {
                    relationships.removeClass('non-display');
                }
                $('table#words tbody').append(row);
            }
            catchEventEditWordClick();
        }
    }).fail(function (e) {
        alert("Has error when load words");
    });

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

function catchEventClickAddElement() {
    $('.add-element a').on('click', function () {
        var e = $(this).parent();
        var classPattern = 'pattern' + (e.data('type') || '');
        var wrapperContent = e.parent().find('.wrapper-content');
        var element = wrapperContent.find('.' + classPattern).clone().removeClass(classPattern);
        element.find('.remove-element').removeClass('non-display');
        element.find('input').val('');
        element.find('textarea').val('');
        wrapperContent.append(element);
        catchEventClickRemoveElement();
    });
}

function catchEventClickRemoveElement() {
    $('.remove-element a').on('click', function () {
        var group = $(this).parents('.group');
        group.remove();
    });
}

function catchEventClickNavItem() {
    $('#add-word .nav-item a').on('click', function () {
        $('#add-word .' + $('#add-word .active').data('class')).addClass('non-display');
        $('#add-word .active').removeClass('active');
        $(this).addClass('active');
        var tabClass = $(this).data('class');
        console.log(tabClass);
        $('#add-word .' + tabClass).removeClass('non-display');
    });
}

function catchEventWordFormSubmit() {
    $('#add-word form').on('submit', function (e) {
        e.preventDefault();
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
            pronc.content = group.find('.content').val().trim();
            if (pronc.content.length === 0)
                continue;
            pronc.type = group.find('select').val().trim();
            pronc.example = group.find('.example').val().trim();
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
            pronc.content = group.find('.content').val().trim();
            if (pronc.content.length === 0)
                continue;
            pronc.type = group.find('select').val().trim();
            pronc.example = group.find('.example').val().trim();
            data['relationships'].push(pronc);
        }
        var url = "/api/words";
        if (form_method === 'put') {
            url += '/' + word_id;
        }
        $.ajax({
            method: form_method.toLocaleUpperCase(),
            url: url,
            data: data
        }).done(function (response) {
            if (response.status === 0) {
                alert("Has error " + response.message);
            } else {
                window.location.replace("/words");
            }
        }).fail(function (e) {
            alert("Has error when save");
        });
        return false;
    });
}

function catchEventEditWordClick() {
    $('.edit-word').on('click', function () {
        console.log('edit word');
        var row = $(this).parents('tr');
        var id = row.data('id');
        $.ajax({
            method: "GET",
            url: "/api/words/" + id
        }).done(function (response) {
            if (response.status === 0) {
                alert("Has error " + response.message);
            } else {
                resetForm();
                word_id = id;
                form_method = 'put';
                console.log(response);
                var word = response.word;
                var modal = $('#add-word');
                modal.find('.modal-title').html('Update ' + word.content);
                modal.find('.word-info select').val(word.type);
                modal.find('.word-info input').val(word.content);

                setProncValue(word.proncs[0], modal.find('.pronunciations .pattern'));
                for (var i = 1; i < word.proncs.length; i++) {
                    var val = word.proncs[i];
                    var element = modal.find('.pronunciations .pattern').clone().removeClass('pattern');
                    element.find('.remove-element').removeClass('non-display');
                    if (setProncValue(val, element)) {
                        modal.find('.pronunciations .wrapper-content').append(element);
                    }
                }

                setWordFamiliesValue(word.word_families[0], modal.find('.word-families .pattern'));
                for (var i = 1; i < word.word_families.length; i++) {
                    var val = word.word_families[i];
                    var element = modal.find('.word-families .pattern').clone().removeClass('pattern');
                    element.find('.remove-element').removeClass('non-display');
                    if (setWordFamiliesValue(val, element)) {
                        modal.find('.word-families .wrapper-content').append(element);
                    }
                }

                setExamplesValue(word.examples[0], modal.find('.examples .pattern'));
                for (var i = 1; i < word.examples.length; i++) {
                    var val = word.examples[i];
                    var element = modal.find('.examples .pattern').clone().removeClass('pattern');
                    element.find('.remove-element').removeClass('non-display');
                    if (setExamplesValue(val, element)) {
                        modal.find('.examples .wrapper-content').append(element);
                    }
                }

                setDescriptionsValue(word.descriptions[0], modal.find('.descriptions .pattern'));
                for (var i = 1; i < word.descriptions.length; i++) {
                    var val = word.descriptions[i];
                    var element = modal.find('.descriptions .pattern').clone().removeClass('pattern');
                    element.find('.remove-element').removeClass('non-display');
                    if (setDescriptionsValue(val, element)) {
                        modal.find('.descriptions .wrapper-content').append(element);
                    }
                }

                setWordRelationshipsValue(word.relationships[0], modal.find('.word-relationships .pattern'));
                for (var i = 1; i < word.relationships.length; i++) {
                    var val = word.relationships[i];
                    var element = modal.find('.word-relationships .pattern').clone().removeClass('pattern');
                    element.find('.remove-element').removeClass('non-display');
                    if (setWordRelationshipsValue(val, element)) {
                        modal.find('.word-relationships .wrapper-content').append(element);
                    }
                }

                modal.modal('show');

//                window.location.replace("/words");
            }
        }).fail(function (e) {
            alert("Has error when save");
        });
    });
}

function setProncValue(val, element) {
    if (!val) {
        return false;
    }
    element.find('select').val(val.dialect);
    element.find('.content').val(val.content);
    element.find('.audio_url').val(val.audio_url);
    return true;
}

function setWordFamiliesValue(val, element) {
    if (!val) {
        return false;
    }
    element.find('select').val(val.type);
    element.find('.content').val(val.content);
    element.find('.example').val(val.example);
    return true;
}

function setExamplesValue(val, element) {
    if (!val) {
        return false;
    }
    element.find('.content_vi').val(val.content_vi);
    element.find('.content').val(val.content);
    element.find('.audio_url').val(val.audio_url);
    return true;
}

function setDescriptionsValue(val, element) {
    if (!val) {
        return false;
    }
    element.find('.content').val(val.content);
    return true;
}

function setWordRelationshipsValue(val, element) {
    if (!val) {
        return false;
    }
    element.find('select').val(val.type);
    element.find('.content').val(val.content);
    element.find('.example').val(val.example);
    return true;
}

function resetForm() {
    var modal = $('#add-word');
    var groups = modal.find('.group');
    for (var i = 0; i < groups.length; i++) {
        var classes = $(groups[i]).attr('class');
        if (!classes.includes('pattern')) {
            groups[i].remove();
        }
    }

    var inputs = modal.find('input');
    for (var i = 0; i < inputs.length; i++) {
        $(inputs[i]).val('');
    }

    var textareas = modal.find('textarea');
    for (var i = 0; i < textareas.length; i++) {
        $(textareas[i]).val('');
    }
}
