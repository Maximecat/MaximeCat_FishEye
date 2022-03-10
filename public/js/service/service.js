import { Photographer } from "../models/Photographer.js"
import { Video } from "../models/Video.js"
import { Image } from "../models/Image.js"

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

export function getPhotographer(photographerId) {
    // Utiliser methode find
    return getPhotographers()
        .then((photographers) => photographers
            .find((photographer) => photographer.id === Number(photographerId)))
}

export function getMedias(photographerId) {

    // Utiliser méthode filter
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