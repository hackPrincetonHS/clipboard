---
permalink: /index.html
---

## Dependencies

You just need to install the angular cli and it should roughly work
All the Dependencies should be added by angular when it is built for the first time from package-lock.json

## UserSignInSystem

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.3.

## Development server
This is mainly what I use for testing

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
I do this before I commit and push so others can see my changes
YOU MUST DUPLICATE index.html into 404.html in the docs folder if you want reload to work
Here's to test AOT compilation
```
ng build --prod --output-path docs --base-href "https://hackprincetonhs.github.io/clipboard/"
```
AOT compilation should be faster and smaller, but it sometimes breaks and I don't know why

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
