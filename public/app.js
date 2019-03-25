$(function() {
  $(".save").click(function() {
    var title = $(this).data("title");
    var description = $(this).data("description");
    var link = $(this).data("link");
    $.ajax("/articles", {
      type: "POST",
      data: JSON.stringify({
        title: title,
        description: description,
        link: link
      }),
      contentType: "application/json"
    }).done(function() {
      $('#saved-modal').modal({show: true});
    }).fail(function() {
      $('#failed-modal').modal({show: true});
    });
  });

  $(".delete").click(function() {
    var id = $(this).data("article-id");
    $.ajax("/articles/" + id, {
      type: "DELETE"
    }).then(function() {
      $('#deleted-modal').modal({show: true});
    });
  });

  $(".create-note").click(function() {
    var articleId = $(this).data("article-id");
    var body = $("#note-" + articleId).val();
    $.ajax("/articles/" + articleId + "/notes", {
      type: "POST",
      data: JSON.stringify({
        body: body
      }),
      contentType: "application/json"
    }).then(function() {
      $('.modal').modal('hide');
      $('#created-note-modal').modal({show: true});
    });
  });

  
  $(".refresh-page").click(function() {
    document.location.href = "/saved";
  });

  $(".delete-note").click(function() {
    var articleId = $(this).data("article-id");
    var id = $(this).data("note-id");
    $.ajax("/articles/" + articleId + "/notes/" + id, {
      type: "DELETE"
    }).then(function() {
      $('.modal').modal('hide');
      $('#deleted-modal').modal({show: true});
    });
  });
});
