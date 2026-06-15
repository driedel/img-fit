# img-fit + Angular Example

Create a new Angular app and install the adapter:

```bash
ng new my-img-fit-app
cd my-img-fit-app
npm install @img-fit/angular
```

Import the directive in your standalone component:

```ts
import { Component } from '@angular/core';
import { ImgFitDirective } from '@img-fit/angular';

@Component({
  standalone: true,
  imports: [ImgFitDirective],
  template: `
    <img
      [imgFit]="'https://img-fwd.driedel.dev/images/photo.jpg'"
      alt="Coastal landscape"
    />
  `
})
export class AppComponent {}
```

Run the app:

```bash
ng serve
```

Resize the browser and check the Network tab to see the generated `?rs=` values.
