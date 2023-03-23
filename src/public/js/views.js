const socketClient = io();

socketClient.on("products", data => {
  render(data);
});

function render(data) {
  const html = data
    .map(item => {
      return `
      <div>${item.title}</div>
      <div>${item.description}</div>
      <div>${item.price}</div>
      <img src='${
        item.thumbnail ||
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"
      }' class='img'>
      <div>${item.category}</div>  
      <div>${item.stock}</div>
      <input type="button" value="Eliminar producto" onclick="deleteProduct(${
        item.id
      })"></input>
      `;
    })
    .join(" ");
  document.getElementById("productsContainer").innerHTML = html;
}

function paramsValidator(product) {
  if (
    product.title &&
    product.description &&
    product.price &&
    product.stock &&
    product.category
  ) {
    return true;
  } else {
    if (!product.title) {
      throw new Error(`Falta el title del producto.`);
    } else if (!product.description) {
      throw new Error(`Falta la descripcion del producto.`);
    } else if (!product.price) {
      throw new Error(`Falta el precio del producto.`);
    } else if (!product.stock) {
      throw new Error(`Falta el stock del producto.`);
    } else if (!product.category) {
      throw new Error(`Falta la categoria del producto.`);
    }
  }
}

function addProduct() {
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
    category: document.getElementById("category").value,
    stock: document.getElementById("stock").value,
  };
  if (paramsValidator(product)) {
    socketClient.emit("newProduct", product);
    const form = document.getElementById("formularioAddProduct");
    form.reset();
  }
}

function deleteProduct(id) {
  socketClient.emit("deleteProduct", id);
}
