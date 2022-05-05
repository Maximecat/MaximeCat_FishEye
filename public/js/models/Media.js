export class Media {
    id;
    photographerId;
    title;
    likes;
    date;
    price;

    constructor(mediaDatas){
        this.id = mediaDatas.id;
        this.photographerId = mediaDatas.photographerId;
        this.title = mediaDatas.title;
        this.likes = mediaDatas.likes;
        this.date = mediaDatas.date;
        this.price = mediaDatas.price;
    }
}