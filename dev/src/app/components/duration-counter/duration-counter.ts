import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-duration-counter',
  imports: [CommonModule],
  templateUrl: './duration-counter.html',
  styleUrl: './duration-counter.scss'
})
export class DurationCounter {
  @Input() startTime: any;
  displayDays: number = 0;
  displayHours: number = 0;
  displayMinutes: number = 0;
  displaySeconds: number = 0;

  ngOnInit() {
    if (this.startTime) {
      setInterval(() => {
        const diff = new Date().getTime() - new Date(this.startTime).getTime();

        this.displayDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        let remaining = diff % (1000 * 60 * 60 * 24);
        this.displayHours = Math.floor(remaining / (1000 * 60 * 60));

        remaining = diff % (1000 * 60 * 60);
        this.displayMinutes = Math.floor(remaining / (1000 * 60));

        remaining = diff % (1000 * 60);
        this.displaySeconds = Math.floor(remaining / 1000);
      }, 1000);
    }
  }
}
