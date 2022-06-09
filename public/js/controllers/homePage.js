import { PhotographerFactory } from "../service/PhotographerFactory.js";
import { getPhotographers } from "../service/service.js";

// Méthode de récupération des photographes (par le service.js), une fois fais on appel la fonction 'displayPhotographers' qui parcours la liste des photographes
getPhotographers()
    .then((photographers) => displayPhotographers(photographers))

// Fonction qui parcours la liste des photographes (boucle) et les affiche dans le main (en dynamique)
function displayPhotographers(photographers) {
    // Récupération du main
    const photographersContainer = document.getElementById('photographers-container');

    // Boucle sur la liste des photographes
    for (const photographer of photographers) {
        // Récupération de la Factory -> 'PhotographerFactory'
        const photographerFactory = new PhotographerFactory(photographer);
        // Récupération du model pour crée une card de photographe avec la méthode 'createPhotographerCard'
        const article = photographerFactory.createPhotographerCard();
        // Dans notre main crée un nouvelle card ou un "enfant" a la précédente, t'en qu'il y a un nouveau photographe 
        // ( à partir du model dans notre "class" -> 'PhotographerFactory' avec la méthode createPhotographerCard() )
        photographersContainer.appendChild(article);
        // Accessibilité ------- Pour chaque photographe la page est accessible à partir de sa card avec 'Espace' ou 'Entrer'
        setEvent(article, photographer);
    };
}

// Fonction d'accessibilité à la page de photographe par sa card avec 'Espace ou 'Entrer'
function setEvent(article, photographer) {
    // Ecoute sur la card du photographe
    article.addEventListener('keypress', (e) => {
        // Si la touche utilisé est 'Espace' ou 'Entrer', redirection vers la page associé à se photographe par rapport à son id
        if(e.code === "Space") {
            document.location.href = "/photographer-page.html?id=" + photographer.id;
        }
    })
}