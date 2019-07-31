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
This will build and immediately publish whatever changes you have
Your code, however, won't be commited and pushed automatically
```
ng build --prod --base-href "https://clipboard.hackphs.tech/"
npx angular-cli-ghpages --dir=dist/userSignInSystem --cname=clipboard.hackphs.tech
```
AOT compilation should be faster and smaller, but it sometimes breaks and I don't know why

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
