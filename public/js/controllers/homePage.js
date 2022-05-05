import { PhotographerFactory } from "../service/PhotographerFactory.js";
import { getPhotographers } from "../service/service.js";

// Fonction de récupération des photographes, une fois fais on appel la fonction 'displayPhotographers' qui parcours la liste des photographes et les affiche dans le main (en dynamique)
getPhotographers()
    .then((photographers) => displayPhotographers(photographers))

// Fonction qui parcours la liste des photographes et les affiche dans le main (en dynamique)
function displayPhotographers(photographers) {

    // Récupération du main
    const photographersContainer = document.getElementById('photographers-container');

    // Boucle sur la liste des photographes
    for (const photographer of photographers) {

        // Récupération de la Factory -> 'PhotographerFactory'
        const photographerFactory = new PhotographerFactory(photographer);
    
        // Dans notre main crée un nouvelle card ou un "enfant" a la précédente, t'en qu'il y a un nouveau photographe 
        // ( à partir du model dans notre "class" -> 'PhotographerFactory' de la méthode createPhotographerCard() )
        photographersContainer.appendChild(photographerFactory.createPhotographerCard());
    };
}