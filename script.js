const leftMenu = document.querySelector(".left-menu");
const hamburger = document.querySelector(".hamburger");
const tvShowsList = document.querySelector(".tv-shows__list");
const modal = document.querySelector(".modal");
const IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";
const tvShows = document.querySelector(".tv-shows");
const loading = document.createElement("div");
loading.className = "loading";
const tvCardImg = document.querySelector(".tv-card__img");
const modalTitle = document.querySelector(".modal__title");
const genresList = document.querySelector(".genres-list");
const rating = document.querySelector(".rating");
const description = document.querySelector(".description");
const modalLink = document.querySelector(".modal__link");
const tvShowsHead = document.querySelector(".tv-shows__head");
const dropdown = document.querySelectorAll(".dropdown");
const posterWrapper = document.querySelector(".poster__wrapper");
const pagination = document.querySelector(".pagination");

const modalLoader = document.querySelector(".preloader");

const searchForm = document.querySelector(".search__form");
const searchFormInput = document.querySelector(".search__form-input");

const API_KEY = "d65d73a19d8a09225912fdb367897a59";
const server = "https://api.themoviedb.org/3";

class DBService {
  getData = async (url) => {
    tvShows.append(loading);
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Ошибка ${res.status} по адресу ${url}`);
    }
  };

  getTestData = async () => {
    return await this.getData("test.json");
  };

  getTestCard = () => {
    return this.getData("card.json");
  };

  getSearchResult = (query) => {
    this.temp = `${server}/search/tv?api_key=${API_KEY}&language=ru-RU&query=${query}`;
    return this.getData(this.temp);
  };

  getNextPage = (page) => {
    return this.getData(`${this.temp}&page=${page}`);
  };

  getTvShow = (id) =>
    this.getData(`${server}/tv/${id}?api_key=${API_KEY}&language=ru-RU`);

  getTopRated = () =>
    this.getData(`${server}/tv/top_rated?api_key=${API_KEY}&language=ru-RU`);

  getPopular = () =>
    this.getData(`${server}/tv/popular?api_key=${API_KEY}&language=ru-RU`);

  getWeek = () =>
    this.getData(`${server}/tv/on_the_air?api_key=${API_KEY}&language=ru-RU`);

  getToday = () =>
    this.getData(`${server}/tv/airing_today?api_key=${API_KEY}&language=ru-RU`);
}

const renderCard = (response, target) => {
  console.log("response: ", response);
  tvShowsList.textContent = "";

  if (!response.total_results) {
    loading.remove();
    tvShowsHead.textContent = "Sorry not found!";
  } else {
    tvShowsHead.textContent = target ? target.textContent : "Результат поиска";
  }

  response.results.forEach((item) => {
    const {
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote,
      id,
    } = item;

    const posterIMG = poster ? IMG_URL + poster : "./img/no-poster.jpg";
    const backdropIMG = backdrop ? IMG_URL + backdrop : "";
    const voteEl = vote ? `<span class="tv-card__vote">${vote}</span>` : "";

    const card = document.createElement("li");
    card.idTv = id;
    // card.classList.add("tv-shows__item");
    card.className = "tv-shows__item";
    card.innerHTML = `
      <a href="#" id='${id}' class="tv-card">
      ${voteEl}
      
          <img
            class="tv-card__img"
            src="${posterIMG}"
            data-backdrop="${backdropIMG}"
            alt='${title}'
          />
        <h4 class="tv-card__head">${title}</h4>
      </a>
    `;

    loading.remove();
    tvShowsList.append(card);
  });

  pagination.textContent = "";

  if (!target && response.total_pages > 1) {
    for (let i = 1; i <= response.total_pages; i++) {
      pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
    }
  }
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  searchFormInput.value = "";
  if (value) {
    new DBService().getSearchResult(value).then(renderCard);
  }
});

const closeDropdown = () => {
  dropdown.forEach((item) => {
    item.classList.remove("active");
  });
};

hamburger.addEventListener("click", () => {
  leftMenu.classList.toggle("openMenu");
  hamburger.classList.toggle("open");
  closeDropdown();
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".left-menu")) {
    leftMenu.classList.remove("openMenu");
    hamburger.classList.remove("open");
    closeDropdown();
  }
});

leftMenu.addEventListener("click", (event) => {
  event.preventDefault();
  const target = event.target;
  const dropdown = target.closest(".dropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
    leftMenu.classList.add("openMenu");
    hamburger.classList.add("open");
  }
  if (target.closest("#top-rated")) {
    new DBService()
      .getTopRated()
      .then((response) => renderCard(response, target));
  }

  if (target.closest("#popular")) {
    new DBService()
      .getPopular()
      .then((response) => renderCard(response, target));
  }

  if (target.closest("#week")) {
    new DBService().getWeek().then((response) => renderCard(response, target));
  }

  if (target.closest("#today")) {
    new DBService().getToday().then((response) => renderCard(response, target));
  }

  if (target.closest("#search")) {
    tvShowsList.textContent = "";
    tvShowsHead.textContent = "";
    // new DBService().getSearchResult(query).then(renderCard);
  }
});

tvShowsList.addEventListener("click", (event) => {
  event.preventDefault();
  const target = event.target;
  const card = target.closest(".tv-card");

  if (card) {
    tvShowsList.append(loading);
    // modalLoader.style.display = "block";
    new DBService()
      .getTvShow(card.id)
      .then((response) => {
        console.log(response);

        if (response.poster_path) {
          tvCardImg.src = IMG_URL + response.poster_path;
          tvCardImg.alt = response.name;
        }
        // else {
        //   posterWrapper.style.backgroundImage = "url('./img/no-poster.jpg')";
        // }

        modalTitle.textContent = response.name;

        // genresList.innerHTML = response.genres.reduce(
        //   (acc, item) => `${acc} <li>${item.name}</li>`,
        //   ""
        // );
        genresList.textContent = "";
        // for (const item of response.genres) {
        //   genresList.innerHTML += `<li>${item.name}</li>`;
        // }ж
        response.genres.forEach((item) => {
          genresList.innerHTML += `<li>${item.name}</li>`;
        });

        console.log(card);
        rating.textContent = response.vote_average;
        description.textContent = response.overview;
        if (modalLink) {
          modalLink.href = response.homepage;
        }
      })

      .then(() => {
        document.body.style.overflow = "hidden";
        modal.style.backgroundColor = "transparent";
        modal.classList.remove("hide");
      })
      .then(() => {
        loading.remove();
        // modalLoader.style.display = "";
      });
  }
});

modal.addEventListener("click", (event) => {
  if (
    event.target.classList.contains("modal") ||
    event.target.closest(".cross")
  ) {
    document.body.style.overflow = "";
    modal.classList.add("hide");
  }
});

const changeImage = (event) => {
  const target = event.target.closest(".tv-shows__item");
  if (target) {
    const img = target.querySelector(".tv-card__img");
    //   const revertImg = img.dataset.backdrop;
    //   if (revertImg) {
    //     img.dataset.backdrop = img.src;
    //     img.src = revertImg;
    //   }
    if (img.dataset.backdrop) {
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
    }
  }
};

tvShowsList.addEventListener("mouseover", changeImage);
tvShowsList.addEventListener("mouseout", changeImage);

pagination.addEventListener("click", (event) => {
  event.preventDefault();
  const target = event.target;
  if (target.classList.contains("pages")) {
    tvShows.append(loading);
    new DBService().getNextPage(target.textContent).then(renderCard);
  }
  loading.remove();
});
