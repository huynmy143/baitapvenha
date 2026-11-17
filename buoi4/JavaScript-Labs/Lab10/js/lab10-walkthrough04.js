/* put your event code here */
//CLICK
// $(function () {
//     $(".panel").on("click", function () {
//         $("#message").html("You clicked in the panel");
//     });
// });
// SET MES CLICK
$(function () {
    $(".panel")
        .on("mousemove", function (e) {
            $("#message").html(
                "x=" + e.pageX + " y=" + e.pageY
            );
        })
        .on("mouseleave", function () {
            $("#message").html("goodbye!");
        })
        .on("click", function () {
            $("#message").html(
                "stopped move reporting"
            );

            $(".panel").off("mousemove");
        });
});
//