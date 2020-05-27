const leftMenu = document.querySelector(".left-menu");
const hamburger = document.querySelector(".hamburger");
const tvShowsList = document.querySelector(".tv-shows__list");
const modal = document.querySelector(".modal");
const IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";
const API_KEY = "d65d73a19d8a09225912fdb367897a59";

class DBService {
  getData = async (url) => {
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
}

const renderCard = (response) => {
  console.log("response: ", response);
  tvShowsList.textContent = "";

  response.results.forEach((item) => {
    const {
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote,
    } = item;

    const posterIMG = poster ? IMG_URL + poster : "./img/no-poster.jpg";
    const backdropIMG = backdrop ? IMG_URL + backdrop : IMG_URL + poster;
    const voteEl = vote ? vote : "";

    const card = document.createElement("li");

    // card.classList.add("tv-shows__item");
    card.className = "tv-shows__item";
    card.innerHTML = `
      <a href="#" class="tv-card">
        <span class="tv-card__vote">${vote}</span>
          <img
            class="tv-card__img"
            src="${IMG_URL + poster}"
            data-backdrop="${IMG_URL + backdrop}"
            alt='${title}'
          />
        <h4 class="tv-card__head">${title}</h4>
      </a>
    `;
    tvShowsList.append(card);
  });
};

new DBService().getTestData().then(renderCard);

hamburger.addEventListener("click", () => {
  leftMenu.classList.toggle("openMenu");
  hamburger.classList.toggle("open");
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".left-menu")) {
    leftMenu.classList.remove("openMenu");
    hamburger.classList.remove("open");
  }
});

leftMenu.addEventListener("click", (event) => {
  const target = event.target;
  const dropdown = target.closest(".dropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
    leftMenu.classList.add("openMenu");
    hamburger.classList.add("open");
  }
});

tvShowsList.addEventListener("click", (event) => {
  event.preventDefault();
  const target = event.target;
  const card = target.closest(".tv-card");
  if (card) {
    document.body.style.overflow = "hidden";
    modal.style.backgroundColor = "transparent";
    modal.classList.remove("hide");
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
