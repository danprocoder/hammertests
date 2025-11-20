import { Component } from "@angular/core";
import { Project } from "../../features/projects/services/project";
import { NzSelectModule } from "ng-zorro-antd/select";
import { RouterModule } from "@angular/router";

interface IProject {
  _id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-change-workspace',
  templateUrl: './change-workspace.html',
  styleUrls: ['./change-workspace.scss'],
  imports: [
    NzSelectModule,
    RouterModule
  ]
})
export class ChangeWorkspace {
  workspaces: IProject[] = [];

  constructor(private workspace: Project) {}

  ngOnInit() {
    this.workspace.getUserWorkspaces().subscribe(result => {
      this.workspaces = result.data.userProjects;
    });
  }
}
