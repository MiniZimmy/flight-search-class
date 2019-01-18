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

## Angular routing set-up and first page: search

### Création du module et de la page search

#### Composant search

Pour déclarer un composant Angular, on utilise le décorateur `@Component`.
Le décorateur est une fonction qui modifie la classe JavaScript pour ajouter des méta-données qui seront utile à Angular pour définir le rôle de cette classe.
Cette fonction accepte plusieurs propriétés en paramètre, les plus importantes sont les suivantes: (cf [doc](https://angular.io/api/core/Component))
- `selector`: css selector that identifies this component in a template
- `template`/`templateUrl`: Template of the view or url to the template file
- `styles`/`styleUrls`: Styles to be applied to the component's view or Urls to the stylesheets

Le composant search devient donc tout simplement:
```
import {Component} from '@angular/core';
@Component({
  selector: 'app-search',
  styleUrls: ['./search.style.scss'],
  templateUrl: './search.template.html'
})
export class SearchComponent {
  constructor() {}
}
```

#### Module search

Afin de créer un module Angular (à ne pas confondre avec un module ES6 -- tout fichier qui `export` quelque chose), on va utiliser le décorateur `@NgModule`.
Ses propriétés principales sont les suivantes: ([doc](https://angular.io/api/core/NgModule))
- `declarations`: Classes des composants (Component), directives et filtres (Pipes) déclarée par le module
- `imports`: Modules dont dépend le module
- `providers`: Services créés par ce module
- `exports`: Classes déclarées qui doivent etre visibles par les autres modules
- `bootstrap`: Seulement utilisé par le root module, pour définir le root component

Le `searchModule` ne fait donc que déclarer le `searchComponent` dans un premier temps:
```
import {NgModule} from '@angular/core';
import {SearchComponent} from './search.component';

@NgModule({
  imports: [],
  declarations: [SearchComponent],
  exports: [],
  providers: []
})
export class SearchModule {}
```

### Définition des routes

Lors de la génération du projet, nous avons choisi d'utiliser le `routing` proposé par Angular. Le module `AppRoutingModule` a donc été défini dans le fichier `app-routing.module.ts` et importé dans le module principal de l'application: `app.module.ts`. `<router-outlet></router-outlet>` a aussi été ajouté a la page principale de l'application `app.component.html`. Il s'agit d'un placeholder oú sera affiché le contenu de chaque page.

`AppRoutingModule` importe et utilise le `RouterModule` proposé par Angular (documentation [ici](https://angular.io/api/router/RouterModule)).
L'objet `routes` contiendra toutes nos routes. Toutes les propriétés de l'objet `Route` sont détaillées dans la [documentation](https://angular.io/api/router/Routes#description), les propriétés principales sont les suivantes:
- `path`: Nom de la route (sera utilisé dans l'URL), dans notre cas `search` permettra de créer la route `localhost:xxxx/search`
- `component`: Composant à afficher -- eager loading
- `loadChildren`: Module a loader -- [lazy loading](https://angular.io/api/router/Routes#lazy-loading)
- `pathMatch`: [Matching strategy](https://angular.io/api/router/Routes#matching-strategy)
- `redirectTo`: Redirige la path courant sur le path indiqué

On choisit de "lazy load" nos pages - le module `SearchModule` ne sera loadé que si la page `search` est affichée. La propriété `loadChildren` nous permet de spécifier seulement le chemin vers le module qui définira le composant a charger grace à la fonction `forChild` du `RouterModule`.

`app-routing.module.ts`:
```
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', redirectTo: 'search', pathMatch: 'full'},
      {path: 'search', loadChildren: './pages/search/index#SearchModule'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

Comme on l'a dit plus haut, il faut maintenant définir dans le `searchModule` le composant à loader quand la page est demandée:
`search.module.ts`:
```
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SearchComponent} from './search.component';
@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: SearchComponent}])
  ],
  declarations: [SearchComponent],
  exports: [],
  providers: []
})
export class SearchModule {}
```