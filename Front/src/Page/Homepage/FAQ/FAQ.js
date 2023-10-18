import styles from "./FAQ.module.scss"

function FAQ() {
  return (
    <div className={`${styles.mainDiv}`}>
        <h1>FAQ</h1>
        <div className={`${styles.faqList}`}>
            <details>
                <summary>Qu'est-ce que WebComInk ?</summary>
                <p>WebComInk est un site d'édition en ligne de bande dessiné.</p>
            </details>
            <details>
                <summary>Depuis quels pays le site est-il accessible ?</summary>
                <p>WebComInk est actuellment exclusivement disponible en France et donc en français.</p>
            </details>
            <details>
                <summary>Quels sont les œuvre disponible ?</summary>
                <p>Pour voirs toutes les oeuvres disponible, vous pouvez cliquer sur le boutton "Comics", qui vous enverra vers le catalogue de WebComInk</p>
            </details>
            <details>
                <summary>Comment télécharger l'application ?</summary>
                <p>L'application mobile est disponible sur Android et iOS dans leurs stores respective.</p>
            </details>
        </div>
    </div>
  )
}

export default FAQ