import React from "react";
import "../CGU/CGU.scss";
import { NavLink } from "react-router-dom";

function Confidentialité() {
  return (
    <div className="maindiv">
      <h1>Politique de Confidentialité</h1>
      <p>Dernière mise à jour : 20/12/2023</p>
      <p>
        Bienvenue sur la Politique de Confidentialité de WebComInk. Nous
        accordons une grande importance à la confidentialité de nos utilisateurs
        et nous nous engageons à protéger leurs informations personnelles. Cette
        politique explique comment nous collectons, utilisons, divulguons et
        protégeons les données personnelles.
      </p>
      <div>
        <h2>1. Collecte de données personnelles :</h2>
        <p>
          1.1. Lors de l'utilisation de WebComInk, nous pouvons collecter les
          informations suivantes :
        </p>
        <ul>
          <li>
            Informations d'identification personnelle (nom, adresse e-mail,
            etc.)
          </li>
          <li>Informations démographiques</li>
          <li>Informations sur les préférences et les intérêts</li>
        </ul>
        <p>
          1.2. Nous collectons ces informations lorsque vous créez un compte,
          utilisez nos services, participez à des sondages, ou communiquez avec
          nous.
        </p>
      </div>
      <div>
        <h2>2. Utilisation des données personnelles :</h2>
        <p>
          2.1. Les données personnelles collectées peuvent être utilisées pour :
        </p>
        <ul>
          <li>Personnaliser l'expérience utilisateur</li>
          <li>Fournir des services et fonctionnalités demandés</li>
          <li>Améliorer nos services</li>
          <li>
            Envoyer des communications promotionnelles (avec votre consentement)
          </li>
        </ul>
      </div>
      <div>
        <h2>3. Divulgation des données personnelles :</h2>
        <p>
          3.1. Nous ne vendons, ne louons ni ne partageons vos données
          personnelles avec des tiers sans votre consentement, sauf dans les cas
          prévus par la loi.
        </p>
      </div>
      <div>
        <h2>4. Sécurité des données personnelles :</h2>
        <p>
          4.1. Nous mettons en place des mesures de sécurité appropriées pour
          protéger vos données personnelles contre tout accès non autorisé,
          altération, divulgation ou destruction.
        </p>
      </div>
      <div>
        <h2>5. Cookies et technologies similaires :</h2>
        <p>
          5.1. WebComInk utilise des cookies et des technologies similaires pour
          améliorer l'expérience de navigation. Pour en savoir plus, consultez
          notre Politique de Cookies.
        </p>
        <NavLink to="/Politique-des-cookies">Politique de Cookies</NavLink>
      </div>
      <div>
        <h2>6. Liens vers des sites tiers :</h2>
        <p>
          6.1. WebComInk peut contenir des liens vers des sites tiers. Nous ne
          sommes pas responsables des pratiques de confidentialité de ces sites
          et vous encourageons à consulter leurs politiques de confidentialité.
        </p>
      </div>
      <div>
        <h2>7. Modifications de la politique de confidentialité :</h2>
        <p>
          7.1. Nous nous réservons le droit de modifier cette politique à tout
          moment. Les modifications prendront effet dès leur publication sur le
          site.
        </p>
      </div>
      <div>
        <h2>8. Consentement :</h2>
        <p>
          En utilisant WebComInk, vous consentez à la collecte et à
          l'utilisation de vos informations personnelles conformément à cette
          Politique de Confidentialité.
        </p>
      </div>
      <div>
        <h2>9. Contact :</h2>
        <p>
          Pour toute question ou préoccupation concernant la Politique de
          Confidentialité, veuillez nous contacter à WebComInk@gmail.com.
        </p>
      </div>
      <h3>
        Merci de faire confiance à WebComInk pour la protection de vos données
        personnelles !
      </h3>
    </div>
  );
}

export default Confidentialité;
