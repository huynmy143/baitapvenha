/* try the different selection calls here */
// BƯỚC 1: CHỌN PHẦN TỬ THEO ID
var	msg	=	$('#msgArea');
msg.val("here	is	some	new	text");
// ĐỔI NỘI DUNG
//$('#first').html("new Title");
//ĐỌC THUỘC TÍNH 
$('#msgArea').val(
    "My class is " + $('#msgArea').attr("class")
);
//BUTTON
var buttons = $('button');
buttons.css('background-color', 'red');
//CHỌN THẺ BODY
$('body').css('background-color', 'ivory');
// CHỌN THEO CLASS
$('.center-icons').addClass('selected');