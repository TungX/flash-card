/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var form_method = 'post';
var word_id = undefined;
var highlightAtClass = ['examples', 'word-families', 'word-relationships'];
$(document).ready(function () {
    catchEventAddWordClick();
    catchEventClickAddElement();
    catchEventClickRemoveElement();
    catchEventClickNavItem();
    catchEventWordFormSubmit();
    loadWords();
    catchEventEditWordClick();
    catchEventHighLineTextClick();
    catchEventImageChange();
});

function catchEventHighLineTextClick() {
    $('.btn.highlight').on('click', function () {
        if (!highlightAtClass.includes($('.nav-item a.active').data('class'))) {
            return;
        }
        if (window.getSelection) {
            var selection = window.getSelection();
            if (selection.isCollapsed) {
                var content = $(selection.baseNode).find('textarea');

                if (content.length === 1) {
                    var text = content.val();
                    var selectionText = selection.toString();
                    if (selectionText.trim().length === 0)
                        return;
                    text = text.replace(selectionText, '<strong>' + selectionText + '</strong>');
                    content.val(text);
                }
            }
        }

//        else if (document.selection && document.selection.type !== 'Control') {
//            text = document.selection.createRange().text;
//        }


    });
}

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
        url: "/api/words" + window.location.search
    }).done(function (response) {
        if (response.status === 0) {
            alert("Has error " + response.message);
        } else {
            console.log(response);
            var words = response.words;
            var query = getAllUrlParams();
            var page = +(query.page || 0);
            if (page == 0) {
                $('#page-prev').attr("disabled", 'disabled');
                $('#page-prev').off('click');
            } else {
                $('#page-prev').attr('href', '/words/?page=' + (page - 1));
            }

            if (words.length < 10) {
                $('#page-next').attr("disabled", 'disabled');
                $('#page-next').off('click');
            } else {
                $('#page-next').attr('href', '/words/?page=' + (page + 1));
            }
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
                    if (word.descriptions[j].type === 'image') {
                        element.html('<img src=' + word.descriptions[j].content + '>')
                    } else {
                        element.html(word.descriptions[j].content);
                    }

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
        catchEventImageChange();
    });
}

function catchEventClickRemoveElement() {
    $('.remove-element a').off('click');
    $('.remove-element a').on('click', function () {
        var group = $(this).parents('.group');
        group.remove();
    });
}

function catchEventClickNavItem() {
    $('#add-word .nav-item').on('click', function () {
        $('#add-word .' + $('#add-word .active a').data('class')).addClass('non-display');
        $('#add-word .active').removeClass('active');
        $(this).addClass('active');
        var tabClass = $(this).find('a').data('class');
        console.log(tabClass);
        if (highlightAtClass.includes(tabClass)) {
            $('.btn.highlight').removeClass('non-display');
        } else {
            $('.btn.highlight').addClass('non-display');
        }
        $('#add-word .' + tabClass).removeClass('non-display');
    });
}
function readFile(element) {
    if (element.files && element.files[0]) {

        var FR = new FileReader();
        var group = $(element).parents('.form-group');
        FR.onload = function (e) {
            group.find("img")[0].src = e.target.result;
        };
        FR.onerror = function (event) {
            alert("I AM ERROR: " + event.target.error.code);
        };
        FR.readAsDataURL(element.files[0]);
    }
}
function catchEventImageChange() {
    $('.tab-content.descriptions input[type=file]').off('change');
    $('.tab-content.descriptions input[type=file]').on('change', function () {
        readFile(this);
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


            pronc.type = 'text';
            if (group.find('.content').is('input')) {
                pronc.type = 'image';
                pronc.content = group.find('img')[0].src;
            } else
                pronc.content = group.find('.content').val();
            if (pronc.content === '') {
                continue;
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
                if (word.descriptions[0].type === 'text')
                    setDescriptionsValue(word.descriptions[0], modal.find('.descriptions .pattern'));
                else
                    setDescriptionsValue(word.descriptions[0], modal.find('.descriptions .pattern-file'));
                for (var i = 1; i < word.descriptions.length; i++) {
                    var val = word.descriptions[i];
                    var element;
                    if (val.type === 'text')
                        element = modal.find('.descriptions .pattern').clone().removeClass('pattern');
                    else {
                        element = modal.find('.descriptions .pattern-file');
                        if (element.find('img')[0].src.length > 0) {
                            element = element.clone().removeClass('pattern-file');
                        }
                    }

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
                catchEventClickRemoveElement();
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
    if (val.type === 'image') {
//        element.find('input').val('./image.jpg');
        element.find('img')[0].src = val.content;
        return true;
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
function getAllUrlParams() {

    // get query string from url (optional) or window
    var queryString = window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string')
                paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key])
                    obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}
