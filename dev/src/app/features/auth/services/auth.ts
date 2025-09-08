import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) { }
  
  authGoogle(payload: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`${jsonToGraphQLQuery({
        mutation: {
          authGoogle: {
            __args: { auth: payload },
            token: true
          }
        }
      }, { pretty: true })}`
    });
  }
}
