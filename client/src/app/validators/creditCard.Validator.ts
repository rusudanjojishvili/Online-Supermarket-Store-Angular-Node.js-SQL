import {  FormControl, FormGroup,Validators } from '@angular/forms'

export class creditCardValidator extends Validators{


    static cardsValidator(cardValue: FormControl) {
        const card = cardValue.value;
        console.log('card',card);
        if(card !=="null"){
                if (/^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/.test(card) ||
                 /^4[0-9]{12}(?:[0-9]{3})?$/.test(card) || /^3[47][0-9]{13}$/.test(card) || /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(card)
                 || /^[0-9]{8,9}$/.test(card)) {
                               
                             return null;
                             
                         } else {
                              
                             return   { creditcarderror: true };
                         }
              }
         
      
      }


  
}