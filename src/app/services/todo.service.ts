import { Injectable, signal } from '@angular/core';

export interface Todo {
  task: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly STORAGE_KEY = 'todos';
  private readonly _todos = signal<Todo[]>(this.loadFromLocalStorage());

  readonly todos = this._todos.asReadonly();

  constructor() {}

  private loadFromLocalStorage(): Todo[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  private saveToLocalStorage(todos: Todo[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
  }

  add(task: string) {
    const updated = [...this._todos(), { task, completed: false }];
    this._todos.set(updated);
    this.saveToLocalStorage(updated);
  }

  toggle(index: number) {
    const updated = this._todos().map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    this._todos.set(updated);
    this.saveToLocalStorage(updated);
  }

  delete(index: number) {
    const updated = this._todos().filter((_, i) => i !== index);
    this._todos.set(updated);
    this.saveToLocalStorage(updated);
  }
}
