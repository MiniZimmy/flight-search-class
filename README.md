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
```typescript
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
```typescript
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
```typescript
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
```typescript
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

## Creation d'un service: FlightService

### Injectable decorator

Comme pour les Components et NgModules, on va utiliser un décorateur pour définir un service: `@Injectable` ([doc](https://angular.io/api/core/Injectable#injectable)).

```typescript
import { Injectable } from '@angular/core';
@Injectable()
export class FlightService {
  constructor() {}
}
```

```typescript
import { NgModule } from '@angular/core';
import { FlightService } from './flight.service';
@NgModule({
  imports: [
  ],
  providers: [
    FlightService
  ]
})
export class FlightServiceModule {}
```

Ajouter le décorateur `@Injectable` à la classe de notre service et l'ajouter dans la liste des `providers` de son module permet de bénéficier de l'[injection de dépendance](https://angular.io/guide/dependency-injection#dependency-injection-in-angular). Une (unique - singleton pattern) instance de ce service sera créée et mise à disposition des composants qui en ont besoin. Pour utiliser un service, il faut dont que le module de ce dernier soit déjà importé (pour que le service soit mis à disposition) et que le service soit **injecté** dans le `constructor` du composant qui veut l'utiliser.

Ainsi on ajoute `FlightServiceModule` à la liste des imports dans les modules oú on veut l'utiliser et on injecte le `FlightService` dans le constructeur du composant ou on va utiliser le service: `constructor(private flightService: FlightService)`.

### Utilisation du service

Afin de faciliter la création des futures fonctions du service, la première fonction permettant de récupérer les `flight-offers` a été créée, appelée dans le composant et son résultat a été affiché directement dans la page.
La nouvelle fonction `getFlightOffers` retourne un [Observable](https://angular.io/guide/observables) de `FlightOffersResponse` retourné par la fonction `Http.get` et prend en paramètre un objet de type `FlightOffersRequest`. Ces deux objets sont des interfaces définies dans `src/app/models`.
Pour utiliser `getFlightOffers` dans `SearchComponent`, il faut importer le `FlightServiceModule` dans le `SearchModule` et l'ajouter au constructeur de `SearchComponent`:
```typescript
export class SearchComponent implements OnInit {
  public search: Observable<FlightOffersResponse>;
  constructor(private flightService: FlightService) {
  }
  ngOnInit() {
    this.search = this.flightService.getFlightOffers({
      origin: 'CDG',
      destination: 'LON',
      departureDate: new Date('2019-06-06')
    });
  }
}
```
Le résultat est stocké dans la variable pulique `search` et utilisée dans le template: `{{search | async | json}}`. On utilise ici deux `Pipes` définis par Angular:
- [JsonPipe](https://angular.io/api/common/JsonPipe): Affiche un objet dans le template (afficherait [Object object] sinon).
- [AsyncPipe](https://angular.io/api/common/AsyncPipe): S'abonne à un Observable pour en retourner les valeurs émises.

Ainsi `| async | json` permet de récupérer la valeur extraite de l'Observable puis de la transformer en JSON pour l'afficher dans le template.

## Flight offer search

### Création du composant

Le but de ce nouveau composant sera de créer un objet respectant l'interface `FlightOffersRequest` créée à partir de [flight-offer (Low-fare search)](https://developers.amadeus.com/self-service/category/203/api-doc/4/api-docs-and-example/10002).
Créez le composant `flight-offer-search` avec le décorateur `@Component` comme présenté plus haut.

Pour ce formulaire, il faut au minimum deux `input`s de type text pour `origin` et `destination` et un input de type `date` pour la `departureDate`. Des [inputs HTML classiques](https://www.w3schools.com/tags/tag_input.asp) feraient l'affaire mais j'ai ajouté `@angular/material` au projet que vous pouvez aussi utiliser. Pour les utiliser, rien de plus simple, il suffit de choisir le [composant](https://material.angular.io/components/categories/forms) dont vous avez besoin, importer son module ([Indiqué ici pour l'input classique par exemple](https://material.angular.io/components/input/api)) et utiliser le tag correspondant comme montré dans les examples.

### Formulaires et data binding

Une fois le template prêt, il faut lier les données du formulaire à un objet de type `FlightOffersRequest` du composant afin d'appeler la fonction du service.
Il éxiste deux principales façons de créer des formulaires avec Angular:
- [Reactive forms](https://angular.io/guide/reactive-forms)
- [Template driven forms](https://angular.io/guide/forms#template-driven-forms)

Pour ce cours, on utilisera les template driven forms, plus facile à comprendre pour commencer les forms avec Angular, d'autant plus que les Reactive forms se basent sur les Observables.
Pour le template driven form, vous utiliserez la directive [`ngModel`](https://angular.io/guide/forms#two-way-data-binding-with-ngmodel) afin de lier le composant et template (La directive `ngForm` comme présentée dans la doc à la suite du `ngModel` permet notamment de gérer la validité du form).
). Il éxiste plusieurs types de binding mis à disposition par Angular - toutes détaillées [ici (sections template syntax et Forms)](https://angular.io/guide/cheatsheet).
Pour cette section il vous faudra donc:
- Créer le composant - le lier au template et à la feuille de style avec le décorateur `Component`.
- Créer le template et son style
- Déclarer et exporter votre composant dans le nouveau module
- Important et utiliser votre nouveau composant dans la page `search`
- Initialiser votre modèle dans le composant
- Lier les valeurs du template à votre modèle grâce à la directive `[(ngModel)]`.
- Ajouter un bouton et appeler la `getFlightOffers()` lorsque l'utilisateur clique dessus. Un autre style de binding est nécessaire ici: Il faut écouter l'évèvement click: `(click)="functionToCall()"`.
- Enfin, pour vérifier que l'appel à la fonction fonctionne, affichez le résultat de l'appel dans le template avec les pipes `async` et `json` comme présenté dans la page `search`.

Bouts de codes si besoin:
Intialisation du modèle:
```typescript
public model = {
  origin: '',
  destination: '',
  departureDate: undefined,
  returnDate: undefined
};
```
Template (Sans binding):
```HTML
  <form class="row no-gutters form-content">
    <mat-form-field appearance="fill" class="col-12 col-md-6 px-md-2">
      <mat-label>Origin</mat-label>
      <input matInput type="text" name="origin">
    </mat-form-field>
    <mat-form-field appearance="fill" class="col-12 col-md-6 px-md-2">
      <mat-label>Destination</mat-label>
      <input matInput type="text" name="destination">
    </mat-form-field>
    <mat-form-field class="col-12 col-md-6 px-md-2">
      <input matInput [matDatepicker]="departureDatePicker" placeholder="Departure date" name="departure-date">
      <mat-datepicker-toggle matSuffix [for]="departureDatePicker"></mat-datepicker-toggle>
      <mat-datepicker [startAt]="minDate" startView="month" #departureDatePicker></mat-datepicker>
    </mat-form-field>
    <mat-form-field class="col-12 col-md-6 px-md-2">
      <input matInput [matDatepicker]="returnDatePicker" placeholder="Return date" name="return-date">
      <mat-datepicker-toggle matSuffix [for]="returnDatePicker"></mat-datepicker-toggle>
      <mat-datepicker startView="month" #returnDatePicker></mat-datepicker>
    </mat-form-field>
    <div class="button-container col-12 col-md-6 mt-3 px-md-2 ml-auto">
      <button mat-stroked-button class="button continue w-100">Search</button>
    </div>
  </form>
```
Bonus: Activer le bouton `Search` seulement si les champs `origin`, `destination` et `departureDate` sont remplis - étant donné qu'ils sont obligatoires pour la requête des `flight-offers`.

## Flight offer results

Les résultats sont maintenant affichés en JSON directement dans le template. Le but de cette partie est de créer un composant pour afficher les résultats et qui viendra remplacer `{{flightOffers | async | json}}`.

### Affichage du JSON dans le nouveau composant

Pour cette partie, il faudra donc:
- Créer un nouveau dossier `flight-offers` dans `src/app/components` pour accueillir les fichiers nécessaires au nouveau composant: module, composant, template, feuille de style, et barrel file si vous le souhaitez
- Importer le module du nouveau composant dans le composant `flightOfferSearch` et utiliser le nouveau tag `<app-flight-offers>` dans template.
- Passer les résultat au composant `FlightOffersComponent`. Pour cela, il faut utiliser un autre décorateur [`@Input`](https://angular.io/api/core/Input). Il permet de définir un nouvel attribut à votre composant pour lui passer les informations dont il a besoin:
```typescript
@Input()
flightOffers?: FlightOffersResponse;
```
```HTML
<app-extensive-flight-results [extensiveFlightSearch]="extensiveFlightSearch$ | async"></app-extensive-flight-results>
```
- Afficher l'objet passé en input grace au `JsonPipe`.

### Création du template pour afficher les résultats

Le but de cette partie est donc d'afficher la liste des vols retourés par l'api. Pour cela, vous aurez besoin de quelques directives mises à disposition par Angular:
- [*ngIf](https://angular.io/api/common/NgIf): Affiche le template en fonction de la valeur de l'expression donnée
- [*ngFor](https://angular.io/api/common/NgForOf): Crée une instance du template pour chaque élément du tableau fourni en input.

L'idéal pour ce composant est d'afficher, pour chaque vol, le numéro de vol, les différents aéroports traversés et le prix total.

## Autocomplétion Ville et/ou aéroport

Dans cette partie, il faudra créer le service et modifier les inputs afin de rechercher les villes et aéroport correspondant à ce que l'utilisateur est en train de taper. Dans son [tutoriel](https://angular.io/tutorial/toh-pt6#search-by-name), Angular montre une implémentation équivalente de cette fonctionnalité dont vous pourrez vous inspirer.

### Airport & City Search service

Il faut dans un premier temps créer le service permettant d'appeler l'[API](https://developers.amadeus.com/self-service/category/203/api-doc/10/api-docs-and-example/10008).
Comme pour `getFlightOffers`, il faut utiliser le token pour faire la requête. La fonction éxistante `getToken` renvoie un observable émettant la valeur du token. La fonction [`switchMap`](https://www.learnrxjs.io/operators/transformation/switchmap.html) utilisée dans `getFlightOffers` permet de renvoyer un nouvel observable à chaque fois qu'une valeur du premier Observable est émise. [Rxjs Marble](https://rxmarbles.com/#switchMap) aide souvent à mieux comprendre le fonctionnement des opérateurs sur les observables.

### Modification du composant

Il faut maintenant appeler cette fonction à chaque fois (ou presque) que l'utilisateur modifie un input `origin` ou `destination`.
[Subject](http://reactivex.io/rxjs/class/es6/Subject.js~Subject.html) est à la fois `Observable` et `Observer`, ce qui veut dire qu'on peut s'y abonner comme on le ferait avec un Observable mais on peut aussi y injecter des valeurs avec la fonction `next`. Il nous servira pour pousser chaque changement fait dans l'input et s'y abonner pour appeler la fonction du service afin de récupérer les suggestions.
Les étapes à suivre sont les suivantes:
- Créer le `Subject`
- Ecouter les changements de l'input (output `ngModelChange`)
- "Pousser" chaque valeur dans le `Subject` (fonction `next`)
- "Chainer" l'appel au service à chaque fois qu'une valeur est émise (fonction `pipe`, puis opérateur `switchMap` pour émettre un nouvel Observable - Comme dans le tuto Angular, il est conseillé d'ajouter `debounceTime` et `distinctUntilChanged` pour ne pas flooder le serveur)
- Utiliser `mat-autocomplete` pour afficher les valeurs retournées par l'api

## Refactoring search page and component

Pour le moment le composant `flight-offer-search` importe et utilise lui même le composant `flight-offers`. Pour séparer au mieux les composants et les rendre plus facilement ré-utilisables, il est conseillé de les séparer si ils n'ont pas la même fonction. Par éxemple, on peut vouloir afficher le formulaire sans afficher les résultats juste en dessous, mais plutot dans une page séparée.
La page search sera alors responsable de faire la recherche avec les données que lui passe le formulaire grâce au décorateur [`@Output`](https://angular.io/api/core/Output).

Pour cette partie il faudra:
- Définir l'`@Output()` dans flight search component et l'émettre quand on clique sur le bouton
- Supprimer le `FlightOfferComponent` du template et des imports de `flightOfferSearch`
- Ecouter le nouvel évenement dans la page `search` - comme on le ferait pour un `click` - et appeler le service quand il est émit
- Ajouter le `flightOfferComponent` directement dans la page.
