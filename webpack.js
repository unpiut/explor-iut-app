const fs = require('fs'); // module node d'accès au SGF
const path = require('path'); // module node de manipulation de chemins de fichiers
const webpack = require('webpack'); // webpack
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Plugin de création HTML
// const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin'); // Plugin de copie directe de fichiers
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const {
  appTitle, description, keywords, author,
} = require('./package.json'); // info générale de l'app
const babelConfig = require('./babel.config'); // Info de config de babel

/**
 * CONSTANTES, injectables depuis l'environnement (utile notamment dans un build docker)
 */
let PUBLIC_PATH; // url de base de l'appli
let API_PATH; // chemin de l'API Rest
let TEST_APP; // Indicateur d'application en mode test
let MATOMO_URL;

function setGlobalVariable(prodMode, devMode) {
  PUBLIC_PATH = process.env.PUBLIC_PATH ?? '/';
  if (devMode) {
    API_PATH = 'http://localhost:8080/api/v1';
    TEST_APP = false;
    MATOMO_URL = 'http://localhost/js/container_WKLco9S4.js';
  }
  else {
    API_PATH = process.env.API_PATH ?? '/api/v1';
    TEST_APP = !!process.env.TEST_APP;
    MATOMO_URL = process.env.MATOMO_URL;
  }
}

function printPreReport(prodMode, devMode) {
  const texts = [
    'START BUILD APP WITH GIVEN PARAMETERS',
    `- PRODUCTION MODE: ${prodMode}`,
    `- DEV MODE: ${devMode}`,
    `- PUBLIC_PATH: ${PUBLIC_PATH}`,
    `- API_PATH: ${API_PATH}`,
    `- MATOMO_URL: ${MATOMO_URL}`,
  ];
  // compute max line length and add 4 car (2 starts, 2 spaces)
  const length = texts.map(t => t.length).reduce((a, b) => Math.max(a, b), 0);

  // print line of start, text lines with their preffix and suffix then line of start
  /* eslint-disable no-console */
  console.log('\n');
  console.log('*'.repeat(length + 4));
  for (const text of texts) {
    console.log(`* ${text}${' '.repeat(length - text.length)} *`);
  }
  console.log('*'.repeat(length + 4));
  console.log('\n\n');
  /* eslint-enable no-console */
}

// Fonctions utilitaire de création de partie de la configuration
function createPluginConfiguration(productionMode = false) {
  const plugins = [
    // Définition de variables d'environnement injectable dans le code-source
    new webpack.DefinePlugin({
      APP_ENV_APP_PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
      APP_ENV_APP_TITLE: JSON.stringify(appTitle),
      APP_ENV_API_PATH: JSON.stringify(API_PATH),
      APP_ENV_TEST_APP: JSON.stringify(TEST_APP),
      APP_ENV_MATOMO_URL: JSON.stringify(MATOMO_URL),
    }),
    // Copie directe de fichiers
    // new CopyWebpackPlugin({
    //   patterns: [{from: '<path>', to: 'fileme', toType?: 'file'}]
    // }),
    // Génération du fichier index.html à partir d'un template
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
      title: appTitle,
      favicon: './src/favicon.ico', // : handled in favicons plugins
      meta: {
        description: description ?? 'no description',
        keywords: keywords?.join(', ') ?? '',
        author: author ?? 'unknown',
      },
    }),
    // new HtmlWebpackTagsPlugin({
    //   tags: [],
    //   links: [
    //     { path: <path>, attributes: { rel: 'prefetch' } },
    //   ],
    // }),
    // Génération des icones et du manifest
    // new FaviconsWebpackPlugin({
    //   // mode: 'webapp',
    //   // devMode: 'webapp',
    //   // Your source logo (required)
    //   logo: './src/assets/logo.png',
    //   // Cross-build cache
    //   cache: true,
    //   // Prefix path for generated assets
    //   prefix: 'assets/',
    //   // Inject html links/metadata (requires html-webpack-plugin).
    //   inject: true,
    //   // Favicons configuration options (see below)
    //   favicons: {
    //     appName: title, // Your application's name. `string`
    //     appShortName: name, // Your application's short_name. `string`. Optional. If not set, appName will be used
    //     // appDescription: 'Module de saisie des présences pour l\'IUT de Laval', // Your application's description. `string`
    //     dir: 'auto', // Primary text direction for name, short_name, and description
    //     lang: 'fr-FR', // Primary language for name and short_name
    //     background: 'black', // Background colour for flattened icons. `string`
    //     theme_color: '#FF407D', // Theme color user for example in Android's task switcher. `string`
    //     // start_url: `/${IDX_STUDENT_FILE_NAME}?homescreen=1`,
    //   },
    // }),
  ];
  if (productionMode) {
    plugins.push(
      // Séparation des CSS du code JS dans des fichiers séparés
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
      // Injections des licences
      new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8')),
      // Creation de rapports statistiques sur la taille des bundles
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: '../build-report/report.html',
        generateStatsFile: true,
        statsFilename: '../build-report/stats.json',
        openAnalyzer: false,
      }),
    );
  }
  return plugins;
}

function createStyleRules(productionMode = false) {
  return [
    {
      // Gestion des fichiers css
      test: /\.css$/i,
      exclude: /main-styles\.css$/i,
      use: [
        // Injection du CSS dans un fichier séparé en PROD ou injecté en DEV
        productionMode ? MiniCssExtractPlugin.loader : { loader: 'style-loader', options: { injectType: 'styleTag' } },
        // Interprête le CSS en CommonJS et autorise les modules
        // les fichiers sont générés en mode dev. (car devtool activté)
        { loader: 'css-loader', options: { modules: true, importLoaders: 1 } },
        // Utilisation de autoprefixer pour injecter les directive css vendor specific à partir des notres
        // utilise la config. postcss.config.js
        'postcss-loader',
      ],
    },
    {
      // Gestion du fichier sass de chargement de chargement / custome de boostrap
      test: /main-styles\.css$/i,
      use: [
        // Injection du CSS dans un fichier séparé en PROD ou injecté en DEV
        productionMode ? MiniCssExtractPlugin.loader : { loader: 'style-loader', options: { injectType: 'styleTag' } },
        // Interprête le CSS en CommonJS et autorise les modules
        // les fichiers sont générés en mode dev. (car devtool activté)
        { loader: 'css-loader', options: { modules: false, importLoaders: 1 } },
        // Utilisation de autoprefixer pour injecter les directive css vendor specific à partir des notres
        // utilise la config. postcss.config.js
        'postcss-loader',
      ],
    },
  ];
}

// eslint-disable-next-line no-unused-vars
function createJsRules(prodMode = false) {
  return [{
    // Gestion du code-source js et jsx en utilisant babel pour
    // la transpilation
    // Exclut les fichiers js de node_modules du passage par babel
    test: /\.jsx?$/,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: babelConfig, // configuration séparé car ré-utilisé avec eslint
    },
  }];
}

// eslint-disable-next-line no-unused-vars
function createOtherRules(prodMode = false) {
  return [
    {
      // Gestion des fichiers images
      test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
      type: 'asset/resource', // le module asset émet un fichier séparé du bundle et exporte son url
    }, {
      // Gestion des polices d'écriture
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource', // le module asset émet un fichier séparé du bundle et exporte son url
    }, {
      test: /\.geojson$/,
      loader: 'json-loader',
    },
  ];
}

function createProductionSpecificConfigurations(prodMode = false) {
  if (!prodMode) {
    return {};
  }
  return {
    optimization: {
      moduleIds: 'deterministic', // les ids de modules sont calculés de manière à ne pas changer sur le module ne change pas
      runtimeChunk: 'single', // Créer un seul runtime code pour l'ensemble des chunks
      splitChunks: { // Met à part les codes des biblio tierces
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
      minimizer: [
        '...', // utilise les paramètres par défaut des minimzer (TerserPlugin pour minifier et minimiser JS)
        new CssMinimizerPlugin(), // minimise CSS
      ],
    },
  };
}

function createDevelopmentSpecificConfigurations(devMode = false) {
  if (!devMode) {
    return {};
  }
  return {
    devtool: 'inline-source-map',
    devServer: {
      port: 3000,
      host: '0.0.0.0', // Accessible uniquement d'une ip localhost (4 ou 6)
      historyApiFallback: true, // Evite d'afficher une page 404 plutot que la page index.html
      // quand on utilie HTML5 History API
      static: [{
        directory: path.resolve(__dirname, 'build'),
      }, {
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
}

// Creation et export de la configuration selon le mode utilisé
module.exports = (env, argv) => {
  const PRODUCTION_MODE = argv.mode === 'production';
  const DEV_MODE = argv.mode === 'development';

  setGlobalVariable(PRODUCTION_MODE, DEV_MODE);
  printPreReport(PRODUCTION_MODE, DEV_MODE);
  // Création de la configuration de base
  return {
    mode: argv.mode,
    // Environnement cible du déploiement
    target: 'web',
    // Point d'entrée de l'application
    entry: './src/index.jsx',
    // Sortie
    output: {
      path: path.join(__dirname, 'build/public'), // chemin obligatoirement absolu
      filename: PRODUCTION_MODE ? '[name].[contenthash].bundle.js' : '[name].bundle.js', // Ajout un hash pour s'assurer le telechargement du nouveau code produit par le navigateur
      sourceMapFilename: PRODUCTION_MODE ? '[name].[contenthash].map' : '[name].map',
      publicPath: PUBLIC_PATH,
      clean: true, // efface le contenu du dossier de sortie avant regénération
    },
    // plugins de construction
    plugins: createPluginConfiguration(PRODUCTION_MODE),
    // définit comment les modules vont être chargés
    // //ajoute les extensions .jsx et .scss aux extensions gérées
    resolve: {
      extensions: ['.js', '.json', '.jsx', '.css', '.wasm', '.mjs'],
    },
    // modules de configuration selon le type de fichier rencontré
    module: {
      rules: [
        ...createStyleRules(PRODUCTION_MODE),
        ...createJsRules(PRODUCTION_MODE),
        ...createOtherRules(PRODUCTION_MODE),
      ],
    },

    // Ajouts de règles spécifiques dans la config selon le mode
    ...createProductionSpecificConfigurations(PRODUCTION_MODE),
    ...createDevelopmentSpecificConfigurations(DEV_MODE),
  };
};
