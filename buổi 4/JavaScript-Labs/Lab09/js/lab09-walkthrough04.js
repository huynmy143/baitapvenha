/* code goes here */
// TẠO HIỆU ỨNG CLICK CHO BUTTON
function simpleHandler(event) {
    alert("button was clicked");
}

var btn = document.getElementById("testButton");

btn.addEventListener("click", simpleHandler);

//TẠO HIỆU ỨNG KHI RÊ CHUỘT VÀO BUTTON (ẢNH CHUYỂN XÁM KHI RÊ CHUỘT VÀO)
var img = document.getElementById("mainImage");
/* changes the style of the image when it is moused over */
img.addEventListener("mouseover", function (event) {
    img.className = "makeItGray";
});
// KHÔI PHỤC LẠI HÌNH ẢNH KHI RỜI CHUỘT RA KHỎI BUTTON
/* remove the styling when mouse leaves image */
img.addEventListener("mouseout", function (event) {
    img.className = "makeItNormal";
});
//TẠO NÚT ẨN HIỆN ND
function simpleHandler(event) {
    var content = document.getElementById("content");

    if (btn.innerHTML == "Hide") {
        content.style.display = "none";
        btn.innerHTML = "Show";
    }
    else {
        content.style.display = "block";
        btn.innerHTML = "Hide";
    }
}

//Tạo hiệu ứng chuyển động bằng setTimeout()
function simpleHandler(event) {
    var content = document.getElementById("content");

    if (btn.innerHTML == "Hide") {
        btn.innerHTML = "Show";
        content.className = "makeItDisappear";

        // change the display mode after a 1000 millisecond delay
        setTimeout(function(){
            content.style.display = "none";
        }, 1000);
    }
    else {
        btn.innerHTML = "Hide";
        content.style.display = "block";

        // change the class after a 500 millisecond delay
        setTimeout(function(){
            content.className = "makeItNormal";
        }, 500);
    }
}