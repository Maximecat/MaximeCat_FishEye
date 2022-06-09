import { Media } from "./Media.js";
// Modèle d'une Vidéo par l'extension du modèle d'un média
export class Video extends Media {
    video;

    constructor(videoDatas){
        super(videoDatas)
        this.video = videoDatas.video;
    }
}