$(document).ready(function () {
    $(".apiRequestHost").text(location.protocol + '//' + location.hostname);

    const apiRequest1 = $("#apiRequest1");
    const queryResult1 = $("#queryResult1");

    $.get(apiRequest1.attr("placeholder"),
        function (data, status) {
            queryResult1.text(JSON.stringify(data, undefined, '\t'));
        });

    $("#sample1").submit(function (e) {
        e.preventDefault();

        let request = apiRequest1.val();
        if (!request) request = apiRequest1.attr("placeholder");

        $.get(request,
        function (data, status) {
            queryResult1.text(JSON.stringify(data, undefined, '\t'));
        });
    });

    const apiRequest2 = $("#apiRequest2");
    const queryResult2 = $("#queryResult2");

    $.get(apiRequest2.attr("placeholder"),
        function (data, status) {
            queryResult2.text(JSON.stringify(data, undefined, '\t'));
        });

    $("#sample2").submit(function (e) {
        e.preventDefault();

        let request = apiRequest2.val();
        if (!request) request = apiRequest2.attr("placeholder");

        $.get(request,
        function (data, status) {
            queryResult2.text(JSON.stringify(data, undefined, '\t'));
        });
    });

});