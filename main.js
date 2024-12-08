function getProductHtml(product) {
  
 
  return `
      <div class="card" style="width: 18rem;">
        <img src="${product.image}" class="card-img-top" alt="${product.title}">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.description}</p>
          <a href="${product.link}" class="btn btn-primary" target="_blank">Go to Steam</a>
        </div>
      </div>
    `;
  }

// Получение продуктов с сервера
async function getProducts() {
  try {
    const response = await fetch('products.json'); // Загружаем файл JSON с продуктами
    if (!response.ok) {
      throw new Error('Ошибка загрузки данных с сервера');
    }
    return await response.json(); // Возвращаем данные как объект
  } catch (error) {
    console.error('Ошибка:', error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

// Фильтрация продуктов по жанру
function filterProducts(products, genre) {
  return genre === 'all' ? products : products.filter(product => product.genre === genre);
}

// Обновление каталога
function updateCatalog(selectedGenre) {
  getProducts().then(products => {
    const filteredProducts = filterProducts(products, selectedGenre); // Фильтруем продукты по жанру
    const productsContainer = document.querySelector('.catalog'); // Контейнер для продуктов
    productsContainer.innerHTML = ''; // Очистка контейнера перед обновлением
    filteredProducts.forEach(product => {
      productsContainer.innerHTML += getProductHtml(product); // Добавление продуктов в контейнер
    });
  });
}

// Обработка изменения жанра
document.getElementById('genreFilter').addEventListener('change', e => {
  const selectedGenre = e.target.value;
  updateCatalog(selectedGenre); // Обновляем каталог при изменении жанра
});

// Загрузка всех продуктов при первой загрузке страницы
updateCatalog('all');

// Периодическое обновление каталога каждые 10 секунд
setInterval(() => {
  const selectedGenre = document.getElementById('genreFilter').value;
  updateCatalog(selectedGenre);
}, 10000);

// Переключение темы
const body = document.body;
const savedTheme = localStorage.getItem('theme'); // Получаем сохраненную тему из localStorage

if (savedTheme) {
  body.classList.add(savedTheme); // Применяем сохраненную тему
} else {
  body.classList.add('light-theme'); // Если тема не сохранена, устанавливаем светлую тему
}

// Обработчик переключения темы
document.getElementById('toggleTheme').addEventListener('click', () => {
  body.classList.toggle('dark-theme'); // Переключаем темную тему
  body.classList.toggle('light-theme'); // Переключаем светлую тему

  const currentTheme = body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
  localStorage.setItem('theme', currentTheme); // Сохраняем выбранную тему в localStorage
});
function getNewsHtml(newsItem, index) {
  return `
    <div class="carousel-item ${index === 0 ? 'active' : ''}">
      <div class="d-block w-100">
        <h5>${newsItem.title}</h5>
        <p>${newsItem.content}</p>
        <a href="${newsItem.link}" target="_blank">Читати більше</a>
      </div>
    </div>
  `;
}

// Получение новостей с сервера или из локального файла
async function getNews() {
  try {
    const response = await fetch('news.json'); // Загружаем файл новостей
    if (!response.ok) {
      throw new Error('Ошибка загрузки новостей');
    }
    return await response.json(); // Возвращаем новости как объект
  } catch (error) {
    console.error('Ошибка:', error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

// Обновление карусели новостей
function updateNewsCarousel() {
  getNews().then(newsData => {
    const carouselContent = document.getElementById('carouselContent');
    carouselContent.innerHTML = ''; // Очистка перед обновлением

    newsData.forEach((newsItem, index) => {
      carouselContent.innerHTML += getNewsHtml(newsItem, index); // Добавление слайдов в карусель
    });
  });
}

// Загрузка новостей при первой загрузке страницы
updateNewsCarousel();

// Периодическое обновление новостей (по желанию, можно удалить)
setInterval(() => {
  updateNewsCarousel();
}, 30000); // Обновляем каждые 30 секунд (можно изменить)