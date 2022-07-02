// Modèle d'un Photographe
export class Photographer {
    name;
    id;
    city;
    country;
    tagline;
    taglineEnglish;
    price;
    portrait;

    constructor(photographeDatas){
        this.name = photographeDatas.name;
        this.id = photographeDatas.id;
        this.city = photographeDatas.city;
        this.country = photographeDatas.country;
        this.tagline = photographeDatas.tagline;
        this.taglineEnglish = photographeDatas.taglineEnglish;
        this.price = photographeDatas.price;
        this.portrait = photographeDatas.portrait;
    }
}