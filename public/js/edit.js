$(document).ready(function() {
    $('#save-about').click(function(event) {
        event.preventDefault();
        var name = $('#about-name').val();
        var additional = $('#about-additional').val();
        var description = $('#about-description').val();

        var dataAbout = { name: name, additional: additional, description: description };

        $.ajax({
          type: 'POST',
          url: '/edit/about',
          data: dataAbout,
          success: function(data){
              $('textarea').css('box-shadow', '0 0 3px 3px #80ee81')
              $('#about-name').val(data.about.name);
              $('#about-additional').val(data.about.additional);
              $('#about-description').val(data.about.description);
          }
        });
    });

    $('textarea').change(function() {
        $(this).css('box-shadow', '0 0 3px 3px #cccd77');
    });
});
