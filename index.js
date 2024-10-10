$(document).ready(function () {
  const apiBaseUrl = "http://192.248.181.177:5001/api/v1";

  function loadCategories() {
    $.ajax({
      url: `${apiBaseUrl}/category/all`,
      method: "GET",
      success: function (response) {
        const categories = response.data;
        $("#category-list").empty();

        categories.forEach(function (category) {
          const listItem = $("<li></li>").text(category.name);
          listItem.on("click", function () {
            loadProductsByCategory(category.id);
            showAddProductForm(category.id);
          });
          $("#category-list").append(listItem);
        });
      },
      error: function (error) {
        console.error("error", error);
      },
    });
  }

  function loadProductsByCategory(categoryId) {
    $.ajax({
      url: `${apiBaseUrl}/product/all`,
      method: "GET",
      success: function (response) {
        const products = response.data;
        const filteredProducts = products.filter((product) =>
          product.categories.some((cat) => cat.id === categoryId)
        );
        renderProducts(filteredProducts);
      },
      error: function (error) {
        console.error("error", error);
      },
    });
  }

  function renderProducts(products) {
    $("#content").empty();
    if (products.length === 0) {
      $("#content").append("<p>Продукти не знайдені.</p>");
      return;
    }

    products.forEach(function (product) {
      const productDiv = $("<div class='product'></div>");
      productDiv.append(`<h3>${product.name}</h3>`);
      productDiv.append(`<p>${product.description}</p>`);
      productDiv.append(`<p>Ціна: $${product.price}</p>`);
      productDiv.append(
        `<img src="${product.main_image}" alt="${product.name}" style="width:100px;">`
      );
      $("#content").append(productDiv);
    });
  }

  function showAddProductForm(categoryId) {
    $("#product-form").show();
    $("#product-form")
      .off("submit")
      .on("submit", function (event) {
        event.preventDefault();
        const categoriesInput = $("#productCategories")
          .val()
          .split(",")
          .map((id) => parseInt(id.trim()));
        const attributesInput = $("#productAttributes")
          .val()
          .split(",")
          .map((attr) => attr.trim());

        const productData = {
          name: $("#productName").val(),
          description: $("#productDescription").val(),
          price: parseFloat($("#productPrice").val()),
          images: $("#productImages")
            .val()
            .split(",")
            .map((img) => img.trim()),
          main_image: $("#productMainImage").val(),
          categories: categoriesInput,
          attributes: attributesInput,
        };

        console.log("Дані продукту:", productData);

        $.ajax({
          url: `${apiBaseUrl}/product/${categoryId}`,
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(productData),
          success: function (response) {
            alert("Продукт успішно додано!");
            loadProductsByCategory(categoryId);
          },
          error: function (error) {
            console.error("Помилка при додаванні продукту:", error);
          },
        });
      });
  }

  loadCategories();
});
