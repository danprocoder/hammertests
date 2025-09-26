import { Component } from '@angular/core';
import { Issue } from '../../services/issue';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { IIssue } from '../../../../models/test-run.model';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-view-issues',
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzTableModule,
    NzSelectModule,
    NzButtonModule,
    NzTagModule,
    NzCardModule
  ],
  templateUrl: './view-issues.html',
  styleUrl: './view-issues.scss'
})
export class ViewIssues {

  issues: any[] = [];

  issueModalVisible = false;
  selectedIssue: IIssue | null = null;

  constructor(private issueService: Issue) { }

  ngOnInit() {
    this.loadIssues();
  }

  loadIssues(): void {
    this.issueService.getIssues().subscribe({
      next: (result: any) => {
        this.issues = result.data.issues;
      },
      error: (error: any) => {
        console.error('Error fetching issues:', error);
      }
    });
  }

  getStatusColor(status: IIssue['status']): string {
    return {
      open: 'gray',
      in_progress: 'blue',
      resolved: 'green'
    }[status];
  }

  viewIssue(issue: IIssue): void {
    this.selectedIssue = issue;
    this.issueModalVisible = true;
  }

  closeIssueModal(): void {
    this.issueModalVisible = false;
    this.selectedIssue = null;
  }

  onPriorityChange($event: IIssue['priority']): void {
    if (this.selectedIssue) {
      this.issueService.editIssue(this.selectedIssue._id!, { priority: $event }).subscribe({
        next: (result: any) => {
          this.loadIssues();
        },
        error: (error: any) => {
          console.error('Error updating issue priority:', error);
        }
      });
    }
  }

  onStatusChange($event: IIssue['status']): void {
    if (this.selectedIssue) {
      this.issueService.editIssue(this.selectedIssue._id!, { status: $event }).subscribe({
        next: (result: any) => {
          this.loadIssues();
        },
        error: (error: any) => {
          console.error('Error updating issue status:', error);
        }
      });
    }
  }

}
