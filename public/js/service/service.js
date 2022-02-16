import { Photographer } from "../models/Photographer.js"
import { Video } from "../models/Video.js"
import { Image } from "../models/Image"

export function getPhotographers() {
    return fetch('public/datas/datas.json')
        .then((response) => response.json())
        .then((datas) => datas.photographers
            .map((photographer) => {
                return new Photographer(photographer)
            }))
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