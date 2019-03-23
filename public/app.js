$(function() {
    $(".save").click(function() {
        var title = $( this ).data("title");
        var description = $( this ).data("description");
        var link = $( this ).data("link");
        $.ajax("/articles", {
            type: "POST",
            data: JSON.stringify({
                title:title,
                description:description,
                link:link
            }),
            contentType: 'application/json'
          }).then(function() {
            alert("saved");
          });
    });

    $(".delete").click(function() {
        var id = $( this ).data("article-id");
        $.ajax("/articles/" + id, {
            type: "DELETE"
          }).then(function() {
            alert("deleted");
            document.location.href="/saved";
          });
    });
});
