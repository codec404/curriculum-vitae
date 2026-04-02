import { Injectable, signal } from '@angular/core';

export type CursorState = 'default' | 'hover' | 'click' | 'text';

@Injectable({ providedIn: 'root' })
export class CursorService {
  readonly x = signal(0);
  readonly y = signal(0);
  readonly state = signal<CursorState>('default');

  update(x: number, y: number): void {
    this.x.set(x);
    this.y.set(y);
  }

  setState(state: CursorState): void {
    this.state.set(state);
  }
}
