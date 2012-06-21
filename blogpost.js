var blogPostId = -1;
var token = "";

$(document).ready(function () {
    setSizes();

    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == "id") {
            blogPostId = pair[1];
        } else if (pair[0] == "accesstoken") {
            token = pair[1];
        }
    }

    if (blogPostId != -1 && token != "") {
        getBlogPost(blogPostId);
    }
});

function createXMLHttp() {
    if (typeof XMLHttpRequest != "undefined") {
        if (window.XDomainRequest) {
            // newer IE
            return new XDomainRequest();
        } else {
            // Mozilla and WebKit
            return new XMLHttpRequest();
        }
    } else if (window.ActiveXObject) {
        // older IE
        var aVersions = ["MSXML2.XMLHttp.5.0", "MSXML2.XMLHttp.4.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp", "Microsoft.XMLHttp"];

        for (var i = 0; i < aVersions.length; i++) {
            try {
                var oXmlHttp = new ActiveXObject(aVersions[i]);
                return oXmlHttp;
            } catch(oError) {
                throw new Error("XMLHttp object could be created.");
            }
        }
    }
    throw new Error("XMLHttpRequest object could be not created.");
}

function getBlogPost(id) {
    var method = "GET";
    var url = "http://dev.developer.api.ingageprojects.com/v1/blogs/posts/" + id;
    var req = new createXMLHttp();

    if (req) {
        req.open(method, url, true);
        req.setRequestHeader("X-STS-AccessToken", token);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json");
        req.onload = function () {

            if (req.readyState == 4) {

                // hide the loader gif here
                $('div#loadmoreajaxloader').hide();

                if (req.status == 200) {

                    var response = eval("(" + req.responseText + ")");
                    var blogPost = response.BlogPost;

                    var title = document.createElement("h1");
                    title.innerHTML = blogPost.Title;

                    var body = document.createElement("p");
                    body.innerHTML = blogPost.Body;

                    $("#title").append(title);
                    $("#body").append(body);

                } else {
                    alert("Invocation Errors Occured " + req.readyState + " and the status is " + req.status);
                }

                $('#main').scroll();

            } else {
                response = eval("(" + req.responseText + ")");

                var temp2 = 42;
            }
        };

        req.onerror = function (evt) {
            throw new Error("XMLHttpRequest encountered an error");
        };

        req.send(null);
        
    } else {
        throw new Error("Cannot Make Ajax Request");
    }
}

$(window).resize(function () {
    setSizes();
});

function setSizes() {
    var windowHeight = $(window).outerHeight();
    var headerHeight = $("#header").outerHeight();
    var footerHeight = $("#footer").outerHeight();

    var newPostswrapperHeight = windowHeight - headerHeight - footerHeight - 1;

    $("#postswrapper").height(newPostswrapperHeight);
}
