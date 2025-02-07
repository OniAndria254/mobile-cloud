// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/users/user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private userService: UserService) {}

  login() {
    this.userService.authenticateUser(this.email, this.password).subscribe({
      next: (isMatch: boolean) => {
        if (isMatch) {
          console.log('Connexion réussie !');
          this.router.navigate(['/home']);
        } else {
          console.error('Mot de passe incorrect');
        }
      },
      error: (err) => {
        console.error('Erreur lors de l\'authentification:', err);
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
