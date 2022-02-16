import { Media } from "./Media.js";

export class Video extends Media {
    video;

    constructor(videoDatas){
        super(videoDatas)
        this.video = videoDatas.video;
    }
}