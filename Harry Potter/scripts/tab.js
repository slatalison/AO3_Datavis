function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab");
    var tabButton;
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tabButton = document.getElementsByClassName("tabButton");
    document.getElementById(tabName).style.display = "block";

    for (i = 0; i < x.length; i++) {
        tabButton[i].className = tabButton[i].className.replace("tabButtonOn", "");
    }

};


$(function () {
    $("#b1").click(function () {
        $("#b1").addClass("on");
        $("#b2").removeClass("on");
    })
})

$(function () {
    $("#b2").click(function () {
        $("#b2").addClass("on");
        $("#b1").removeClass("on");
    })
})