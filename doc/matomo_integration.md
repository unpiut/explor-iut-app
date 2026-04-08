# Fiche technique — Mise en place de Matomo dans un projet React (SPA)

## Accès au gestionnaire de balises

Dans Matomo, accéder à la section **Gestionnaire de balises**.

Cette section contient quatre onglets principaux :

* Balises
* Déclencheurs
* Variables
* Versions

---

## 1. Création d’un déclencheur

Cliquer sur **Créer un nouveau déclencheur**.

Dans la page de configuration, sélectionner le type de déclencheur.

### Choix du déclencheur

Pour une application React (Single Page Application), sélectionner **Modification de l’historique**.

Dans une SPA, les changements de page ne provoquent pas de rechargement complet. Matomo ne détecte donc pas automatiquement les changements de vue. La navigation étant gérée côté client (par exemple avec React Router), seule l’URL est modifiée via l’historique du navigateur.

Le déclencheur **Modification de l’historique** permet de détecter ces changements et de déclencher le tracking des pages vues.

### Configuration

* Nom : choisir un nom explicite (exemple : `Trigger - Changement de page React`)
* Valider en cliquant sur **Créer**

---

## 2. Création d’une balise Matomo

Revenir dans le gestionnaire de balises puis cliquer sur **Créer une nouvelle balise**.

Sélectionner **Statistiques Matomo**.

### Configuration de la balise

* Nom : exemple `Matomo - Page View`
* Type de suivi : vérifier que **Page vue** est sélectionné

### Conditions de déclenchement

Dans la section des déclencheurs, ajouter le déclencheur précédemment créé :

* `Modification de l’historique`

Cela permet d’envoyer une page vue à chaque changement de route dans l’application React.

Valider en cliquant sur **Créer**.

---

## 3. Création et publication d’une version

Retourner dans le gestionnaire de balises puis cliquer sur **Créer une nouvelle version**.

### Configuration

* Nom de version : exemple `v1 - Tracking React SPA`
* Description : optionnelle mais recommandée

Vérifier que l’environnement sélectionné est **Live**.

Cliquer sur **Créer et publier**.

## Vérifier la variable d'URL vers le script de Matomo

Dans le fichier webpack.js, regarder la ligne initialisant la variable MATOMO_URL. Celle-ci contient une URL. Il vous faut vérifier que cet URL est la bonne. Pour cela (**Dans l'application Matomo**):

* Aller dans le gestionnaire de balise
* Dans le menu de gauche, aller dans la section "Gérer Conteneurs"
* Repérer le conteneur lié à votre site (Normalement il n'y a qu'un seul conteneur généré automatiquement lorsque vous avez installé Matomo sur le site web)
* Dans les actions possibles sur ce conteneur, choisissez : "Installez le code"
* Une page va apparaître avec du code, rechercher dans ces lignes de codes une URL. C'est celle dont on a besoin dans la variable MATOMO_URL. Copiez-la et remplacer là si elle est modifiée.
