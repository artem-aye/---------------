function getProductHtml(product) {
  return `
    <div class="card" style="width: 18rem;">
      <img src="${product.image}" class="card-img-top" alt="${product.title}">
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">${product.description}</p>
        <a href="${product.link}" class="btn btn-primary" target="_blank">Go to Steam</a>
        <button class="cart-btn" data-product='${JSON.stringify(product)}'>Add to cart</button>
      </div>
    </div>
  `;
}

// Получение продуктов с сервера
async function getProducts() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) {
      throw new Error('Ошибка загрузки данных с сервера');
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка:', error);
    return [];
  }
}

// Фильтрация продуктов по жанру
function filterProducts(products, genre) {
  return genre === 'all' ? products : products.filter(product => product.genre === genre);
}

// Обновление каталога
function updateCatalog(selectedGenre) {
  getProducts().then(products => {
    const filteredProducts = filterProducts(products, selectedGenre);
    const productsContainer = document.querySelector('.catalog');
    productsContainer.innerHTML = '';
    filteredProducts.forEach(product => {
      productsContainer.innerHTML += getProductHtml(product);
    });
    attachCartButtonEvents();
  });
}

// Добавление обработчиков событий для кнопок корзины
function attachCartButtonEvents() {
  const buyButtons = document.querySelectorAll('.cart-btn');
  buyButtons.forEach(button => {
    button.addEventListener('click', addToCart);
  });
}

// Обработка изменения жанра
const genreFilter = document.getElementById('genreFilter');
genreFilter.addEventListener('change', e => {
  const selectedGenre = e.target.value;
  updateCatalog(selectedGenre);
});

// Загрузка всех продуктов при первой загрузке страницы
updateCatalog('all');

// Периодическое обновление каталога
setInterval(() => {
  const selectedGenre = genreFilter.value;
  updateCatalog(selectedGenre);
}, 10000);

// Переключение темы
const body = document.body;
const savedTheme = localStorage.getItem('theme');
body.classList.add(savedTheme || 'light-theme');

// Функция для генерации HTML новости
function getNewsHtml(newsItem, index) {
  return `
    <div class="carousel-item ${index === 0 ? 'active' : ''}">
      <div class="d-block w-100">
        <h5>${newsItem.title}</h5>
        <p>${newsItem.content}</p>
        <a href="${newsItem.link}" target="_blank">Читать больше</a>
      </div>
    </div>
  `;
}

// Получение новостей с сервера
async function getNews() {
  try {
    const response = await fetch('news.json');
    if (!response.ok) {
      throw new Error('Ошибка загрузки новостей');
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка:', error);
    return [];
  }
}

// Обновление карусели новостей
function updateNewsCarousel() {
  getNews().then(newsData => {
    const carouselContent = document.getElementById('carouselContent');
    carouselContent.innerHTML = '';
    newsData.forEach((newsItem, index) => {
      carouselContent.innerHTML += getNewsHtml(newsItem, index);
    });
  });
}

// Загрузка новостей при первой загрузке страницы
updateNewsCarousel();

// Периодическое обновление новостей
setInterval(updateNewsCarousel, 30000);
//корзина
let cart = [];  // Массив для хранения товаров в корзине
let products = [];  // Массив для хранения всех игр

// Ссылка на контейнер для списка игр
const gameList = document.getElementById('gameList');

// Ссылка на корзину
const cartButton = document.getElementById('cartButton');
const cartDropdown = document.getElementById('cartDropdown');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartItems = document.getElementById('cartItems');

// Функция для отображения списка игр
function displayGames(products) {
  products.forEach(product => {
    const gameCard = document.createElement('div');
    gameCard.classList.add('col-md-4');
    gameCard.innerHTML = `
      <div class="game-card">
        <img src="${product.image}" alt="${product.title}">
        <h5>${product.title}</h5>
        <p>${product.description}</p>
        <p><strong>${product.price} грн</strong></p>
        <a href="${product.link}" target="_blank" class="btn btn-info">Подробнее</a>
        <button onclick="addItemToCart(${product.title})">Добавить в корзину</button>
      </div>
    `;
    gameList.appendChild(gameCard);
  });
}

// Функция для добавления товара в корзину
function addItemToCart(productTitle) {
  const product = products.find(p => p.title === productTitle);
  if (product) {
    cart.push(product);
    updateCart();
  }
}

// Обработчик клика по кнопке корзины
cartButton.addEventListener('click', () => {
  cartDropdown.classList.toggle('show');
});

// Функция для обновления отображения корзины
function updateCart() {
  // Обновляем количество товаров в корзине
  cartCount.textContent = cart.length;

  // Считаем общую сумму
  let total = 0;
  cartItems.innerHTML = ''; // Очистим список товаров в корзине
  cart.forEach(item => {
    total += parseFloat(item.price);
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <span class="item-name">${item.title}</span>
      <span class="item-price">${item.price} грн</span>
    `;
    cartItems.appendChild(cartItem);
  });

  // Обновляем общую сумму
  cartTotal.textContent = `${total} грн`;
}

// Загрузка данных из файла products.json
fetch('products.json')
  .then(response => response.json())
  .then(data => {
    // Сохраняем данные в переменной products
    products = data;  // Здесь получаем весь массив товаров
    displayGames(data);  // Отображаем все игры
  })
  .catch(error => console.error('Ошибка загрузки данных:', error));