import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() type: 'success' | 'error' | 'info' = 'info'; 
  @Input() message: string = ''; 
  isVisible: boolean = true; 

  closeAlert() {
    this.isVisible = false; 
  }
}
