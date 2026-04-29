import { Component } from "@angular/core";
import { Project } from "@qa/projects/services/project";

@Component({
    selector: 'app-onboarding',
    imports: [],
    templateUrl: './onboarding.html'
})
export class Onboarding {
    constructor(private project: Project) { }

    async ngOnInit(): Promise<void> {
        const workspaces = await this.project.getUserWorkspaces();
        console.log('User workspaces:', workspaces);
    }
}
