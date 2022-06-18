import { MediaFactory } from "../service/MediaFactory.js";
import { PhotographerFactory } from "../service/PhotographerFactory.js";
import { getPhotographer, getMedias } from "../service/service.js";
import { Video } from "../models/Video.js";
import { Image } from "../models/Image.js";

// Création d'un tableau pour les médias
let medias = [];
// Création d'un tableau pour les likes
const mediaLikes = [];

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

// Récupération de l'Id du photographe
const photographerId = params.id;

// Application de la fonction de fermeture de modal des medias au click sur l'icon 'croix'
const xmarkIcon = document.getElementById('close-button');
xmarkIcon.addEventListener('click', closeModal);

// Application de la fonction de parcours des médias (par la droite) au click sur l'icon 'flêche de droite'
const right = document.getElementById('right');
right.addEventListener('click', () => nextMedia('right'));

// Application de la fonction de parcours des médias (par la gauche) au click sur l'icon 'flêche de gauche'
const left = document.getElementById('left');
left.addEventListener('click', () => nextMedia('left'));

// Application de la fonction d'ouverture du menu (nav) au click sur le bouton
const iconOpenMenu = document.getElementById('menu-button');
iconOpenMenu.addEventListener('click', openMenu);

// Fonction d'ouverture du menu (nav)
function openMenu() {
  const secondBloc = document.getElementById('second-part-menu');
  secondBloc.style.display = "flex";
}

// Fonction de fermeture du menu (nav)
function closeMenu() {
  const secondBloc = document.getElementById('second-part-menu');
  secondBloc.style.display = "none";
}

// Fonction de récupération d'un photographe par son id
getPhotographer(photographerId)
  .then(function (photographer) {

    const photographerFactory = new PhotographerFactory(photographer);
    photographerFactory.createPhotographerHeader();

    // Récupération du bouton de 'contact', au click apparition de la modal de contact
    const contactButton = document.getElementById('btn-contact');
    contactButton.addEventListener('click', () => displayModalForm(photographer));

    // Récupération du prix du photographe (affichage dans la bannière de likes) 
    const photographerPrice = document.getElementById('price-banner');
    photographerPrice.innerText = photographer.price + "€ / jour";
  })

// Fonction de récupération des médias du photographe par son id
getMedias(photographerId)
  .then(displayMedias)

// Fonction pour afficher les medias 
function displayMedias(mediasFromFetch, criteria = "likes", sortLabel = "Popularité") {

  document.getElementById('sort-choice').innerText = sortLabel;

  medias = mediasFromFetch;

  // Fonction de tri des medias avec en paramétre le 'critère' sélectionné
  sortMedias(criteria);

  // Récupération de la balise d'affichage des medias
  const photographMedias = document.getElementById('photograph-medias');
  photographMedias.innerHTML = "";

  // Boucle sur la liste des medias, création d'un nouvelle card pour chaque medias
  for (const media of medias) {
    const mediaFactory = new MediaFactory(media);
    photographMedias.appendChild(mediaFactory.createMediaCard(closeMenu));
  }

  // Utilisation de la fonction pour faire apparaître le nombre total de likes
  displayTotalLikes();

  // Récupération de l'icon like en dessous de chaque media
  const divsLikes = document.getElementsByClassName('like-icon');
  // Boucle, au click pour chaque icon, utilisation de la fonction d'ajout ou de retrait de like
  for (const divLikes of divsLikes) {
    divLikes.addEventListener('click', switchLikes);
    // Accessibilité ------- Ecoute sur les icons like, au clavier ajoute ou retire le like avec 'Entrer'
    divLikes.addEventListener('keypress', (e) => {
      if (e.code === "Enter") {
        switchLikes(e);
      }
    })
  }
}

// Fonction d'apparition des medias trier
function setSortEvent() {
  // Récupération des boutons du menu déroulant
  const sortChoices = document.getElementsByClassName("sortBy");

  for (const choice of sortChoices) {
    // Ecoute du bouton, au click sur le choix, fermeture du menu
    choice.addEventListener('click', (e) => {

      closeMenu();

      if (e.target.innerText) {
        displayMedias(medias, e.target.id, e.target.innerText)
      }
    })
  }
}

setSortEvent();

// Fonction de tri des medias
function sortMedias(criteria) {
  switch (criteria) {
    // Si 'date' est sélectionné, trier par date
    case 'date':
      medias = medias.sort((a, b) => new Date(b[criteria]).getTime() - new Date(a[criteria]).getTime());
      break;
    // Si 'title' est sélectionné, trier par titre dans l'ordre alphabétique
    case 'title':
      medias = medias.sort((a, b) => a[criteria].localeCompare(b[criteria]));
      break;
    // Si 'likes' est sélectionné, trier par nombre de like (tri par défault)
    case 'likes':
    default:
      medias = medias.sort((a, b) => b[criteria] - a[criteria]);
      break;
  }
}

// Fonction d'apparition du nombre total de likes
function displayTotalLikes() {
  const monRes = medias.reduce((cumu, media) => cumu + media.likes, 0)
  const totalLikes = document.getElementById('total-likes');
  totalLikes.innerText = monRes;
}

// Fonction d'ajout ou de suppression de like
function switchLikes(event) {

  const likeId = event.target.id;
  const mediaId = likeId.split('heart-likes-')[1];
  let indexToDelete = -1;

  for (let i = 0, len = mediaLikes.length; i < len; i++) {
    if (mediaId === mediaLikes[i]) {
      indexToDelete = i;
      break;
    }
  }

  if (indexToDelete > -1) {
    mediaLikes.splice(indexToDelete, 1);
  }

  for (const media of medias) {
    if (media.id == mediaId) {
      media.likes += indexToDelete > -1 ? -1 : 1;
      const pictureLikes = document.getElementById('likes-' + mediaId);
      pictureLikes.innerText = media.likes;
      if (indexToDelete === -1) {
        mediaLikes.push(mediaId);
      }
      break;
    }
  }

  displayTotalLikes();
}

// Application de la fonction de fermeture du formulaire, au click sur l'icon de fermeture
const closeFormButton = document.getElementById('close-img-button');
closeFormButton.addEventListener('click', closeModalForm);

// Application de la fonction de submit, au click sur le bouton 'Envoyer' du formulaire
const contactForm = document.getElementById('contact_form');
contactForm.addEventListener('submit', onSubmitContactForm);

// Fonction de submit du formulaire
function onSubmitContactForm(event) {
  event.preventDefault()
  // Récupération des inputs et de l'expression régulière souhaité pour chaque inputs avec un message d'erreur éventuel
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

  // Boucle des clé dans inputsConf
  for (const key in inputsConf) {
    // Test de notre expression régulière des inputs 
    inputsConf[key].isValid = inputsConf[key].regExp.test(inputsConf[key].input.value);
    displayIsValidInput(inputsConf[key].isValid, inputsConf[key].input, inputsConf[key].error);
  }

  // Si tout les inputs sont valide, affiche les valeurs dans la console
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

// Fonction d'affichage de l'erreur ou de la validation pour l'input
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

// Fonction d'affichage de la modal du formulaire et du nom du photographe assosié
function displayModalForm(photographer) {
  closeMenu();

  const contactModal = document.getElementById('contact_modal');
  contactModal.style.display = "block";

  const nameProfil = document.getElementById('name-profil');
  nameProfil.innerText = photographer.name;

  focusTrap(document.querySelector('#contact_modal'), 'input, textarea, button', closeModalForm);
}

// Fonction de fermeture de la modal du formulaire
function closeModalForm() {
  const contactModal = document.getElementById('contact_modal');
  contactModal.style.display = "none";
}

// Fonction de fermeture de la modal des medias agrandi
function closeModal() {
  const modal = document.getElementById('lightbox-modal');
  modal.style.display = "none";
}

// Fonction pour parcourir les medias de gauche a droite avec les icons de flêche de notre modal
function nextMedia(direction) {
  const pictureLightBox = document.getElementsByClassName("picture-lightbox");
  const titlePictureLightBox = document.getElementsByClassName("title-picture-lightbox");
  const mediaContainer = document.getElementById('media-container-lightbox');

  const index = medias.findIndex(function (media) {
    return media.id == pictureLightBox[0].id;
  })

  let nextIndex;

  if (direction === 'right') {
    if (index === medias.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex = index + 1;
    }
  } else if (direction === 'left') {
    if (index === 0) {
      nextIndex = medias.length - 1;
    } else {
      nextIndex = index - 1;
    }
  }

  const mediaFactory = new MediaFactory(medias[nextIndex]);

  // Si c'est une Image
  if (medias[index] instanceof Image) {
    if (medias[nextIndex] instanceof Image) {
      pictureLightBox[0].src = "public/images/" + medias[nextIndex].photographerId + "/" + medias[nextIndex].image;
    } else {
      mediaContainer.innerHTML = '';
      const videoElement = mediaFactory.createVideo();
      mediaContainer.appendChild(videoElement);
    }
    // Si c'est une Vidéo
  } else if (medias[index] instanceof Video) {
    if (medias[nextIndex] instanceof Video) {
      pictureLightBox[0].firstChild().src = "public/images/" + medias[nextIndex].photographerId + "/" + medias[nextIndex].video;
    } else {
      mediaContainer.innerHTML = '';
      const photoElement = mediaFactory.createPhoto();
      mediaContainer.appendChild(photoElement);
    }
  }

  pictureLightBox[0].id = medias[nextIndex].id;
  titlePictureLightBox[0].innerText = medias[nextIndex].title;
}

// Fonction accessibilité modals (media, formulaire)
function focusTrap(modal, focusableElements, closeFunction) {
  const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
  const focusableContent = modal.querySelectorAll(focusableElements);
  const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

  document.addEventListener('keydown', function (e) {
    let isTabPressed = e.key === 'Tab';
    let isEscapePressed = e.key === 'Escape';

    if (!isTabPressed) {
      return;
    }

    if (isEscapePressed) {
      closeFunction();
      document.removeEventListener('keydown', this);
      return;
    }

    if (e.shiftKey) { // if shift key pressed for shift + tab combination
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus(); // add focus for the last focusable element
        e.preventDefault();
      }
    } else { // if tab key is pressed
      if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
        firstFocusableElement.focus(); // add focus for the first focusable element
        e.preventDefault();
      }
    }
  });

  firstFocusableElement.focus();
}