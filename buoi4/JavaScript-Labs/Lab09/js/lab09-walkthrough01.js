/* code goes here */
var msg = document.getElementById("msgArea");
msg.value = "here is some text";
// var title = document.getElementById("pageTitle");
// title.innerHTML = "New Title";
document.getElementById("pageTitle").innerHTML = "Even newer title";
//LẤY HẾT
//msg.value = document.getElementById("first").innerHTML;
// CHỈ LẤY PHẦN VĂN BẢN CỦA THẺ
msg.value = document.getElementById("first").innerText;
//LẤY THUỘC TÍNH CLASS
//msg.value = "My class is " + msg.getAttribute("class");
// TÌM PHẦN TỬ THEO TÊN 
// var elem = document.getElementsByTagName("textarea");
// elem[0].value = "selected by tag name";
//LẤY TẤT CẢ THẺ SPAN
elem = document.getElementsByTagName("span");
for (i = 0; i < elem.length; i++) {
    document.getElementById("msgArea").value += "\n" + elem[i].innerText;
}
// LẤY PHẦN TỬ THEO CLASS
document.getElementById("msgArea").value = "";

var counts = document.getElementsByClassName("count-number");

for (i = 0; i < counts.length; i++) {
    document.getElementById("msgArea").value += "\n" + counts[i].innerText;
}

// SỬ DỤNG QUERY SELECTOR
var ps = document.querySelector("#first p");
document.getElementById("msgArea").value = ps.innerHTML;
 // SỬ DUNG QUERY SELECTOR ALL
 ps = document.querySelectorAll("#first p");
for (i = 0; i < ps.length; i++) {
    document.getElementById("msgArea").value += ps[i].innerHTML + "\n";
}
// THAY ĐỔI CLASS CỦA PHẦN TỬ CỤ THỂ LÀ ẨN 
document.getElementById("msgArea").setAttribute("class", "hidden");
// THAY ĐỔI MÀU NỀN
document.getElementById("features").style.backgroundColor = "green";
//