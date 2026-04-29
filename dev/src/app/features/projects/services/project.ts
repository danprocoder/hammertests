import { Injectable } from "@angular/core";
import { IUser } from "@qa/user";
import { BehaviorSubject, Observable, Subject, tap } from "rxjs";
import { environment } from "../../../../environments/environment.development";
import { AuthService } from "@qa/auth/services/auth";

export interface IProjectEnvironment {
  _id: string;
  name: string;
  url: string;
}

export interface IProject {
  _id: string;
  name: string;
  description: string;
  environments?: IProjectEnvironment[];
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class Project {
  baseUrl = environment.apiUrl;

  isAddProjectDialogVisible$ = new Subject<boolean>();
  isAddProjectDialogVisible = false;

  selectedProject: IProject | null = null;
  addProjectDialogClosed$ = new Subject<void>();

  public project$ = new BehaviorSubject<IProject | null>(null);

  constructor(private auth: AuthService) { }

  get currentProjectId(): string {
    return this.project$.value?._id ?? '';
  }

  getProjects(): Promise<any> {
    return fetch(`${this.baseUrl}/workspaces/${this.getCurrentWorkspaceId()}/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth.getAccessToken()}`
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      return response.json();
    });
  }

  getCurrentWorkspaceId(): string {
    return '';
  }

  getUserWorkspaces(): Promise<any> {
    return fetch(`${this.baseUrl}/workspaces/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth.getAccessToken()}`
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user workspaces');
      }
      return response.json();
    });
  }

  /** Update the current project for the current user. */
  // changeProject(projectId: string): Observable<MutationResult<{ editUser: IUser }>> {
  //   return this.apollo.mutate<{ editUser: IUser }>({
  //     mutation: gql`mutation($user: UserEditInput) {
  //       editUser(user: $user) {
  //         project {
  //           _id,
  //           name
  //         }
  //       }
  //     }`,
  //     variables: {
  //       user: {
  //         project: projectId
  //       }
  //     }
  //   }).pipe(
  //     tap((res: MutationResult<{ editUser: IUser }>) => {
  //       this.project$.next(res.data?.editUser?.project!);
  //     })
  //   );
  // }

  openAddProjectDialog(): Subject<void> {
    this.isAddProjectDialogVisible = true;
    this.isAddProjectDialogVisible$.next(true);

    return this.addProjectDialogClosed$;
  }

  openEditProjectDialog(project: IProject): Subject<void> {
    this.selectedProject = project;

    this.isAddProjectDialogVisible = true;
    this.isAddProjectDialogVisible$.next(true);

    return this.addProjectDialogClosed$;
  }

  closeAddProjectDialog(): void {
    this.isAddProjectDialogVisible = false;
    this.isAddProjectDialogVisible$.next(false);

    this.selectedProject = null;
    this.addProjectDialogClosed$.next();
  }

  // createProject(payload: Partial<IProject>): Observable<any> {
  //   return this.apollo.mutate({
  //     mutation: gql`mutation($project: ProjectInput!) {
  //       createProject(project: $project) {
  //         _id,
  //         name,
  //         description,
  //         environments {
  //           _id,
  //           name,
  //           url
  //         },
  //         createdAt
  //       }
  //     }`,
  //     variables: {
  //       project: payload
  //     }
  //   });
  // }

  // updateProject(projectId: string, payload: Partial<IProject>): Observable<any> {
  //   return this.apollo.mutate({
  //     mutation: gql`mutation($projectId: ID, $project: ProjectInput) {
  //       editProject(projectId: $projectId, project: $project) {
  //         _id
  //       }
  //     }`,
  //     variables: {
  //       projectId,
  //       project: payload
  //     }
  //   });
  // }
}
