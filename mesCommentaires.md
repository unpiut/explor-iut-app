# Commentaire

## Structures
- Components : on commence à avoir pas mal de components, une structure à plat montre ses limites. Voir pour recomposer

## Methode
- avant de composer : les commits de travail, la création de branch pour d'autres dée, les stash pour les retour arrière temp
- quand commiter un c de travail ? J'ai fais un truc, ca fonctionne, je vais passer sur quelque chose qui pourrait défaire mon travail
- avant de push : un lint un commit de mise au propre, un tour de console, un rebase interactif pour revoir sa timeline, un push

## Le problème de IUTFranceMap :
- Comment on l'avait dit : aucun accès aux données des IUT depuis la fonction de rendu (la fonction de useState se fait hors contexte !)
- il faut donc "provoquer" MobX : faire un accès aux données observer directement depuis la fonction render. Normalement cela est naturel : on accède aux données pour les injecter dans le JSX. Mais ici ça n'est pas le cas, car les données observées (les iuts) sont injectées dans la carte hors JSX (via echartState.setOption). 
- modifier des données de DOM hors JSX ? -> useEffect
- Il faut donc eploiter un useEffect pour modifier l'option de la map eChart quand les iut changent
- dans notre cas on doit changer les données de la carte si iutManager.iutSelectionnesTab change ou à défaut si iutManager.iuts change
- d'autre part il faut que echarteState existe. 
- le useEffect doit donc dépendre des 3 élements précédant, et changer les données en fonction de l'existance de echarteState, et des valeurs des 2 tableaux
- Dans le useEffect déjà existant, on s'occupe de créer la carte uniquement. On évitera donc de charger des données d'IUT dedans et on changera le state echartState uniquement lorsque l'on aura la garantie que la carte est bien créer (i.e. : carte de france chargée)