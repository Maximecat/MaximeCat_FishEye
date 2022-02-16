import { getPhotographer, getMedias } from "../service/service.js";

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const photographerId = params.id;
console.log(photographerId);

getPhotographer(photographerId)
  .then((photographer) => {
    console.log(photographer)
  })

getMedias(photographerId)
  .then((medias) => {
    console.log(medias)
  })
