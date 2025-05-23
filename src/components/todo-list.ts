import { Todo, TodoService } from '../services/todo-service';
import { TodoItem } from './todo-item';

export class TodoList extends HTMLElement {
    private todoService: TodoService;
    private todos: Todo[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.todoService = new TodoService();
    }

    async connectedCallback() {
        await this.loadTodos();
        this.render();
    }

    private async loadTodos() {
        this.todos = await this.todoService.getTodos();
    }

    private async handleAdd(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.querySelector('input') as HTMLInputElement;
        const text = input.value.trim();

        if (text) {
            await this.todoService.addTodo(text);
            input.value = '';
            await this.loadTodos();
            this.render();
        }
    }

    private async handleToggle(event: CustomEvent<{ id: string; completed: boolean }>) {
        const { id, completed } = event.detail;
        await this.todoService.toggleTodo(id, completed);
        await this.loadTodos();
        this.render();
    }

    private async handleDelete(event: CustomEvent<{ id: string }>) {
        const { id } = event.detail;
        await this.todoService.deleteTodo(id);
        await this.loadTodos();
        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 800px;
                    margin: 2rem auto;
                    padding: 0 20px;
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                }
                .container {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
                    padding: 2rem;
                }
                h1 {
                    color: #1a1a1a;
                    text-align: center;
                    margin-bottom: 2rem;
                    font-size: 2rem;
                    font-weight: 600;
                }
                .todo-form {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 2rem;
                    position: relative;
                }
                input[type="text"] {
                    flex-grow: 1;
                    padding: 1rem 1.5rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.2s ease;
                    background: #f8fafc;
                }
                input[type="text"]:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                button {
                    padding: 1rem 2rem;
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                button:hover {
                    background: #2563eb;
                    transform: translateY(-1px);
                }
                button:active {
                    transform: translateY(0);
                }
                .todo-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .empty-state {
                    text-align: center;
                    color: #64748b;
                    padding: 3rem 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                    font-size: 1.1rem;
                }
                .stats {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 2rem;
                    padding-top: 1rem;
                    border-top: 2px solid #e2e8f0;
                    color: #64748b;
                    font-size: 0.9rem;
                }
                .add-icon {
                    width: 20px;
                    height: 20px;
                    stroke: currentColor;
                    stroke-width: 2;
                    fill: none;
                }
            </style>
            <div class="container">
                <h1>My Tasks</h1>
                <form class="todo-form">
                    <input type="text" placeholder="What needs to be done?" required>
                    <button type="submit">
                        <svg class="add-icon" viewBox="0 0 24 24">
                            <path d="M12 4v16m8-8H4"/>
                        </svg>
                        Add Task
                    </button>
                </form>
                <div class="todo-list">
                    ${this.todos.length === 0 
                        ? '<div class="empty-state">No tasks yet. Add one above to get started!</div>'
                        : this.todos.map(todo => `<todo-item></todo-item>`).join('')}
                </div>
                <div class="stats">
                    <span>${this.todos.length} total tasks</span>
                    <span>${this.todos.filter(t => t.completed).length} completed</span>
                </div>
            </div>
        `;

        // Add event listeners to the form
        const form = this.shadowRoot.querySelector('form');
        form?.addEventListener('submit', this.handleAdd.bind(this));

        // Initialize todo items
        const todoItems = this.shadowRoot.querySelectorAll('todo-item');
        todoItems.forEach((item, index) => {
            const todoItem = item as TodoItem;
            todoItem.data = this.todos[index];
            todoItem.addEventListener('toggle', (e: Event) => this.handleToggle(e as CustomEvent<{ id: string; completed: boolean }>));
            todoItem.addEventListener('delete', (e: Event) => this.handleDelete(e as CustomEvent<{ id: string }>));
        });
    }
}

customElements.define('todo-list', TodoList); 