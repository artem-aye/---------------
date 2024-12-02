function getProductHtml(product) {
  return `
    <div class="card" style="width: 18rem;">
      <img src="${product.image}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">${product.description}</p>
        <a href="${product.link}" class="btn btn-primary" target="_blank">${product.price}$</a>
      </div>
    </div>
  `;
}

async function getProducts() {
  const response = await fetch('products.json');
  return await response.json();
}

function filterProducts(products, genre) {
  if (genre === 'all') {
    return products;
  }
  return products.filter(product => product.genre === genre);
}

document.getElementById('genreFilter').addEventListener('change', function (e) {
  const selectedGenre = e.target.value;
  getProducts().then(function (products) {
    const filteredProducts = filterProducts(products, selectedGenre);
    const productsContainer = document.querySelector('.catalog');
    productsContainer.innerHTML = ''; // Очистить контейнер перед добавлением новых товаров
    filteredProducts.forEach(function (product) {
      productsContainer.innerHTML += getProductHtml(product);
    });
  });
});

// Загрузка всех продуктов при первой загрузке страницы
getProducts().then(function (products) {
  const productsContainer = document.querySelector('.catalog');
  products.forEach(function (product) {
    productsContainer.innerHTML += getProductHtml(product);
  });
});