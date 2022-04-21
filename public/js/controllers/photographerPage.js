import { MediaFactory } from "../service/MediaFactory.js";
import { PhotographerFactory } from "../service/PhotographerFactory.js";
import { getPhotographer, getMedias } from "../service/service.js";
import { Video } from "../models/Video.js";
import { Image } from "../models/Image.js";

let medias = [];

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const photographerId = params.id;
console.log(photographerId);

// Exécution de fonction propre a chaque icons de la "lightbox-modal" au 'click'
// Icon de fermeture
const xmarkIcon = document.getElementById('close-button');
xmarkIcon.addEventListener('click', closeModal);

// Icon fleche de droite
const right = document.getElementById('right');
right.addEventListener('click', goRight);

// Icon fleche de gauche
const left = document.getElementById('left');
left.addEventListener('click', goLeft);

// Fonction de récupération du photographe (par son numéro d'identifiant "Id")
getPhotographer(photographerId)
  .then(function (photographer) {
    // Récupération de la Factory -> PhotographerFactory
    const photographerFactory = new PhotographerFactory(photographer);

    // Création du header pour le photographe
    //( à partir du model dans notre "class" -> 'PhotographerFactory' de la méthode createPhotographerHeader() )
    photographerFactory.createPhotographerHeader();
  })

// Fonction de récupération des médias ( du photographe par son numéro d'identifiant "Id"), 
// une fois fais on appel la fonction 'displayMedias' qui parcours la liste des medias et les affiche dans notre div (en dynamique)
getMedias(photographerId)
  .then(displayMedias)

// Fonction pour parcourir la liste des medias et les affiche dans notre div (en dynamique)
function displayMedias(mediasFromFetch) {

  medias = mediasFromFetch;
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
}

const contactButton = document.getElementById('btn-contact');
contactButton.addEventListener('click', displayModalForm);

const closeFormButton = document.getElementById('close-img-button');
closeFormButton.addEventListener('click', closeModalForm);

const contactForm = document.getElementById('contact_form');
contactForm.addEventListener('submit', onSubmitContactForm);

function onSubmitContactForm(event) {
  event.preventDefault()
  const inputsConf = {
    prenom: {
      isValid: false,
      input: document.getElementById('form-prenom'),
      error: "Le prénom doit contenir uniquement des lettres, 2 au minimum",
      regExp: /^[a-zA-Z\-éëàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇÆæœ]{2,}$/
    },
    nom: {
      isValid: false,
      input: document.getElementById('form-nom'),
      error: "Le nom doit contenir uniquement des lettres, 2 au minimum",
      regExp: /^[a-zA-Z\-éëàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇÆæœ]{2,}$/
    },
    email: {
      isValid: false,
      input: document.getElementById('form-email'),
      error: "Vous devez saisir un email valide, exemple : aaa@gmail.fr",
      regExp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    message: {
      isValid: false,
      input: document.getElementById('form-message'),
      error: "Ce champ doit contenir votre message",
      regExp: /^(?!\s*$).+/
    }
  }

  for (const key in inputsConf) {
    inputsConf[key].isValid = inputsConf[key].regExp.test(inputsConf[key].input.value);
    displayIsValidInput(inputsConf[key].isValid, inputsConf[key].input, inputsConf[key].error);
  }

  if (
    inputsConf.prenom.isValid && 
    inputsConf.nom.isValid && 
    inputsConf.email.isValid && 
    inputsConf.message.isValid 
    ) {
      console.log("prenom: " + inputsConf.prenom.input.value)
      console.log("nom: " + inputsConf.nom.input.value)
      console.log("email: " + inputsConf.email.input.value)
      console.log("message: " + inputsConf.message.input.value)
    }
}

function displayIsValidInput(isValid, inputElement, errorMessage) {
  if (!isValid) {
    inputElement.parentElement.removeAttribute("valid");
    inputElement.parentElement.setAttribute("data-error-visible", true);
    inputElement.parentElement.setAttribute("data-error", errorMessage);
  } else {
    inputElement.parentElement.removeAttribute("data-error-visible");
    inputElement.parentElement.removeAttribute("data-error");
    inputElement.parentElement.setAttribute("valid", true);
  }
}

function displayModalForm(photographer) {

  const contactModal = document.getElementById('contact_modal');
  contactModal.style.display = "block";

  const nameProfil = document.getElementById('name-profil');
  nameProfil.innerText = photographer.name;
}

function closeModalForm() {
  const contactModal = document.getElementById('contact_modal');
  contactModal.style.display = "none";
}

// Fonction de fermeture pour nôtre 'lightbox-modal'
function closeModal() {
  const modal = document.getElementById('lightbox-modal');
  modal.style.display = "none";
}

// Fonction pour parcourir nôtre tableau de medias propre au photographe et les faire apparaître dans la 'lightbox-modal'
function goRight() {
  // Récupération des emplacements d'affichage
  const pictureLightBox = document.getElementsByClassName("picture-lightbox");
  const titlePictureLightBox = document.getElementsByClassName("title-picture-lightbox");
  // Récupération de l'élément courant
  const index = medias.findIndex(function (media) {
    return media.id == pictureLightBox[0].id;
  })

  let nextIndex;
  // Si (l'élement courant = la longueur du tableau 'medias' - 1)
  // Retour a l'index 0 de notre tableau
  if (index === medias.length - 1) {
    nextIndex = 0;
    // Sinon avancer dans le tableau
  } else {
    nextIndex = index + 1;
  }

  if (medias[index] instanceof Image) {
    if (medias[nextIndex] instanceof Image) {
      pictureLightBox[0].src = "/public/images/" + medias[nextIndex].photographerId + "/" + medias[nextIndex].image;
    } else {
      console.log("le prochain media es une vidéo")
    }
  } else if (medias[index] instanceof Video) {
    if (medias[nextIndex] instanceof Video) {
      pictureLightBox[0].firstChild().src = "/public/images/" + medias[nextIndex].photographerId + "/" + medias[nextIndex].video;
    } else {
      console.log("le prochain media es une photo")
    }
  }
  //
  pictureLightBox[0].id = medias[nextIndex].id;
  titlePictureLightBox[0].innerText = medias[nextIndex].title;
}

// Fonction 'lightbox-modal'
function goLeft() {

  const pictureLightBox = document.getElementsByClassName("picture-lightbox");
  const titlePictureLightBox = document.getElementsByClassName("title-picture-lightbox");
  const index = medias.findIndex(function (media) {
    return media.id == pictureLightBox[0].id;
  })

  let nextIndex;
  if (index === 0) {
    nextIndex = medias.length - 1;
  } else {
    nextIndex = index - 1;
  }

  if (medias[index] instanceof Image) {
    if (medias[nextIndex] instanceof Image) {
      pictureLightBox[0].src = "/public/images/" + medias[nextIndex].photographerId + "/" + medias[nextIndex].image;
    } else {
      console.log("le prochain media es une vidéo")
    }
  } else if (medias[index] instanceof Video) {
    if (medias[nextIndex] instanceof Video) {
      pictureLightBox[0].firstChild().src = "/public/images/" + medias[nextIndex].photographerId + "/" + medias[nextIndex].video;
    } else {
      console.log("le prochain media es une photo")
    }
  }

  pictureLightBox[0].id = medias[nextIndex].id;
  titlePictureLightBox[0].innerText = medias[nextIndex].title;
}