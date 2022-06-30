import { Video } from "../models/Video.js";
import { Image } from "../models/Image.js";

// Fonction d'affichage de la modal du formulaire et du nom du photographe assosié
export function displayModalForm(photographer) {
    closeMenu();

    const contactModal = document.getElementById('contact_modal');
    contactModal.style.display = "block";

    const nameProfil = document.getElementById('name-profil');
    nameProfil.innerText = photographer.name;

    focusTrap(document.querySelector('#contact_modal'), 'input, textarea, button', closeModalForm);
}

// Fonction de fermeture de la modal du formulaire
export function closeModalForm() {
    const contactModal = document.getElementById('contact_modal');
    contactModal.style.display = "none";
}

// Fonction de fermeture de la modal des medias agrandi
export function closeModal() {
    const modal = document.getElementById('lightbox-modal');
    modal.style.display = "none";
}

// Fonction pour parcourir les medias de gauche a droite avec les icons de flêche de notre modal
export function nextMedia(direction, medias) {
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
export function focusTrap(modal, focusableElements, closeFunction) {
    const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
    const focusableContent = modal.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

    document.addEventListener('keydown', function (e) {
        let isTabPressed = e.key === 'Tab';
        let isEscapePressed = e.key === 'Escape';

        if (isEscapePressed) {
            closeFunction();
            document.removeEventListener('keydown', this);
            return;
        }

        if (!isTabPressed) {
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

// Fonction d'ouverture du menu (nav)
export function openMenu() {
    const secondBloc = document.getElementById('second-part-menu');
    secondBloc.style.display = "flex";
    const firstSort = document.getElementsByClassName('sortBy')[0];
    if (firstSort) {
        firstSort.focus();
    }
    focusTrap(document.querySelector('#second-part-menu'), 'button', closeMenu)
}

// Fonction de fermeture du menu (nav)
export function closeMenu() {
    const secondBloc = document.getElementById('second-part-menu');
    secondBloc.style.display = "none";
}