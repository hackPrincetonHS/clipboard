# UserSignInSystem

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
It's a pain in the butt, but here's the full thing:
```
ng build --prod --aot=false --build-optimizer=false --output-path docs --base-href /clipboard/
```
Here's to test AOT compilation
```
ng build --prod --output-path docs --base-href /clipboard/
```
AOT compilation should be faster and smaller, but it sometimes breaks and I don't know why

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
