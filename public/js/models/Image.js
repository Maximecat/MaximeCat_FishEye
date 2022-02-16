import { Media } from "./Media.js";

export class Image extends Media {
    image;

    constructor(imageDatas){
        super(imageDatas)
        this.image = imageDatas.image;
    }
}