# FlightSearchClass

Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 7.0.6 en utilisant les options suivantes:
- Add Angular Routing: Y
- Which stylesheet format: SCSS

Ce projet a pour but de créer une application très simple basée sur l'[API proposée par Amadeus](https://developers.amadeus.com/). Il suffit de créer un compte et de placer l'`apiKey` et l'`apiSecret` dans le fichier `src/environments/environment.common.ts` comme montré dans le fichier `environment.common.example.ts` pour commencer à l'utiliser.

## Code set-up

Quelques modifications ont été apportées au code généré par Angular CLI pour faciliter le développement:
- Changements dans `angular.json`:
  - Assets: Exposer les images de `src/assets/images` à `./images`: `{"glob": "**/*", "input": "src/assets/images", "output": "./images/"}`
  - Styles: Rassembler les feuilles de styles globales dans `src/styling` et exposer le dossier pour importer plus facilement les variables de `_variables.scss`:
    ```
      "styles": [
        "src/styling/styles.scss"
      ],
      "stylePreprocessorOptions": {
        "includePaths": [
          "./src/styling"
        ]
      },
    ```
- Modification des variables d'environment dans `src/environments` pour y mettre les données liées à l'API utilisée. N'oubliez pas de créer le fichier `environment.common.ts` avec vos informations de connexion avant de lancer le serveur de développement.
- Ajout du fichier `environment.common.ts` dans `.gitignore` pour éviter de partager mes identifiants de connexions avec tout le monde.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

