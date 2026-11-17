/* try the different advanced selection calls here */
//CHỌN PASSWORD 
// $(function () {
    // $(':password').css('background-color', 'yellow');
// });
//CHỌN CON 
$('form :nth-child(4n)').css(
    'background-color',
    'yellow'
);
//CHỌN NHÃN
$('label:contains("word")').css('color', 'black');
