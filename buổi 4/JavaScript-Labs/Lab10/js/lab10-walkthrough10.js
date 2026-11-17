$(function () {
    $('.animLoading').hide();

    $("#consume").on("click", function () {
        $('.animLoading').show();
        $("#results ul").empty();

        var url =
            "http://www.randyconnolly.com/" +
            "funwebdev/services/travel/cities.php";

        $.get(url)
            .done(function (data) {
                $.each(data, function (index, value) {
                    var li = $('<li></li>').text(value.name);
                    li.appendTo("#results ul");
                });
            })
            .fail(function (xhr, status, error) {
                alert(
                    "Failed loading data" +
                    "\nStatus: " + status +
                    "\nError: " + error
                );
            })
            .always(function () {
                $('.animLoading').fadeOut("slow");
            });
    });
});