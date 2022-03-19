import { MediaFactory } from "../service/MediaFactory.js";
import { PhotographerFactory } from "../service/PhotographerFactory.js";
import { getPhotographer, getMedias } from "../service/service.js";

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const photographerId = params.id;
console.log(photographerId);

// Fonction de récupération du photographe (par son numéro d'identifiant "Id")
getPhotographer(photographerId)
  .then(function (photographer){
    // Récupération de la Factory -> PhotographerFactory
    const photographerFactory = new PhotographerFactory(photographer);

    // Création du header pour le photographe
    //( à partir du model dans notre "class" -> 'PhotographerFactory' de la méthode createPhotographerHeader() )
    photographerFactory.createPhotographerHeader();
  })

// Fonction de récupération des médias ( du photographe par son numéro d'identifiant "Id"), une fois fais on appel la fonction 'displayMedias' qui parcourir la liste des medias et les affiche dans notre div (en dynamique)
getMedias(photographerId)
  .then(displayMedias)

// Fonction pour parcourir la liste des medias et les affiche dans notre div (en dynamique)
function displayMedias(medias) {

  // Récupération de la div ou seront affiché nos medias
  const photographMedias = document.getElementById('photograph-medias');

  // Boucle sur la liste des medias
  for (const media of medias) {

    // Récupération de la Factory -> 'MediaFactory'
    const mediaFactory = new MediaFactory(media);

    // Dans notre div crée un nouvelle card ou un "enfant" a la précédente, t'en qu'il y a un nouveau media pour se photographe 
    // ( à partir du model dans notre "class" -> 'MediaFactory' de la méthode createMediaCard() )
    photographMedias.appendChild(mediaFactory.createMediaCard());

  }
};