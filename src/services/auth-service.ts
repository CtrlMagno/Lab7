import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';

export class AuthService {
    private auth;

    constructor() {
        this.auth = getAuth();
    }

    async signIn(email: string, password: string): Promise<User> {
        try {
            // Validate email format
            if (!this.isValidEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            // Validate password
            if (!password || password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    async signUp(email: string, password: string): Promise<User> {
        try {
            // Validate email format
            if (!this.isValidEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            // Validate password strength
            if (!this.isStrongPassword(password)) {
                throw new Error('Password must be at least 6 characters long and contain a mix of letters, numbers, and special characters');
            }

            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    async signOut(): Promise<void> {
        try {
            await signOut(this.auth);
        } catch (error: any) {
            throw new Error('Failed to sign out. Please try again.');
        }
    }

    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        return onAuthStateChanged(this.auth, callback);
    }

    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isStrongPassword(password: string): boolean {
        // At least 6 characters, contains letters and numbers
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
        return passwordRegex.test(password);
    }

    private getErrorMessage(errorCode: string): string {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Please enter a valid email address';
            case 'auth/user-disabled':
                return 'This account has been disabled. Please contact support.';
            case 'auth/user-not-found':
                return 'No account found with this email. Please check your email or sign up.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/email-already-in-use':
                return 'An account already exists with this email. Please sign in instead.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters and contain a mix of letters and numbers.';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your internet connection.';
            case 'auth/operation-not-allowed':
                return 'This operation is not allowed. Please contact support.';
            case 'auth/account-exists-with-different-credential':
                return 'An account already exists with the same email address but different sign-in credentials.';
            default:
                return 'An error occurred during authentication. Please try again.';
        }
    }
} 