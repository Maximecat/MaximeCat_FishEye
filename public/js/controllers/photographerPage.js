import { MediaFactory } from "../service/MediaFactory.js";
import { PhotographerFactory } from "../service/PhotographerFactory.js";
import { getPhotographer, getMedias } from "../service/service.js";
import { Video } from "../models/Video.js";
import { Image } from "../models/Image.js";

let medias = [];
const mediaLikes = [];

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const photographerId = params.id;
console.log(photographerId);

const xmarkIcon = document.getElementById('close-button');
xmarkIcon.addEventListener('click', closeModal);

const right = document.getElementById('right');
right.addEventListener('click', () => nextMedia('right'));

const left = document.getElementById('left');
left.addEventListener('click', () => nextMedia('left'));



//------------------------------------------------



// const displayChoiceMenu = document.getElementById('firstbloc');
// displayChoiceMenu.addEventListener('click', openMenu);

// function openMenu() {

//   const secondBloc = document.getElementById('secondbloc');
//   secondBloc.style.display = "block";

//   const iChevronDown = document.getElementById('chevronDown');
//   iChevronDown.style.transform = "rotateX(180deg)";
//   iChevronDown.style.transition = "0.5s";

// }


//------------------------------------------------

getPhotographer(photographerId)
  .then(function (photographer) {

    const photographerFactory = new PhotographerFactory(photographer);

    photographerFactory.createPhotographerHeader();

    const contactButton = document.getElementById('btn-contact');
    contactButton.addEventListener('click', () => displayModalForm(photographer));

    const photographerPrice = document.getElementById('price-banner');
    photographerPrice.innerText = photographer.price + "€ / jour";

  })


getMedias(photographerId)
  .then(displayMedias)

function displayMedias(mediasFromFetch, criteria = "likes") {

  medias = mediasFromFetch;

  sortMedias(criteria);

  const photographMedias = document.getElementById('photograph-medias');

  photographMedias.innerHTML="";

  for (const media of medias) {

    const mediaFactory = new MediaFactory(media);
    photographMedias.appendChild(mediaFactory.createMediaCard());

  }

  displayTotalLikes();

  const divsLikes = document.getElementsByClassName('like-icon');
  for (const divLikes of divsLikes) {
    divLikes.addEventListener('click', switchLikes);
    divLikes.addEventListener('keypress', (e) => {
      if (e.code === "Enter") {
        switchLikes(e);
      }
    })
  }

}

function setSortEvent() {
  const sortChoice = document.querySelector(".sortBy");
  sortChoice.addEventListener('click', (e) => {
    displayMedias(medias, e.target.id)
    console.log(e.target.id);
  })
}

setSortEvent();

function sortMedias(criteria) {
  switch (criteria) {
    case 'date':
      console.log(criteria, medias);
      medias = medias.sort((a, b) => new Date(b[criteria]).getTime() - new Date(a[criteria]).getTime());
      break;

    case 'title':
      console.log(criteria, medias);
      medias = medias.sort((a, b) => a[criteria].localeCompare(b[criteria]));
      break;

    case 'likes':
    default:
      medias = medias.sort((a, b) => b[criteria] - a[criteria]);
      break;
  }
}


function displayTotalLikes() {
  const monRes = medias.reduce((cumu, media) => cumu + media.likes, 0)
  const totalLikes = document.getElementById('total-likes');
  totalLikes.innerText = monRes;

}

function switchLikes(event) {
  console.log(mediaLikes);
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

//--------------------------------------------------------------------------

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

function closeModal() {
  const modal = document.getElementById('lightbox-modal');
  modal.style.display = "none";
}

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

  if (medias[index] instanceof Image) {
    if (medias[nextIndex] instanceof Image) {
      pictureLightBox[0].src = "public/images/" + medias[nextIndex].photographerId + "/" + medias[nextIndex].image;
    } else {
      mediaContainer.innerHTML = '';
      const videoElement = mediaFactory.createVideo();
      mediaContainer.appendChild(videoElement);
    }
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