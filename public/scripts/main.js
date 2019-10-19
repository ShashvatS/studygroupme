//can have multiple document.ready calls
$(document).ready(() => {
    $('#mainform').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: '/test',
            type: 'post',
            data: $('#mainform').serialize(),
            success: response => {
                console.log("mainform submit response");
                console.log(response);
            }
        });

        return false;
    });

});
