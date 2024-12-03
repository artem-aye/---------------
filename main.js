

// Функция для получения HTML карточки продукта
function getProductHtml(product) {
  return `
    <div class="card" style="width: 18rem;">
      <img src="${product.image}" class="card-img-top" alt="${product.title}">
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">${product.description}</p>
        <a href="${product.link}" class="btn btn-primary" target="_blank">${product.price}$</a>
      </div>
    </div>
  `;
}

// Получение продуктов с сервера
async function getProducts() {
  const response = await fetch('products.json');
  return await response.json();
}

// Фильтрация продуктов по жанру
function filterProducts(products, genre) {
  if (genre === 'all') {
    return products;
  }
  return products.filter(product => product.genre === genre);
}

// Обновление каталога
function updateCatalog(selectedGenre) {
  getProducts().then(function (products) {
    const filteredProducts = filterProducts(products, selectedGenre);
    const productsContainer = document.querySelector('.catalog');
    productsContainer.innerHTML = ''; // Очистить контейнер перед добавлением новых товаров
    filteredProducts.forEach(function (product) {
      productsContainer.innerHTML += getProductHtml(product);
    });
  });
}

// Обработка изменения жанра
document.getElementById('genreFilter').addEventListener('change', function (e) {
  const selectedGenre = e.target.value;
  updateCatalog(selectedGenre);
});

// Загрузка всех продуктов при первой загрузке страницы
updateCatalog('all');

// Периодическое обновление каталога каждые 10 секунд
setInterval(function () {
  const selectedGenre = document.getElementById('genreFilter').value;
  updateCatalog(selectedGenre);
}, 10000);
if (savedTheme) {
  body.classList.add(savedTheme); // Применяем сохраненную тему
} else {
  body.classList.add('light-theme'); // Применяем тему по умолчанию
}