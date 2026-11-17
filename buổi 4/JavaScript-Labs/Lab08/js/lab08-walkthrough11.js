// define constructor function for Country objects
function Country(name, iso, capital, population) {
    this.name = name;
    this.iso = iso;
    this.capital = capital;
    this.population = population;
}

// create an array of country objects
var countries = [
    new Country("Bahamas", "BS", "Nassau", 301790),
    new Country("Canada", "CA", "Ottawa", 33679000),
    new Country("Germany", "DE", "Berlin", 81802257),
];

// you can also push each new country object onto the end of the array
countries.push(new Country("Spain", "ES", "Madrid", 46505963));
countries.push(new Country("United Kingdom", "GB", "London", 62348447));
///
// BƯỚC 1 
// for (i = 0; i < countries.length; i++) {
//     document.write(countries[i].name);
//     document.write("<br>");
// }
// BƯỚC 2 SỬ DỤNG BIẾN TẠM
// for (i = 0; i < countries.length; i++) {
//     var c = countries[i];
//     document.write(c.name);
//     document.write("<br>");
// }
//BƯỚC 3 TRUY CẬP BẰNG NGOẶT VUÔNG

// for (i = 0; i < countries.length; i++) {
//     var c = countries[i];
//     document.write(c["name"]);
//     document.write("<br>");
// }

// BƯỚC 4 SỬ DỤNG BIẾN ĐỂ TRUY CẬP CÁC THUỘC TÍNH

// for (i = 0; i < countries.length; i++) {
//     var c = countries[i];
//     var temp = "name";
//     document.write(c[temp]);
//     document.write("<br>");
// }
// BƯỚC 5

for (i = 0; i < countries.length; i++) {
    var c = countries[i];

    document.write("<div class='box'>");
    document.write("<img src='flags/" + c.iso + ".png' class='boxImg'>");

    for (var propertyName in c) {
        document.write("<strong>");
        document.write(propertyName + ": ");
        document.write("</strong>");
        document.write(c[propertyName]);
        document.write("<br>");
    }

    document.write("</div>");
}
