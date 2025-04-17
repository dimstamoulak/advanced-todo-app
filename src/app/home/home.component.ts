import {Component, computed, inject, signal} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo } from '../models/todo.interface';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { TodoApiService } from '../services/todo-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgForOf,
    NgIf
  ]
})
export class HomeComponent {
  todoForm: FormGroup;
  todos = signal<Todo[]>([]);
  filter = signal<'all' | 'completed' | 'pending'>('all');

  private todoApi = inject(TodoApiService);

  constructor(private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
    });

    // Load todos from API
    this.todoApi.getTodos().subscribe((apiTodos) => {
      // Take just 10 for demo
      const firstTen = apiTodos.slice(0, 10).map(t => ({
        title: t.title,
        completed: t.completed
      }));
      this.todos.set(firstTen);
    });
  }




  onSubmit() {
    if (this.todoForm.valid) {
      const title = this.todoForm.value.title;
      this.todos.update((t) => [...t, { title, completed: false }]);
      this.todoForm.reset();
    }
  }

  toggleCompletion(index: number) {
    this.todos.update((t) => {
      const updatedTodos = [...t];
      updatedTodos[index].completed = !updatedTodos[index].completed;
      return updatedTodos;
    });
  }

  deleteTodo(index: number) {
    this.todos.update((t) => t.filter((_, i) => i !== index));
  }

  clearCompleted() {
    this.todos.update((t) => t.filter((todo) => !todo.completed));
  }

  setFilter(f: 'all' | 'completed' | 'pending') {
    this.filter.set(f);
  }

  filteredTodos = computed(() => {
    const all = this.todos();
    switch (this.filter()) {
      case 'completed':
        return all.filter((t) => t.completed);
      case 'pending':
        return all.filter((t) => !t.completed);
      default:
        return all;
    }
  });
}
