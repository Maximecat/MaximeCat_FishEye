import { getPhotographers } from "../service/service.js";

getPhotographers()
    .then((photographers) => displayPhotographers(photographers))

// Parcour la liste des photographe et affiche l'HTML du photographe dans le body  (en dynamique)
function displayPhotographers(photographers) {
    console.log(photographers)
    // Récupération du main
    const photographersContainer = document.getElementById('photographers-container');
    // Boucles sur la liste des photographes
    for (const photographer of photographers) {
        // Pour chaque .. photographes, création d'une div
        const link = document.createElement('a');
        const article = document.createElement('article');
        const image = document.createElement('img');
        const nom = document.createElement('h2');
        nom.className = "nom";
        const ville = document.createElement('div');
        ville.className = "ville";
        const description = document.createElement('div');
        description.className = "description";
        const prix = document.createElement('div');
        prix.className = "prix";

        link.appendChild(article);
        article.appendChild(image);
        article.appendChild(nom);
        article.appendChild(ville);
        article.appendChild(description);
        article.appendChild(prix);

        link.href = "/photographer-page.html?id=" + photographer.id;
        image.src = "/public/images/Photographers/" + photographer.portrait;
        nom.innerText = photographer.name;
        ville.innerText = photographer.city + ", " + photographer.country;
        description.innerText = photographer.tagline;
        prix.innerText = photographer.price + "€/jour";
        
        

        // Pour chaque .. photographe on insere la div crée dans le conteneur (main)
        photographersContainer.appendChild(link);
    };
}