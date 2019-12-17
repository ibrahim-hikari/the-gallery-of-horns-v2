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

function renderOptions() {
    let seen = {};
    let chosen = $('.filter')
    $(chosen).empty();
    Gallery.all.forEach(animal => {

        if (!seen[animal.keyword]) {
            $(chosen).append(`<option value ="${animal.keyword}">${animal.keyword}</option>`);
            seen[animal.keyword] = true;
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
    $(`#${chosen}`).fadeIn(1000);
});

$('button').click(function () {
    let pageNum = $('button').attr('id');
    renderData(pageNum)
});

function renderData(pageNum) {
    $('#photo-template').html('');
    Gallery.all = [];
    $.get(`../data/page-${pageNum}.json`)
        .then(data => {
            data.forEach(object => {
                let singleAnimal = new Gallery(object);
                singleAnimal.render();
            });
        })
        .then(() => renderOptions())
        .then(() => renderSortsTypes())
}

$(document).ready(function () {
    renderData(1)
});