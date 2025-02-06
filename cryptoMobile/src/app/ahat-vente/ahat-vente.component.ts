import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonItem,IonInput,IonList, IonSelect, IonSelectOption,IonButton} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ahat-vente',
  templateUrl: './ahat-vente.component.html',
  styleUrls: ['./ahat-vente.component.scss'],
  imports: [IonItem, IonList,IonInput, IonSelect, IonSelectOption,IonButton, FormsModule,CommonModule],

})
export class AhatVenteComponent  implements OnInit {
    // Variables liées via ngModel dans le template
    selectedCrypto: string='';
    quantite: string='';
      data:any;


    constructor() {}

    ngOnInit() {
      this.data=[
        {id:1, name:'BTC'},
        {id:2, name:'TRX'},
        {id:3, name:'LTC'},
      ];
    }
    
  recupererDonnees() {
    console.log('Crypto sélectionné:', this.selectedCrypto);
    console.log('quantite:', this.quantite);
  }
}
