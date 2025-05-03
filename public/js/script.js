$(document).ready(function() {
    $.ajax({
        url: 'http://numbersapi.com/1/30/date?json',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data?.found) {

                $('#fact-container').html(`
                    <p>${data?.text}</p>
                    <small class="text-muted">Historical fitness fact</small>
                `);
            } else {
                $('#fact-container').html('<p>No interesting fact found for today.</p>');
            }
        },
        error: function() {
            $('#fact-container').html('<p>Could not load fitness fact. Try again later.</p>');
        }
    });

    const $dropArea = $('#drop-area');
    const $fileInput = $('#file-input');
    const $browseBtn = $('#browse-btn');
    const $uploadBtn = $('#upload-btn');
    const $preview = $('#preview');
    const $uploadStatus = $('#upload-status');

    let files = [];

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        $dropArea.on(eventName, preventDefaults);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        $dropArea.on(eventName, highlight);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        $dropArea.on(eventName, unhighlight);
    });

    function highlight() {
        $dropArea.addClass('highlight');
    }

    function unhighlight() {
        $dropArea.removeClass('highlight');
    }

    $dropArea.on('drop', function(e) {
        const dt = e.originalEvent.dataTransfer;
        files = dt.files;
        handleFiles(files);
    });

    $browseBtn.on('click', function() {
        $fileInput.trigger('click');
    });

    $fileInput.on('change', function() {
        files = this.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        $preview.empty();
        if (files.length > 0) {
            $uploadBtn.show();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        $preview.append($('<img>').attr('src', e.target.result));
                    }
                    reader.readAsDataURL(file);
                }
            }
        } else {
            $uploadBtn.hide();
        }
    }

    $uploadBtn.on('click', function() {
        if (files.length === 0) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        $uploadStatus.html('<p class="text-info">Uploading images...</p>');

        $.ajax({
            url: '/upload',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                $uploadStatus.html(`<p class="text-success">${response.message}</p>`);
                $uploadBtn.hide();
                files = [];
            },
            error: function(xhr) {
                $uploadStatus.html(`<p class="text-danger">Error: ${xhr.responseJSON?.error || 'Upload failed'}</p>`);
            }
        });
    });

    $(window).scroll(function() {
        $('.feature-card').each(function() {
            const position = $(this).offset().top;
            const scroll = $(window).scrollTop();
            const windowHeight = $(window).height();

            if (scroll > position - windowHeight + 200) {
                $(this).addClass('animate__zoomIn');
            }
        });
    });
});