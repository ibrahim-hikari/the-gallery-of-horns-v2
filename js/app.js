`use strict`;

function Gallery(data) {
    this.image_url = data.image_url;
    this.title = data.title;
    this.description = data.description;
    this.keyword = data.keyword;
    this.horns = data.horns;
    Gallery.all.push(this);
}

Gallery.all = [];

Gallery.prototype.render = function () {

    let templateMarkup = $('#horns-template').html();
    let template = Handlebars.compile(templateMarkup);
    let galleryOutput = template(this);
    $('#photo-template').append(galleryOutput);
    $('div').hide();
    $('div').fadeIn(1000);
}

$(document).ready(function () {
    let rand = Math.ceil(Math.random() * 2)
    renderData(rand);
});

function renderOptions() {
    let seen = [];
    $('.filter').html('');

    Gallery.all.forEach(animal => {
        for (let i = -1; i < seen.length; i++) {
            if (seen[i] != animal.keyword) {
                $('.filter').append(`<option value ="${animal.keyword}">${animal.keyword}</option>`);
                seen[i] = animal.keyword;
            }
        }
    });
}

function renderSortsTypes() {
    $('.sort').on('change', function () {
        if ($('.sort').val() == 'title') {
            titleSort();
            $('#photo-template').html('');
            Gallery.all.forEach(animal => {
                animal.render();
            });
        } else if ($('.sort').val() == 'number') {
            numberSort();
            $('#photo-template').html('');
            Gallery.all.forEach(animal => {
                animal.render();
            });
        }
    });
}

function titleSort() {
    Gallery.all.sort(function (a, b) {
        let firstName = a.title;
        let secondName = b.title;
        if (firstName < secondName) {
            return -1;
        }
        if (firstName > secondName) {
            return 1;
        }
        return 0;
    })
}

function numberSort() {
    Gallery.all.sort(function (a, b) {
        let firstNum = a.horns;
        let secondNum = b.horns;
        if (firstNum < secondNum) {
            return -1;
        }
        if (firstNum > secondNum) {
            return 1;
        }
        return 0;
    })
}

$('.filter').on('change', function () {
    let chosen = $(this).val();
    $('div').hide();
    $(`.${chosen}`).fadeIn(1000);
});

$('button').click(function () {
    let num = $(this).attr('id');
    renderData(num);
});

function renderData(number) {
    $('#photo-template').html('');
    Gallery.all = [];
    $.getJSON(`../data/page-${number}.json`, function (data) {
        $.each(data, function (key, val) {
            let single = new Gallery(val);
            single.render()
        });
        renderOptions()
        renderSortsTypes()
    });
}

$('#photo-template').click(function (event) {
    event.preventDefault();
    $('div').on('click', function () {
        $(this).css({ 'height': '500px', 'position': 'fixed', 'top': '50%', 'left': '50%', 'transform': 'translate(-50%,-50%)', 'z-index': '33' });
    });
});
