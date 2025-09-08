import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-test-status',
  imports: [CommonModule],
  templateUrl: './test-status.html',
  styleUrl: './test-status.scss'
})
export class TestStatus {
  @Input() status: 'passed' | 'passed-with-warnings' | 'needs-a-retest' | 'skipped' | 'failed' | undefined;

  getText(): string | undefined {
    return this.status?.replaceAll('-', ' ');
  }
}
