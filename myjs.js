$(document).ready(function () {
  getData();
  $("#btn").on("click", getData);
  $("#btn1").on("click", addData);
  $("#btn2").on("click", editData);
  $("#btn3").on("click", delData);
});

function getData() {
  $("#btn2").removeClass("down");
  $("#btn3").removeClass("deldown");
  $(".prod").css("cursor", "context-menu");
  $("#editalert").fadeOut(1000);
  $("#delalert").fadeOut(1000);
  $(".record").unbind();
  $(".prod").removeAttr("data-target");

  var record = $(".record");
  record.empty();
  record.append("Loading....");

  $.ajax({
    url: "https://usman-recipes.herokuapp.com/api/products",
    method: "GET",
    success: function (response) {
      var record = $(".record");
      record.empty();

      for (var i = 0; i < response.length; i++) {
        var dat = response[i];
        record.append(
          "<div class='prod' data-id= " +
            dat._id +
            " >I am <h4>" +
            dat.name +
            "</h4> and my price is <h4>" +
            dat.price +
            "</h4> i am <h4>" +
            dat.color +
            "</h4> in color. My department is <h4>" +
            dat.department +
            "</h4>. <br/> <h5> Description: </h5>" +
            dat.description +
            " </div>"
        );
      }
    },
  });
}

function addData() {
  console.log("Add Data Inside");

  $(".modal-title").html("Add Record");
  $("#changeData").unbind("click");
  $("#changeData").html("Add");
  $("#changeData").attr("id", "addAdd");
  $("#btn2").removeClass("down");
  $("#btn3").removeClass("deldown");

  $(".prod").css("cursor", "context-menu");
  $("#editalert").fadeOut(1000);
  $("#delalert").fadeOut(1000);
  $(".record").unbind();
  $(".prod").unbind();
  $(".prod").removeAttr("data-target");

  emptyForm();

  $("#addAdd").on("click", saveData);
}

function saveData() {
  var name = $("#addName").val();
  var price = $("#addPrice").val();
  var color = $("#addColor").val();
  var department = $("#addDepartment").val();
  var description = $("#addDescription").val();

  $.ajax({
    url: "https://usman-recipes.herokuapp.com/api/products",
    method: "POST",
    data: {
      name: name,
      price: price,
      color: color,
      department: department,
      description: description,
    },
    success: function (response) {
      getData();
      $("#exampleModalCenter").modal("hide");
      $("#alert").fadeIn(1000).delay(5000).fadeOut(1000);
    },
  });
}

function editData() {
  console.log("Edit Data Clicked Unbinding Events");

  $(".modal-title").html("Edit Record");
  $("#addAdd").unbind("click");
  $("#addAdd").html("Change");
  $("#addAdd").attr("id", "changeData");
  $("#btn3").removeClass("deldown");

  $(".prod").css("cursor", "context-menu");
  $("#delalert").fadeOut(1000);
  $(".record").unbind();
  $(".prod").unbind();
  $(".prod").removeAttr("data-target");

  $("#btn2").toggleClass("down");

  if (!$("#btn2").hasClass("down")) {
    console.log("Should Not Run Edit IF cond>>");
    $(".prod").css("cursor", "context-menu");
    $("#editalert").fadeOut(1000);
    $(".record").unbind();
    $(".prod").unbind();
    $(".prod").removeAttr("data-target");
    return;
  }

  console.log("Edit Running Running");

  $(".prod").css("cursor", "grab");
  $("#editalert").fadeIn(1000);

  $(".record").on("mouseenter", "div.prod", mouseEnter);
  $(".record").on("mouseleave", "div.prod", mouseExit);

  $(".record").on("mousedown", "div.prod", mouseDown);
  $(".record").on("mouseup", "div.prod", mouseUp);
}

function mouseDown() {
  $(".prod").css("cursor", "grabbing");
}

function mouseUp() {
  $(".prod").css("cursor", "grab");
  console.log("Inside Edit Open Modal");
  emptyForm();

  $.ajax({
    url:
      "https://usman-recipes.herokuapp.com/api/products/" +
      $(this).attr("data-id"),
    method: "GET",
    success: function (response) {
      console.log("Get Ajax of Edit Mouseup>>: " + response.name);
      $("#addName").val(response.name);
      $("#addPrice").val(response.price);
      $("#addColor").val(response.color);
      $("#addDepartment").val(response.department);
      $("#addDescription").val(response.description);
      var ID = response._id;

      $("#exampleModalCenter").modal("show");

      $("#changeData").on("click", function () {
        var name = $("#addName").val();
        var price = $("#addPrice").val();
        var color = $("#addColor").val();
        var department = $("#addDepartment").val();
        var description = $("#addDescription").val();

        $.ajax({
          url: "https://usman-recipes.herokuapp.com/api/products/" + ID,
          method: "PUT",
          data: {
            name: name,
            price: price,
            color: color,
            department: department,
            description: description,
          },
          success: function (response) {
            getData();
            $("#exampleModalCenter").modal("hide");
            $("#changedalert").fadeIn(1000).delay(5000).fadeOut(1000);
          },
        });

        $("#changeData").unbind();
      });
    },
  });
}

function delData() {
  console.log("Del Pressed Unbinding");

  $(".prod").css("cursor", "context-menu");
  $("#editalert").fadeOut(1000);
  $(".record").unbind();
  $(".prod").unbind();
  $("#btn2").removeClass("down");

  $("#btn3").toggleClass("deldown");

  if (!$("#btn3").hasClass("deldown")) {
    console.log("Should Not Run If of DelButt");
    $(".prod").css("cursor", "context-menu");
    $("#delalert").fadeOut(1000);
    $(".record").unbind();
    $(".prod").unbind();
    $(".prod").removeAttr("data-target");
    return;
  }

  console.log("Running Del");

  $(".prod").css("cursor", "crosshair");
  $("#delalert").fadeIn(1000);

  $(".record").on("mouseenter", "div.prod", mousedelEnter);
  $(".record").on("mouseleave", "div.prod", mousedelExit);

  $(".record").on("mousedown", "div.prod", mousedelDown);
  $(".record").on("mouseup", "div.prod", mousedelUp);
}

function mousedelDown() {
  $(".prod").css("cursor", "no-drop");
}

function mousedelUp() {
  $(".prod").css("cursor", "crosshair");
  $(".prod").attr({ "data-toggle": "modal", "data-target": "#delmodal" });

  $.ajax({
    url:
      "https://usman-recipes.herokuapp.com/api/products/" +
      $(this).attr("data-id"),
    method: "GET",
    success: function (response) {
      var ID = response._id;
      $("#modaldeltitle").html(response.name);
      $("#modaldeltitle").addClass("text-danger");

      $("#delyes").on("click", function () {
        console.log("delete ID is: " + ID);

        $.ajax({
          url: "https://usman-recipes.herokuapp.com/api/products/" + ID,
          method: "DELETE",
          success: function (response) {
            console.log("Data Deleted: " + response.name);
            getData();
            $("#delmodal").modal("hide");
            $("#delsuccessalert").fadeIn(1000).delay(5000).fadeOut(1000);
          },
        });

        $("#delyes").unbind();
      });
    },
  });
}

function mouseEnter() {
  $(this).addClass("mouseEnter scale");
}

function mouseExit() {
  $(this).removeClass("mouseEnter scale");
}

function mousedelEnter() {
  $(this).addClass("bg-danger text-white scale");
}

function mousedelExit() {
  $(this).removeClass("bg-danger text-white scale");
}

function emptyForm() {
  $("#addName").val("");
  $("#addPrice").val("");
  $("#addColor").val("");
  $("#addDepartment").val("");
  $("#addDescription").val("");
}
