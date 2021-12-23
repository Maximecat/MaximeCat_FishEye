import { Photographer } from "../models/Photographer.js";
import { datas } from "../datas/FishEyeData.js"

const photographers = datas.photographers;

// Parcour la liste des photographe et affiche l'HTML du photographe dans le body  (en dynamique)
function displayPhotographers() {
    // Récupération du main
    const photographersContainer = document.getElementById('photographers-container');
    // Boucles sur la liste des photographes
    for (const photographer of photographers) {
        // Pour chaque .. photographes, création d'une div
        const div = document.createElement('div');
        // Pour chaque .. photographe on met le nom du photographe dans la div crée
        div.innerHTML = photographer.name;
        // Pour chaque .. photographe on insere la div crée dans le conteneur (main)
        photographersContainer.appendChild(div);
    };
}

displayPhotographers();