$(document).ready(function () {
    $("#apiRequestHost").text(location.protocol + '//' + location.hostname);

    const apiRequest = $("#apiRequest");
    const queryResult = $("#queryResult");

    $.get(apiRequest.attr("placeholder"),
        function (data, status) {
            queryResult.text(JSON.stringify(data, undefined, '\t'));
        });

    $("#sample").submit(function (e) {
        e.preventDefault();

        let request = apiRequest.val();
        if (!request) request = apiRequest.attr("placeholder");

        $.get(request,
        function (data, status) {
            queryResult.text(JSON.stringify(data, undefined, '\t'));
        });
    });

});