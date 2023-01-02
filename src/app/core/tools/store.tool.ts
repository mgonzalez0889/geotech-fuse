import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export abstract class Store<T> {
  private _state: BehaviorSubject<T>;

  constructor(@Inject('') initialState: T) {
    this._state = new BehaviorSubject<T>(initialState);
  }

  private get state$(): Observable<T> {
    return this._state.asObservable();
  }

  private get state(): T {
    return this._state.getValue();
  }

  public setState<K extends keyof T, E extends Partial<Pick<T, K>>>(
    fn: (state: T) => E
  ): void {
    const state = fn(this.state);
    this._state.next({ ...this.state, ...state });
  }

  public selectState<K>(selector: (state: T) => K): Observable<K> {
    return this.state$.pipe(map(selector), distinctUntilChanged());
  }
}
