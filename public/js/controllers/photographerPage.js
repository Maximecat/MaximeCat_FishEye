import { getPhotographer, getMedias } from "../service/service.js";

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const photographerId = params.id;
console.log(photographerId);

getPhotographer(photographerId)
  .then(displayDescription)

getMedias(photographerId)
  .then(displayMedias)

function displayDescription(photographer) {
  const name = document.getElementById("name");
  const city = document.getElementById("city");
  const desc = document.getElementById("desc");
  const img = document.getElementById("img");

  name.innerText = photographer.name;
  city.innerText = photographer.city + ", " + photographer.country;
  desc.innerText = photographer.tagline;
  img.src = "/public/images/Photographers/" + photographer.portrait;

}

function displayMedias(medias) {

  const photographMedias = document.getElementById('photograph-medias');

  for (const media of medias) {

    const photographMedia = document.createElement('div');
    photographMedia.className = "photograph-media";
    const photographPicture = document.createElement('img');
    photographPicture.className = "photograph-picture";
    const aboutPicture = document.createElement('div');
    aboutPicture.className = "about-picture";
    const pictureTitle = document.createElement('div');
    pictureTitle.className = "picture-title";
    const pictureLikes = document.createElement('div');
    pictureLikes.className = "picture-likes";

    photographPicture.src = "/public/images/" + media.photographerId + "/" + (media.image|| media.video)
    pictureTitle.innerText = media.title;
    pictureLikes.innerText = media.likes;

    aboutPicture.appendChild(pictureTitle);
    aboutPicture.appendChild(pictureLikes);
    // photographMedia.appendChild(photographPicture);
    photographMedia.appendChild(aboutPicture);
    photographMedias.appendChild(photographMedia);

  }
};