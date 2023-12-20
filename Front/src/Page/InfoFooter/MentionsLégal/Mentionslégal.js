import React from 'react'
import { NavLink } from 'react-router-dom'

function Mentionslégal() {
  return (
    <div className='maindiv'>
        <h1>Mentions Légales</h1>
        <div>
            <h2>1. Informations légales :</h2>
            <ul>
                <li>WebComInk est édité par [BrandonDemaretz].</li>
                <li>Adresse : [D21 résidence Simone veil, 62138 Haisnes]</li>
                <li>Numéro de téléphone : [0619936158]</li>
                <li>Adresse e-mail : [demaretz.brandon@gmail.com]</li>
            </ul>
        </div>
        <div>
            <h2>2. Directeur de la publication :</h2>
            <ul>
                <li>
                    Brandon Demaretz
                </li>
                <li>
                    demaretz.brandon@gmail.com
                </li>
            </ul>
        </div>
        <div>
            <h2>3. Hébergement :</h2>
            <ul>
                <li>Le site WebComInk est hébergé par ???.</li>
                <li>Adresse : ???</li>
                <li>Numéro de téléphone : ???</li>
                <li>Adresse e-mail : ???</li>
            </ul>
        </div>
        <div>
            <h2>4. Propriété intellectuelle :</h2>
            <p>4.1. Tous les contenus présents sur le site WebComInk, tels que les textes, images, graphiques, logos, vidéos, etc., sont la propriété de [Nom de votre entreprise] ou de leurs propriétaires respectifs. Toute utilisation non autorisée est strictement interdite.

4.2. Les marques et logos présents sur le site sont la propriété de [Nom de votre entreprise] et ne peuvent être utilisés sans autorisation préalable.</p>
        </div>
        <div>
            <h2>5. Collecte de données personnelles :</h2>
            <p>WebComInk respecte la vie privée de ses utilisateurs. Pour plus d'informations sur la collecte et le traitement des données personnelles, veuillez consulter notre Politique de Confidentialité.</p>
            <NavLink to="/Politique-de-confidentialité">Politique de Confidentialité</NavLink>
        </div>
        <div>
            <h2>6. Responsabilité :</h2>
            <p>6.1. WebComInk s'efforce de fournir des informations précises et à jour, mais ne peut garantir l'exactitude de toutes les informations présentes sur le site.
                6.2. WebComInk n'est pas responsable du contenu des sites externes liés.</p>
        </div>
        <div>
            <h2>7. Modification des mentions légales :</h2>
            <p>6WebComInk se réserve le droit de modifier les présentes mentions légales à tout moment. Les utilisateurs sont invités à les consulter régulièrement.</p>
        </div>
        <div>
            <h2>8. Contact :</h2>
            <p>Pour toute question ou préoccupation concernant les mentions légales, veuillez nous contacter à [Votre adresse e-mail de contact].</p>
        </div>
        <h3>Merci de visiter WebComInk !</h3>
    </div>
  )
}

export default Mentionslégal