import { Component } from '@angular/core';
import { OnSameUrlNavigation, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule,FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;


  constructor(private router: Router) {}

  login() {
    console.log('Email:', this.email);
    console.log('Mot de passe:', this.password);
    console.log('Se souvenir de moi:', this.rememberMe);
    // Ici, tu peux implémenter l'authentification avec ton API
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
