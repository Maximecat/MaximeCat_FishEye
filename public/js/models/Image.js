import { Media } from "./Media.js";
// Modèle d'une Image par l'extension du modèle d'un média
export class Image extends Media {
    image;

    constructor(imageDatas){
        super(imageDatas)
        this.image = imageDatas.image;
    }
}