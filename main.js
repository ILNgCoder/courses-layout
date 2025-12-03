// массив курсов
const courses = [
  {
    image: 'assets/c63086c15719088561c8ec14b31455901e6aced2.jpg',
    category: 'Marketing',
    title: 'The Ultimate Google Ads Training Course',
    price: '100$',
    author: 'Jerome Bell',
  },
  {
    image: 'assets/4dc0c01cdada93a61e7f51ac6388e22a998e52c3.jpg',
    category: 'Management',
    title: 'Product Management Fundamentals',
    price: '480$',
    author: 'Marvin McKinney',
  },
  {
    image: 'assets/1c5469059ec3475582a6f6129b6ad3aed940c4d0.jpg',
    category: 'HR & Recruting',
    title: 'HR  Management and Analytics',
    price: '200$',
    author: 'Leslie Alexander Li',
  },
  {
    image: 'assets/e6c7967bad5827ead11861fa456bdb395058c281.jpg',
    category: 'Marketing',
    title: 'Brand Management & PR Communications',
    price: '530$',
    author: 'Kristin Watson',
  },
  {
    image: 'assets/1adcaf7957590e8cdfee47506b5afbb5f1d3d251.jpg',
    category: 'Design',
    title: 'Graphic Design Basic',
    price: '500$',
    author: 'Guy Hawkins',
  },
  {
    image: 'assets/1959b06e7f5d4163ea9599946af07d3d52f61d21.jpg',
    category: 'Management',
    title: 'Business Development Management',
    price: '400$',
    author: 'Dianne Russell',
  },
  {
    image: 'assets/26b7504f2f3ca140714e87c67d19cee808f942e3.jpg',
    category: 'Development',
    title: 'Highload Software Architecture',
    price: '600$',
    author: 'Brooklyn Simmons',
  },
  {
    image: 'assets/56e453da1f9df64680ce9ae8deb70c4fd6494a76.jpg',
    category: 'HR & Recruting',
    title: 'Human Resources – Selection and Recruitment',
    price: '150$',
    author: 'Kathryn Murphy',
  },
  {
    image: 'assets/39a7972cf1e363e8eb007225e0b26ec15b87aa9b.jpg',
    category: 'Design',
    title: 'User Experience. Human-centered Design',
    price: '240$',
    author: 'Cody Fisher',
  },
  {
    image: '',
    category: 'Marketing',
    title: 'Email Marketing: From Zero to Mastery',
    price: '180$',
    author: 'Eleanor Pena',
  },
  {
    image: '',
    category: 'Management',
    title: 'Agile & Scrum Full Guide',
    price: '350$',
    author: 'Wade Warren',
  },
  {
    image: '',
    category: 'HR & Recruting',
    title: 'Effective Interviewing Techniques',
    price: '120$',
    author: 'Courtney Henry',
  },
  {
    image: '',
    category: 'Design',
    title: 'Digital Illustration for Beginners',
    price: '280$',
    author: 'Esther Howard',
  },
  {
    image: '',
    category: 'Development',
    title: 'Modern JavaScript: ES6+ Deep Dive',
    price: '370$',
    author: 'Robert Fox',
  },
  {
    image: '',
    category: 'Marketing',
    title: 'SMM: Growing Brands on Social Media',
    price: '210$',
    author: 'Jacob Jones',
  },
  {
    image: '',
    category: 'Management',
    title: 'Leadership & Team Motivation Masterclass',
    price: '460$',
    author: 'Devon Lane',
  },
  {
    image: '',
    category: 'HR & Recruting',
    title: 'Building Corporate Culture: Practical Tools',
    price: '300$',
    author: 'Theresa Webb',
  },
  {
    image: '',
    category: 'Design',
    title: 'UI Design for Mobile Apps',
    price: '320$',
    author: 'Jenny Wilson',
  },
  {
    image: '',
    category: 'Development',
    title: 'Backend Development with Node.js',
    price: '550$',
    author: 'Arlene McCoy',
  },
  {
    image: '',
    category: 'Marketing',
    title: 'SEO: Ranking Websites in Google',
    price: '260$',
    author: 'Ralph Edwards',
  },
];

// сколько курсов добавляются по кнопке load more
const coursesLoadMoreCount = 9;

// сколько курсов видно сейчас
let coursesVisibleCount = 9;

// шаблоны для filterItemId и author вынесены в отдельные функции
const filterItemIdPattern = index => `filteritem${index}`;
const authorPattern = author => `by ${author}`;

// модификатор текущего элемента фильтра по категориям
const currentFilterModificator = 'filter-item_selected';

// текущий поисковый запрос
let searchQuery = '';

// bool-функция, соответствует ли курс поисковому запросу
const isCourseMatchSearch = (course, search) => {
  return (
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    course.author.toLowerCase().includes(search.toLowerCase()) // плюс возможность искать по автору
  );
};

// создаем Map для категорий и считаем их кол-во по курсам
const categoriesMap = new Map();

courses.forEach(course => {
  const category = course.category;
  categoriesMap.set(category, (categoriesMap.get(category) || 0) + 1);
});

// массив сущностей {title,count}, где title-название категории,count-количество
// также в составе сущность All для сброса фильтра по категориям
const categories = [{ title: 'All', count: courses.length }];
[...categoriesMap.entries()].map(([title, count]) =>
  categories.push({
    title,
    count,
  })
);

// DOM элемент фильтра по категориям
const filterItemsElem = document.querySelector('.filter-items');

// DOM элемент карточек курсов
const coursesPanelElem = document.querySelector('.courses-panel');

// index текущей категории
let activeCategoryIndex = -1;

function setActiveCategory(index) {
  // удаляем модификатор у предыдущего элемента категории (если он есть)
  if (activeCategoryIndex !== -1) {
    const prevElem = document.getElementById(filterItemIdPattern(activeCategoryIndex));
    prevElem.classList.remove(currentFilterModificator);
  }
  // добавляем модификатор к текущему элементу категории
  const currentElem = document.getElementById(filterItemIdPattern(index));
  currentElem.classList.add(currentFilterModificator);
  activeCategoryIndex = index;
  // рендерим курсы
  renderCourses();
}

function setCategories() {
  categories.forEach((category, index) => {
    // шаблон элемента фильтрации
    const template = document.getElementById('filter-item-template');
    const node = template.content.cloneNode(true);
    node.querySelector('.filter-item__title').textContent = category.title;
    node.querySelector('.filter-item__count').textContent = category.count;
    // вешаем обработчик кликов по категории
    const filterItem = node.querySelector('.filter-item');
    filterItem.setAttribute('id', filterItemIdPattern(index));
    filterItem.addEventListener('click', () => setActiveCategory(index));
    filterItemsElem.appendChild(node);
  });
}

// добавляем в DOM все категории
setCategories();

// изначально активна категория All
setActiveCategory(0);

// функция заполнения DOM элемента курса
function fillCourseNode(node, course) {
  node.querySelector('.course-item__image').src = course.image;
  node.querySelector('.course-item__category').textContent = course.category;
  node.querySelector('.course-item__title').textContent = course.title;
  node.querySelector('.course-item__price').textContent = course.price;
  node.querySelector('.course-item__author').textContent = `by ${course.author}`;
}

// рендер курсов
function renderCourses() {
  coursesPanelElem.innerHTML = '';
  const activeCategory = categories[activeCategoryIndex].title;

  const filteredCourses = courses.filter(course => {
    // совпадение по категории
    const matchByCategory = activeCategory === 'All' || course.category === activeCategory;
    // совпадение по поиску
    const matchBySearch = isCourseMatchSearch(course, searchQuery);
    return matchByCategory && matchBySearch;
  });

  //filteredCoursesCount = filteredCourses.length;

  // отображать ли кнопку load more
  if (coursesVisibleCount >= filteredCourses.length) {
    document.querySelector('.load-more').style.display = 'none';
  } else {
    document.querySelector('.load-more').style.display = 'flex';
  }

  // берем лишь пока видимые курсы
  const sliceCourses = filteredCourses.slice(0, coursesVisibleCount);

  sliceCourses.forEach(course => {
    const template = document.getElementById('course-template');
    const node = template.content.cloneNode(true);
    fillCourseNode(node, course);
    coursesPanelElem.appendChild(node);
  });
}

// поиск
const searchInput = document.getElementById('search');

searchInput.addEventListener('input', e => {
  searchQuery = e.target.value.trim();
  renderCourses();
});

// load more
document.querySelector('.load-more').addEventListener('click', () => {
  coursesVisibleCount += coursesLoadMoreCount;
  renderCourses();
});
