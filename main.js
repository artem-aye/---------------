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

// Класс для управления корзиной
class Cart {
  constructor() {
    this.items = {};
    this.loadCartFromCookies();
  }

  addItem(item) {
    if (this.items[item.title]) {
      this.items[item.title].quantity += 1;
    } else {
      this.items[item.title] = { ...item, quantity: 1 };
    }
    this.saveCartToCookies();
  }

  saveCartToCookies() {
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(this.items))}; max-age=${60 * 60 * 24 * 7}; path=/`;
  }

  loadCartFromCookies() {
    const cartCookies = getCookieValue('cart');
    if (cartCookies) {
      this.items = JSON.parse(cartCookies);
    }
  }

  getCartHtml() {
    return Object.values(this.items).map(item => `
      <div style="border: 1px solid black; padding: 10px; margin: 5px;">
        <p>Название: ${item.title}</p>
        <p>Цена: ${item.price}</p>
        <p>Количество: ${item.quantity}</p>
      </div>
    `).join('');
  }
}

const cart = new Cart();

function addToCart(event) {
  const productData = event.target.getAttribute('data-product');
  const product = JSON.parse(productData);
  cart.addItem(product);
  showCart();
}

function getCookieValue(cookieName) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

function showCart() {
  const cartContainer = document.querySelector('.cart-container');
  cartContainer.innerHTML = cart.getCartHtml();
}

// Отображение корзины при загрузке страницы
showCart();
