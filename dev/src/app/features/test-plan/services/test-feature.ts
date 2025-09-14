import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { ApolloQueryResult } from '@apollo/client';

@Injectable({
  providedIn: 'root'
})
export class TestFeature {
  constructor(private apollo: Apollo) { }

  createFeature(payload: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`${jsonToGraphQLQuery({
        mutation: {
          createTestPlan: {
            __args: payload,
            _id: true
          }
        }
      }, { pretty: true })}`
    });
  }

  save(id: string, name: string, description: string, environments: any[], features: any[], deletedFeatures: any[], deletedTestCases: any[]): Observable<MutationResult<any>> {
    return this.apollo.mutate({
      mutation: gql`${jsonToGraphQLQuery({
        mutation: {
          updateTestPlan: {
            __args: {
              id,
              name,
              description,
              environments,
              features,
              deletedFeatures,
              deletedTestCases
            },
            _id: true
          }
        }
      })}`
    })
  }

  getTestCase(testCaseId: string): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({
      query: gql`query {
        getTestCase(id: "${testCaseId}") {
          _id,
          name,
          description
        }
      }`
    });
  }

  getPlan(planId: string): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({
      query: gql`query {
        testPlan(id: "${planId}") {
          _id,
          name,
          description,
          environments {
            _id,
            name,
            url
          },
          features {
            _id,
            name,
            url,
            order,
            testCases {
              _id,
              name,
              description,
              order,
              stepsToTest {
                _id,
                description
              },
              edgeCases {
                _id,
                title,
                expectation,
                order
              }
            }
          },
          createdAt
        }
      }`
    });
  }

  getPlans(): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({
      query: gql`query {
        testPlans {
          _id,
          name,
          description,
          currentTestRun {
            _id,
            createdAt
          },
          lastTestRun {
            _id,
            createdAt
          },
          numberOfTestCases,
          createdAt
        }
      }`
    });
  }

  deletePlan(planId: string): Observable<MutationResult<any>> {
    return this.apollo.mutate({
      mutation: gql`mutation {
        deleteTestPlan(id: "${planId}")
      }`
    });
  }
}
