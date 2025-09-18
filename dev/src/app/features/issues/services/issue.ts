import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { IIssue } from '../../../models/test-run.model';
import { ApolloQueryResult } from '@apollo/client';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

@Injectable({
  providedIn: 'root'
})
export class Issue {

  constructor(private apollo: Apollo) { }

  getIssues(): Observable<ApolloQueryResult<{ getIssues: IIssue[] }>> {
    return this.apollo.query<{ getIssues: IIssue[] }>({
      query: gql`
        query {
          issues {
            _id
            edgeCase {
              _id
              title
              expectation
            }
            title
            description
            status
            priority
            stepsToReproduce {
              step
            }
            attachments
            createdAt
            updatedAt
          }
        }`
    });
  }

  editIssue(id: string, issue: Partial<Pick<IIssue, 'status' | 'priority'>>): Observable<MutationResult<{ editIssue: IIssue }>> {
    return this.apollo.mutate<{ editIssue: IIssue }>({
      mutation: gql`${jsonToGraphQLQuery({
        mutation: {
          editIssue: {
            __args: {
              id,
              issue
            },
            _id: true,
            edgeCase: {
              _id: true,
              title: true,
              expectation: true
            },
            title: true,
            description: true,
            status: true,
            priority: true,
            stepsToReproduce: {
              step: true
            },
            attachments: true,
            createdAt: true,
            updatedAt: true
          }
        }
      })}`
    });
  }
}
