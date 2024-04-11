/* eslint-disable import/no-extraneous-dependencies */
const path = require('path'); // module node de manipulation de chemins de fichiers
const webpack = require('webpack'); // webpack
// const CopyWebpackPlugin = require('copy-webpack-plugin'); // Plugin de copie directe de fichiers
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Plugin de création HTML
const {
  appTitle, description, keywords, author,
} = require('./package.json'); // info générale de l'app
const babelConfig = require('./babel.config'); // Info de config de babel

const PUBLIC_PATH = '/'; // url de base de l'appli
const API_PATH = 'https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1';

module.exports = {
  mode: 'development',
  // Environnement cible du déploiement
  target: 'web',
  // Point d'entrée de l'application
  entry: './src/index.jsx',
  // Sortie
  output: {
    path: path.join(__dirname, 'build'), // chemin obligatoirement absolu
    filename: '[name].bundle.js', // Ajout un hash pour s'assurer le telechargement du nouveau code produit par le navigateur
    sourceMapFilename: '[name].map',
    publicPath: PUBLIC_PATH,
    clean: true, // efface le contenu du dossier de sortie avant regénération
  },
  // plugins de construction
  plugins: [
    // Définition de variables d'environnement injectable dans le code-source
    new webpack.DefinePlugin({
      APP_ENV_APP_PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
      APP_ENV_APP_TITLE: JSON.stringify(appTitle),
      APP_ENV_API_PATH: JSON.stringify(API_PATH),
    }),
    // Copie directe de fichiers
    // new CopyWebpackPlugin({
    //   patterns: []
    // }),
    // Génération du fichier index.html à partir d'un template
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
      title: appTitle,
      favicon: './src/favicon.ico',
      meta: {
        description: description ?? 'no description',
        keywords: keywords?.join(', ') ?? '',
        author: author ?? 'unknown',
      },
    }),
  ],
  // définit comment les modules vont être chargés
  // //ajoute les extensions .jsx et .scss aux extensions gérées
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.scss', '.wasm', '.mjs'],
  },
  // modules de configuration selon le type de fichier rencontré
  module: {
    rules: [{
      // Gestion des fichiers css
      test: /\.css$/i,
      exclude: /main-styles\.css$/i,
      use: [
        // Injection du CSS dans un fichier séparé
        { loader: 'style-loader', options: { injectType: 'styleTag' } },
        // Interprête le CSS en CommonJS et autorise les modules
        // les fichiers sont générés en mode dev. (car devtool activté)
        { loader: 'css-loader', options: { modules: true } },
        // tailwind postcss loader
        'postcss-loader',
      ],
    }, {
      // Gestion du fichier sass de chargement de chargement / custome de boostrap
      test: /main-styles\.css$/i,
      use: [
        { loader: 'style-loader', options: { injectType: 'styleTag' } },
        // { loader: 'style-loader', options: { injectType: 'styleTag' } },
        { loader: 'css-loader', options: { modules: false } },
        'postcss-loader',
      ],
    }, {
      // Gestion des fichiers images
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource', // le module asset émet un fichier séparé du bundle et exporte son url
    }, {
      // Gestion des polices d'écriture
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource', // le module asset émet un fichier séparé du bundle et exporte son url
    }, {
      test: /\.(json|geojson)$/,
      loader: 'json-loader',
    }, {
      // Gestion du code-source js et jsx en utilisant babel pour
      // la transpilation
      // Exclut les fichiers js de node_modules du passage par babel
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: babelConfig, // configuration séparé car ré-utilisé avec eslint
      },
    }],
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    host: '127.0.0.1', // Accessible uniquement d'une ip localhost (4 ou 6)
    historyApiFallback: true, // Evite d'afficher une page 404 plutot que la page index.html
    // quand on utilie HTML5 History API
    static: [{
      directory: path.resolve(__dirname, 'build'),

    },
    {
      directory: path.join(__dirname, 'data-sample'),
    }],
    open: true, // tente d'ouvre une page navigateur une fois le serveur lancé
    hot: true, // active le remplacement à chaud des modules
    client: { // n'affiche sur le navigateur en overlay que les erreurs
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true,
      },
    },
  },
};
