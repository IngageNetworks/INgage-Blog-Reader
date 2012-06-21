$(document).ready(function () {
    $('div#loadmoreajaxloader').show();

    setSizes();

    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == "accesstoken") {
            token = pair[1];
        }
    }

    getBlogPosts();
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

var giOffset = 0;
var giNumPosts = 0;
var getMorePosts = true;
var getting = false;
var token = "";

function getBlogPosts() {

    if (getting === true) {
        return;
    }

    getting = true;

    var method = "GET";
    var url = "http://dev.developer.api.ingageprojects.com/v1/blogs/posts?limit=3&offset=" + giOffset;
    //var url = "http://localhost:57046/v1/blogs/posts?limit=3&offset=" + giOffset;
    //var url = "http://api.ingagenetworks.com/v1/blogs/posts?limit=3&offset=" + giOffset;
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
                    var blogPosts = response.BlogPosts;

                    if (blogPosts.length <= 0) {
                        getMorePosts = false;
                        $('div#loadmoreajaxloader').html('<center>No more blog posts to show.</center>');
                        getting = false;
                        return;
                    }

                    for (var i = 0; i < blogPosts.length; i++) {
                        if (blogPosts[i] != null) {
                            $("#main").append(makeArticle(blogPosts[i], 0));
                        }
                    }

                    if (blogPosts.length < 3) {
                        getMorePosts = false;
                        $('div#loadmoreajaxloader').html('<center>No more blog posts to show.</center>');
                    }

                    giOffset += blogPosts.length;

                } else {
                    alert("Invocation Errors Occured " + req.readyState + " and the status is " + req.status);
                }

                getting = false;

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

function makeArticle(blogPost, idx) {
    var article = document.createElement("li");

    //var blockType = "";
    var imgFile = "images/storyimg1.jpg";
    if (idx == 0) {
        //blockType = "tripleleftblock";
        imgFile = "images/storyimg1.jpg";
    } else if (idx == 1) {
        //blockType = "triplemiddleblock";
        imgFile = "images/storyimg2.jpg";
    } else {
        //blockType = "triplerightblock";
        imgFile = "images/storyimg3.jpg";
    }

    // update to do random images
    //images.eq(Math.floor(Math.random() * 8))[0]

    //article.setAttribute("class", "tripleblocks " + blockType);

    /*
    var articleImg = document.createElement("img");
    articleImg.setAttribute("class", "thumbnail");
    articleImg.setAttribute("src", imgFile);
    articleImg.setAttribute("title", "Article 1 Image Title");
    articleImg.setAttribute("alt", "Article 1 Image Alt");
    */

    var articleTitle = document.createElement("span");
    articleTitle.setAttribute("class", "caption");
    giNumPosts++;
    var link = "<a href='blogpost.html?accesstoken=" + token + "&id=" + blogPost.Id + "' target='_blank'>";
    articleTitle.innerHTML = "<b>" + link + blogPost.Title + " (id " + blogPost.Id + ")</a></b>";

    /*
    var articleAuthor = document.createElement("p");
    articleAuthor.setAttribute("class", "byline");
    articleAuthor.innerHTML = "Author: " + blogPost.Author;
    */

    var createdOn = new Date(parseInt(blogPost.CreatedOn.DateTime.substr(6)));
    var articleDate = document.createElement("p");
    articleDate.setAttribute("class", "byline");

    var dateTime = createdOn.getDate() +
        "/" +
        (createdOn.getMonth() + 1) +
        "/" +
        createdOn.getFullYear() +
        " @ " +
        createdOn.getHours() +
        ":" +
        createdOn.getMinutes() +
        ":" +
        createdOn.getSeconds();
        
    
    if (createdOn.getHours() > 11) {
        dateTime = dateTime + " " + "PM";
    } else {
        dateTime = dateTime + " " + "AM";
    }

    articleDate.innerHTML = "Posted: " + dateTime;

    var articlePreview = document.createElement("p");
    articlePreview.innerHTML = blogPost.Body;

    article.appendChild(articleTitle);
    //article.appendChild(articleImg);
    //article.appendChild(articleAuthor);
    article.appendChild(articleDate);
    article.appendChild(articlePreview);

    return article;
}

$(window).resize(function () {
    setSizes();
});

function setSizes() {
    var windowHeight = $(window).height();
    var wrapperHeight = $("#wrapper").outerHeight();
    var headerHeight = $("#header").outerHeight();
    var footerHeight = $("#footer").outerHeight();

    var newPostswrapperHeight = windowHeight - headerHeight - footerHeight - 1;

    $("#postswrapper").height(newPostswrapperHeight);

    $("#postswrapper").scroll(function () {
        var wrapper = $('#postswrapper');
        var main = $('#main');

        var mainHeight = main.height();
        var absMainOffsetTop = Math.abs(main.offset().top);
        var wrapperHeight = wrapper.height();
        var wrapperOffsetTop = wrapper.offset().top;

        if (mainHeight - absMainOffsetTop - wrapperHeight <= wrapperOffsetTop) {
            // We're at the bottom!
            $('div#loadmoreajaxloader').show();

            //console.log("reached bottom of scroll");

            getBlogPosts();
        }
    });
}
