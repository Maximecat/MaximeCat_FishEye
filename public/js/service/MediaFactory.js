import { Video } from "../models/Video.js"
import { Image } from "../models/Image.js"

export class MediaFactory {

    constructor(media) {
        this.media = media
    }

    // Méthode pour crée une card affichant un media
    createMediaCard(closeMenu, focusTrap) {
        const photographMedia = document.createElement('div');
        photographMedia.className = "photograph-media";

        let photographPicture;

        if (this.media instanceof Image) {
            photographPicture = document.createElement('img');
        } else if (this.media instanceof Video) {
            photographPicture = document.createElement('video');
        }

        photographPicture.className = "photograph-picture";
        photographPicture.alt = "Photo de : " + this.media.title;
        photographPicture.tabIndex = 3;

        const aboutPicture = document.createElement('div');
        aboutPicture.className = "about-picture";

        const pictureTitle = document.createElement('div');
        pictureTitle.className = "picture-title";
        pictureTitle.tabIndex = 3;

        const pictureLikes = document.createElement('div');
        pictureLikes.className = "picture-likes";

        const likes = document.createElement('span');
        likes.id = "likes-" + this.media.id;
        likes.className = 'like-margin';

        const heartLikes = document.createElement('i');
        heartLikes.className = "fa-solid fa-heart like-icon";
        heartLikes.id = "heart-likes-" + this.media.id;
        heartLikes.tabIndex = 3;

        photographPicture.src = "public/images/" + this.media.photographerId + "/" + (this.media.image || this.media.video)
        photographPicture.id = "thumb-" + this.media.id;

        pictureTitle.innerText = this.media.title;
        likes.innerText = this.media.likes;


        aboutPicture.appendChild(pictureTitle);
        aboutPicture.appendChild(pictureLikes);
        pictureLikes.appendChild(likes);
        pictureLikes.appendChild(heartLikes);
        photographMedia.appendChild(photographPicture);
        photographMedia.appendChild(aboutPicture);

        photographPicture.addEventListener('click', () => {
            this.displayDialog(closeMenu, focusTrap);
        });
        // Accessibilité ------- la modale des medias agrandi est accessible avec 'Espace' ou 'Entrer'
        photographPicture.addEventListener('keypress', (e) => {
            if (e.code === "Space" || e.code === "Enter") {
                this.displayDialog(closeMenu, focusTrap);
            }
        });

        return photographMedia;
    }

    // Méthode pour faire apparaitre notre "lightbox-modal" au 'click'
    displayDialog(closeMenu, focusTrap) {
        closeMenu();
        const lightBoxModal = document.getElementById("lightbox-modal");
        lightBoxModal.style.display = "flex";

        const mediaContainerLightBox = document.getElementById("media-container-lightbox");
        mediaContainerLightBox.innerHTML = null;

        let mediaToDisplay;

        if (this.media instanceof Image) {
            mediaToDisplay = this.createPhoto();
        } else if (this.media instanceof Video) {
            mediaToDisplay = this.createVideo();
        }

        mediaContainerLightBox.appendChild(mediaToDisplay);

        const titlePictureLightBox = document.getElementsByClassName("title-picture-lightbox");
        titlePictureLightBox[0].innerText = this.media.title;

        setTimeout(() =>{ 
            focusTrap(document.querySelector('#lightbox-modal'), 'button', () => null);
        }, 1000);
    }

    // Méthode pour crée la balise 'img' dans le cas ou le media est une Image
    createPhoto() {
        const mediaToDisplay = document.createElement('img');

        mediaToDisplay.src = "public/images/" + this.media.photographerId + "/" + this.media.image;
        mediaToDisplay.alt = "Photo de :" + this.media.image;
        mediaToDisplay.id = this.media.id;
        mediaToDisplay.classList.add("picture-lightbox");

        return mediaToDisplay;
    }

    // Méthode pour crée la balise 'video' dans le cas ou le media est une Vidéo
    createVideo() {
        const mediaToDisplay = document.createElement('video');
        mediaToDisplay.controls = true;

        const videoSource = document.createElement('source');
        videoSource.src = "public/images/" + this.media.photographerId + "/" + this.media.video;

        const alt = document.createElement('p');
        alt.innerText = `Votre navigateur ne supporte pas la vidéo html. Voici un <a href="${videoSource.src}">lien vers la vidéo</a>`

        mediaToDisplay.appendChild(videoSource);
        mediaToDisplay.appendChild(alt);

        mediaToDisplay.id = this.media.id;
        mediaToDisplay.classList.add("picture-lightbox");

        return mediaToDisplay;
    }
}