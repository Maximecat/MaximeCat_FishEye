import { Photographer } from "../models/Photographer.js"
import { Video } from "../models/Video.js"
import { Image } from "../models/Image.js"

// Fonction de récupération des photographes
export function getPhotographers() {
    return fetch('public/datas/datas.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(datasjson) {
            return datasjson.photographers.map(function(photographer) {
                return new Photographer(photographer);
            })
        })
}

// Fonction de récupération d'un photographe
export function getPhotographer(photographerId) {
    // Utilisation de la methode find
    return getPhotographers()
        .then((photographers) => photographers
            .find((photographer) => photographer.id === Number(photographerId)))
}

// Fonction de récupération des medias
export function getMedias(photographerId) {
    // Utilisation de la méthode filter
    return fetch('public/datas/datas.json')
        .then((response) => response.json())
        .then((datas) => datas.media
            .filter((media) => media.photographerId === Number(photographerId))
            .map((media) => {
                if(media.image) {
                    return new Image(media)
                } else if(media.video) {
                    return new Video(media)
                }
            }))
}