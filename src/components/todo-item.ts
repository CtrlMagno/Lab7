import { Todo } from '../services/todo-service';

export class TodoItem extends HTMLElement {
    private todo!: Todo;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set data(todo: Todo) {
        this.todo = todo;
        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .todo-item {
                    display: flex;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    transition: all 0.2s ease;
                }
                .todo-item:hover {
                    background: white;
                    border-color: #3b82f6;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }
                .todo-text {
                    flex-grow: 1;
                    margin: 0 1rem;
                    font-size: 1rem;
                    color: #1a1a1a;
                    text-decoration: ${this.todo.completed ? 'line-through' : 'none'};
                    opacity: ${this.todo.completed ? '0.6' : '1'};
                }
                .delete-btn {
                    padding: 0.5rem;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    background: transparent;
                    color: #ef4444;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .delete-btn:hover {
                    background: #fee2e2;
                }
                .checkbox {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    accent-color: #3b82f6;
                }
                .date {
                    font-size: 0.875rem;
                    color: #64748b;
                    margin-right: 1rem;
                }
                .delete-icon {
                    width: 20px;
                    height: 20px;
                    stroke: currentColor;
                    stroke-width: 2;
                    fill: none;
                }
            </style>
            <div class="todo-item">
                <input type="checkbox" 
                       class="checkbox"
                       ${this.todo.completed ? 'checked' : ''}>
                <span class="todo-text">${this.todo.text}</span>
                <span class="date">${new Date(this.todo.createdAt).toLocaleDateString()}</span>
                <button class="delete-btn" title="Delete task">
                    <svg class="delete-icon" viewBox="0 0 24 24">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `;

        // Add event listeners
        const checkbox = this.shadowRoot.querySelector('.checkbox');
        const deleteButton = this.shadowRoot.querySelector('.delete-btn');

        checkbox?.addEventListener('change', this.handleToggle.bind(this));
        deleteButton?.addEventListener('click', this.handleDelete.bind(this));
    }

    private handleToggle(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        this.dispatchEvent(new CustomEvent('toggle', {
            detail: { id: this.todo.id, completed: checkbox.checked }
        }));
    }

    private handleDelete() {
        this.dispatchEvent(new CustomEvent('delete', {
            detail: { id: this.todo.id }
        }));
    }
}

customElements.define('todo-item', TodoItem); 