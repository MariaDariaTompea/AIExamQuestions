// Utility Functions for AI Learning Platform

// Session Management
class SessionManager {
    constructor() {
        this.storageKey = 'ai-quiz-sessions';
    }

    saveSession(sessionData) {
        const sessions = this.getSessions();
        sessions.push({
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...sessionData
        });
        localStorage.setItem(this.storageKey, JSON.stringify(sessions));
    }

    getSessions() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch {
            return [];
        }
    }

    clearSessions() {
        localStorage.removeItem(this.storageKey);
    }

    getLastSession() {
        const sessions = this.getSessions();
        return sessions.length > 0 ? sessions[sessions.length - 1] : null;
    }
}

// Notification System
class NotificationManager {
    constructor() {
        this.notificationElement = document.getElementById('notification');
    }

    show(message, type = 'info', duration = 3000) {
        if (!this.notificationElement) return;
        
        this.notificationElement.textContent = message;
        this.notificationElement.className = `notification ${type} show`;
        
        setTimeout(() => {
            this.notificationElement.classList.remove('show');
        }, duration);
    }

    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }

    error(message, duration = 3000) {
        this.show(message, 'error', duration);
    }
}

// Quiz Utilities
class QuizUtils {
    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    static parseCorrectAnswers(correctString) {
        return correctString.split('').map(letter => letter.charCodeAt(0) - 97);
    }

    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    static formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static calculatePercentage(correct, total) {
        return Math.round((correct / total) * 100);
    }

    static getPerformanceMessage(percentage) {
        if (percentage >= 90) {
            return "Outstanding! You have mastered these AI concepts.";
        } else if (percentage >= 80) {
            return "Excellent work! You have a strong understanding of the material.";
        } else if (percentage >= 70) {
            return "Good job! You're on the right track with these concepts.";
        } else if (percentage >= 60) {
            return "Fair performance. Consider reviewing the learning modules.";
        } else {
            return "More study needed. Please review the learning materials thoroughly.";
        }
    }

    static getLetterFromIndex(index) {
        return String.fromCharCode(97 + index); // 'a', 'b', 'c', 'd'
    }
}

// DOM Utilities
class DOMUtils {
    static show(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('hidden');
        }
    }

    static hide(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('hidden');
        }
    }

    static setText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    static setHTML(elementId, html) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    }

    static addClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(className);
        }
    }

    static removeClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove(className);
        }
    }

    static showView(viewId) {
        // Hide all views
        const views = document.querySelectorAll('.view');
        views.forEach(view => view.classList.add('hidden'));
        
        // Show target view
        this.show(viewId);
    }
}

// Animation Utilities
class AnimationUtils {
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }

    static slideIn(element, direction = 'left', duration = 300) {
        const transforms = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            up: 'translateY(-100%)',
            down: 'translateY(100%)'
        };
        
        element.style.transform = transforms[direction];
        element.style.opacity = '0';
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.transition = `all ${duration}ms ease-out`;
            element.style.transform = 'translate(0, 0)';
            element.style.opacity = '1';
        }, 10);
    }
}

// Data Validation
class ValidationUtils {
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidScore(score, maxScore) {
        return typeof score === 'number' && score >= 0 && score <= maxScore;
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.replace(/[<>\"'&]/g, '');
    }
}

// Export utilities for global use
window.SessionManager = SessionManager;
window.NotificationManager = NotificationManager;
window.QuizUtils = QuizUtils;
window.DOMUtils = DOMUtils;
window.AnimationUtils = AnimationUtils;
window.ValidationUtils = ValidationUtils; 