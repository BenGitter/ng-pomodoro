import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  popup: any;
  token: string = '';

  constructor(){
    window.addEventListener("message", (e) => {
      if(e.data.completed){
        // Received correct message
      
        if(e.data.token){
          // got token
          this.token = e.data.token;
          console.log(e.data.token);
        }else{
          // error
          console.log('An error occured');
        }

        this.popup.close();
      }
    });  
  }

  onLoginTrello(){
    console.log("LOGIN...");

    this.popup = window.open("http://localhost:3000/auth/trello", "Login", "height=700,width=500,status=no,menubar=no,toolbar=no,personalbar=no,resizable=no");

  }
}
