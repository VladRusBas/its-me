function addContactFunc() {
    var contact = $('#addContactText').val();
    var contactData = {
        contact: contact
    };
    $.ajax({
        type: 'POST',
        url: '/edit/contacts',
        data: contactData,
        success: function(data) {
            $('li.contact:last-of-type').before('<li class="contact">' + data.contacts[data.contacts.length - 1] + '<button type="button" name="deleteContact-' + (data.contacts.length - 1) + '">Delete</button></li>')
            $('#addContactText').val('');
            $(document).on('click', 'button[name="deleteContact-' + (data.contacts.length - 1) + '"]', deleteContactFunc);
        }
    });
}

function deleteContactFunc() {
    var index = $(this).prop('name').split('-')[1];
    var indexData = {
        index: index
    };
    $.ajax({
        type: 'DELETE',
        url: '/edit/contacts/' + index,
        data: indexData,
        success: function(data) {
            $('button[name="deleteContact-' + data.index + '"]').parent().remove()
        }
    });
}

$(document).ready(function() {
    $('#save-about').click(function(event) {
        event.preventDefault();
        var name = $('#about-name').val();
        var additional = $('#about-additional').val();
        var description = $('#about-description').val();

        var dataAbout = {
            name: name,
            additional: additional,
            description: description
        };

        $.ajax({
            type: 'POST',
            url: '/edit/about',
            data: dataAbout,
            success: function(data) {
                $('textarea').css('box-shadow', '0 0 3px 3px #80ee81')
            }
        });
    });

    $('textarea').change(function() {
        $(this).css('box-shadow', '0 0 3px 3px #cccd77');
    });

    $('#addContact').click(addContactFunc);

    $('button[name|="deleteContact"]').click(deleteContactFunc);
});
