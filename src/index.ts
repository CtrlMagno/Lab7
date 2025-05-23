import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import './components/app-root';
import './components/todo-list';
import './components/todo-item';
import './components/login-form';
import { AuthService } from './services/auth-service';

const firebaseConfig = {
  apiKey: "AIzaSyDkD67hOcuNVecjnyi3PMM2gp9zmKx6c2I",
  authDomain: "lab-7-78387.firebaseapp.com",
  projectId: "lab-7-78387",
  storageBucket: "lab-7-78387.firebasestorage.app",
  messagingSenderId: "528066358958",
  appId: "1:528066358958:web:bab2d22dd9d2caa93ac73f",
  measurementId: "G-5VDLJXMXT3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Register custom elements
customElements.define('app-root', class extends HTMLElement {
    private authService: AuthService;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.authService = new AuthService();
    }

    connectedCallback() {
        this.render();
        this.setupAuthListener();
    }

    private setupAuthListener() {
        this.authService.onAuthStateChanged((user) => {
            this.render();
        });
    }

    private async handleSignOut() {
        try {
            await this.authService.signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    render() {
        if (!this.shadowRoot) return;

        const user = this.authService.getCurrentUser();

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    min-height: 100vh;
                    background: #f0f2f5;
                    font-family: Arial, sans-serif;
                }
                .header {
                    background: white;
                    padding: 1rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .sign-out-btn {
                    padding: 8px 16px;
                    background: #ff4444;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .sign-out-btn:hover {
                    background: #cc0000;
                }
            </style>
            ${user ? `
                <div class="header">
                    <div class="user-info">
                        <span>Welcome, ${user.email}</span>
                    </div>
                    <button class="sign-out-btn" id="signOutBtn">Sign Out</button>
                </div>
                <todo-list></todo-list>
            ` : `
                <login-form></login-form>
            `}
        `;

        // Add event listener for sign out button
        const signOutBtn = this.shadowRoot.getElementById('signOutBtn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => this.handleSignOut());
        }
    }
});