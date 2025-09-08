import { Injectable } from "@angular/core";
import { CanDeactivate, MaybeAsync } from "@angular/router";

export interface Deactivatable<T> {
  canDeactivate(): MaybeAsync<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivatePage<T> implements CanDeactivate<Deactivatable<T>> {
  canDeactivate(component: Deactivatable<T>) {
    return component.canDeactivate(); //
  }
}
