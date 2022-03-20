export class MediaFactory {

    constructor(media){
        this.media = media
    }

    // Méthode pour crée une card affichant un media
    createMediaCard() {
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
        const heartLikes = document.createElement('i');
        heartLikes.className = "fa-solid fa-heart";


        photographPicture.src = "/public/images/" + this.media.photographerId + "/" + (this.media.image|| this.media.video)
        pictureTitle.innerText = this.media.title;
        pictureLikes.innerText = this.media.likes + " ";


        aboutPicture.appendChild(pictureTitle);
        aboutPicture.appendChild(pictureLikes);
        pictureLikes.appendChild(heartLikes);
        photographMedia.appendChild(photographPicture);
        photographMedia.appendChild(aboutPicture);

        photographPicture.addEventListener('click', this.displayDialog);

        return photographMedia;
    }

    //Méthode pour faire apparaitre notre "lightbox-modal" au 'click'
    displayDialog() {

        const lightBoxModal = document.getElementById("lightbox-modal");

        lightBoxModal.style = ("display: flex");
        
        console.log("affiche la dialog");
    }
}