import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-test-case-description',
  imports: [],
  templateUrl: './test-case-description.html',
  styleUrl: './test-case-description.scss'
})
export class TestCaseDescription {
  @Input() description: string = '';
  formatted: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    this.formatted = changes['description'].currentValue.replaceAll(/```(.*?)```/g, '<div class="code">$1</div>');
  }
}
