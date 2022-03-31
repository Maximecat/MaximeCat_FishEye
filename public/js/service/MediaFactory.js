import { Video } from "../models/Video.js"
import { Image } from "../models/Image.js"

export class MediaFactory {

    constructor(media){
        this.media = media
    }

    // Méthode pour crée une card affichant un media
    createMediaCard() {
        const photographMedia = document.createElement('div');
        photographMedia.className = "photograph-media";
        let photographPicture;
        if (this.media instanceof Image) {
            photographPicture = document.createElement('img');
        } else if (this.media instanceof Video) {
            photographPicture = document.createElement('video');
        }
        photographPicture.className = "photograph-picture";
        photographPicture.alt = this.media.title;
        const aboutPicture = document.createElement('div');
        aboutPicture.className = "about-picture";
        const pictureTitle = document.createElement('div');
        pictureTitle.className = "picture-title";
        const pictureLikes = document.createElement('div');
        pictureLikes.className = "picture-likes";
        const heartLikes = document.createElement('i');
        heartLikes.className = "fa-solid fa-heart";


        photographPicture.src = "/public/images/" + this.media.photographerId + "/" + (this.media.image|| this.media.video)
        photographPicture.id = "thumb-" + this.media.id;
        pictureTitle.innerText = this.media.title;
        pictureLikes.innerText = this.media.likes + " ";


        aboutPicture.appendChild(pictureTitle);
        aboutPicture.appendChild(pictureLikes);
        pictureLikes.appendChild(heartLikes);
        photographMedia.appendChild(photographPicture);
        photographMedia.appendChild(aboutPicture);

        photographPicture.addEventListener('click', () => {
            this.displayDialog();
        });

        return photographMedia;
    }

    //Méthode pour faire apparaitre notre "lightbox-modal" au 'click'
    displayDialog() {

        const lightBoxModal = document.getElementById("lightbox-modal");
        lightBoxModal.style.display = "flex";

        const mediaContainerLightBox = document.getElementById("media-container-lightbox");
        mediaContainerLightBox.innerHTML = null;
        let mediaToDisplay;
        if (this.media instanceof Image) {
            mediaToDisplay = document.createElement('img');
            mediaToDisplay.src = "/public/images/" + this.media.photographerId + "/" + this.media.image;
        } else if (this.media instanceof Video) {
            mediaToDisplay = document.createElement('video');
            mediaToDisplay.controls = true;
            const videoSource = document.createElement('source');
            videoSource.src = "/public/images/" + this.media.photographerId + "/" + this.media.video;
            mediaToDisplay.appendChild(videoSource);
        }
        
        mediaToDisplay.id = this.media.id;
        mediaToDisplay.classList.add("picture-lightbox");
        mediaContainerLightBox.appendChild(mediaToDisplay);

        const titlePictureLightBox = document.getElementsByClassName("title-picture-lightbox");
        titlePictureLightBox[0].innerText = this.media.title;
    }
}