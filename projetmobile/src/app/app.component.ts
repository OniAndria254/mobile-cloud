import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-root',
  standalone: true, // Marque le composant comme standalone
  imports: [IonicModule], // Import des modules nécessaires pour ce composant
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  styles: [`
   
  `]
})
export class AppComponent {}
