import { Photographer } from "../models/Photographer.js"

export function getPhotographers() {
    return fetch('public/datas/datas.json')
        .then((response) => response.json())
        .then((datas) => datas.photographers.map((photographer) => new Photographer(photographer)))
}

export function getPhotographer(photographerId) {

}

export function getMedias(photographerId) {

}