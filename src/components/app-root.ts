export class AppRoot extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 20px;
                }
                h1 {
                    color: #333;
                    margin-bottom: 20px;
                }
            </style>
            <div>
                <h1>Welcome to Web Components Firebase App</h1>
                <p>This is your starting point. Add more components as needed!</p>
            </div>
        `;
    }
} 