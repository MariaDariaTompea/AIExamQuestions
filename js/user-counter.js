// Firebase configuration is loaded from config.js
// Initialize Firebase with error handling
let database;

// Fallback configuration for development (remove in production)
const fallbackConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.region.firebasedatabase.app",
    projectId: "your-project-id",
    storageBucket: "your-project.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdefghijklmnop",
    measurementId: "G-XXXXXXXXXX"
};

function initializeFirebaseConnection() {
    try {
        let configToUse = window.firebaseConfig || fallbackConfig;
        
        if (!configToUse) {
            throw new Error('No Firebase configuration available');
        }
        
        firebase.initializeApp(configToUse);
        database = firebase.database();
        
        if (window.firebaseConfig) {
            console.log('✅ Firebase initialized with external config');
        } else {
            console.log('⚠️ Firebase initialized with fallback config (development mode)');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        return false;
    }
}

class UserCounter {
    constructor() {
        this.userId = this.generateUserId();
        this.isActive = true;
        this.heartbeatInterval = null;
        this.counterElement = document.getElementById('userCount');
        this.userInfo = {};
        
        this.init();
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async getUserInfo() {
        try {
            // Get IP address and location info
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            this.userInfo = {
                ip: data.ip || 'Unknown',
                country: data.country_name || 'Unknown',
                city: data.city || 'Unknown',
                region: data.region || 'Unknown',
                timezone: data.timezone || 'Unknown',
                userAgent: navigator.userAgent,
                language: navigator.language,
                screen: `${screen.width}x${screen.height}`,
                timestamp: new Date().toISOString()
            };

            // Log user info to console (server-side logging simulation)
            console.log('🔥 NEW USER CONNECTED:', {
                userId: this.userId,
                ip: this.userInfo.ip,
                location: `${this.userInfo.city}, ${this.userInfo.country}`,
                userAgent: this.userInfo.userAgent.substring(0, 100) + '...',
                timestamp: this.userInfo.timestamp
            });

        } catch (error) {
            console.log('Could not fetch IP info:', error);
            this.userInfo = {
                ip: 'Unknown',
                country: 'Unknown',
                city: 'Unknown',
                userAgent: navigator.userAgent,
                language: navigator.language,
                screen: `${screen.width}x${screen.height}`,
                timestamp: new Date().toISOString()
            };
        }
    }

    async init() {
        // Get user info including IP address
        await this.getUserInfo();
        
        // Add user to active users
        this.addUser();
        
        // Listen for changes in active users count
        this.listenForUserCount();
        
        // Start heartbeat to maintain presence
        this.startHeartbeat();
        
        // Handle page visibility changes
        this.handleVisibilityChange();
        
        // Remove user when page unloads
        this.handlePageUnload();
    }

    addUser() {
        const userRef = database.ref(`activeUsers/${this.userId}`);
        userRef.set({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            lastSeen: firebase.database.ServerValue.TIMESTAMP,
            userInfo: this.userInfo
        });
        
        // Also log to Firebase for admin viewing
        database.ref(`userLogs/${this.userId}`).set({
            ...this.userInfo,
            joinTime: firebase.database.ServerValue.TIMESTAMP,
            status: 'joined'
        });
        
        // Set up automatic removal when user disconnects
        userRef.onDisconnect().remove();
        
        // Set up disconnect logging
        database.ref(`userLogs/${this.userId}`).onDisconnect().update({
            leaveTime: firebase.database.ServerValue.TIMESTAMP,
            status: 'left'
        });
    }

    listenForUserCount() {
        const activeUsersRef = database.ref('activeUsers');
        
        activeUsersRef.on('value', (snapshot) => {
            const users = snapshot.val();
            const userCount = users ? Object.keys(users).length : 0;
            this.updateCounterDisplay(userCount);
            
            // Log current active users to console
            if (users) {
                console.log(`👥 ACTIVE USERS (${userCount}):`);
                Object.keys(users).forEach(userId => {
                    const user = users[userId];
                    if (user.userInfo) {
                        console.log(`  • ${user.userInfo.ip} - ${user.userInfo.city}, ${user.userInfo.country}`);
                    }
                });
                console.log('─'.repeat(50));
            }
        });
    }

    updateCounterDisplay(count) {
        if (this.counterElement) {
            this.counterElement.textContent = `• ${count}`;
            
            // Add a subtle animation when count changes
            this.counterElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.counterElement.style.transform = 'scale(1)';
            }, 200);
        }
    }

    startHeartbeat() {
        // Update timestamp every 30 seconds to show user is still active
        this.heartbeatInterval = setInterval(() => {
            if (this.isActive) {
                const userRef = database.ref(`activeUsers/${this.userId}`);
                userRef.update({
                    lastSeen: firebase.database.ServerValue.TIMESTAMP
                });
            }
        }, 30000);
    }

    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isActive = false;
                
                // Log user going inactive
                console.log('💤 USER WENT INACTIVE:', {
                    userId: this.userId,
                    ip: this.userInfo.ip,
                    location: `${this.userInfo.city}, ${this.userInfo.country}`,
                    timestamp: new Date().toISOString()
                });
                
                // Remove user when tab becomes hidden
                database.ref(`activeUsers/${this.userId}`).remove();
                
                // Update log
                database.ref(`userLogs/${this.userId}`).update({
                    leaveTime: firebase.database.ServerValue.TIMESTAMP,
                    status: 'inactive'
                });
            } else {
                this.isActive = true;
                
                // Log user becoming active again
                console.log('⚡ USER BECAME ACTIVE:', {
                    userId: this.userId,
                    ip: this.userInfo.ip,
                    location: `${this.userInfo.city}, ${this.userInfo.country}`,
                    timestamp: new Date().toISOString()
                });
                
                // Re-add user when tab becomes visible
                this.addUser();
            }
        });
    }

    handlePageUnload() {
        window.addEventListener('beforeunload', () => {
            // Log user disconnect
            console.log('🚪 USER DISCONNECTED:', {
                userId: this.userId,
                ip: this.userInfo.ip,
                location: `${this.userInfo.city}, ${this.userInfo.country}`,
                timestamp: new Date().toISOString()
            });
            
            // Remove user when page is about to unload
            database.ref(`activeUsers/${this.userId}`).remove();
            
            // Update log with leave time
            database.ref(`userLogs/${this.userId}`).update({
                leaveTime: firebase.database.ServerValue.TIMESTAMP,
                status: 'left'
            });
        });
    }

    cleanup() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        if (this.userId) {
            database.ref(`activeUsers/${this.userId}`).remove();
        }
    }
}

// Initialize user counter when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure all scripts are loaded
    setTimeout(() => {
        if (initializeFirebaseConnection()) {
            window.userCounter = new UserCounter();
        } else {
            console.error('❌ Cannot start user counter: Firebase initialization failed');
            console.log('📋 Make sure config.js exists and contains valid Firebase configuration');
        }
    }, 1000);
});

// Fallback: Clean up old users (older than 2 minutes)
setInterval(() => {
    const cutoffTime = Date.now() - (2 * 60 * 1000); // 2 minutes ago
    const activeUsersRef = database.ref('activeUsers');
    
    activeUsersRef.once('value', (snapshot) => {
        const users = snapshot.val();
        if (users) {
            Object.keys(users).forEach(userId => {
                const user = users[userId];
                if (user.lastSeen < cutoffTime) {
                    database.ref(`activeUsers/${userId}`).remove();
                }
            });
        }
    });
}, 60000); // Run every minute

// Clean up old user logs (older than 24 hours)
setInterval(() => {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    const userLogsRef = database.ref('userLogs');
    
    userLogsRef.once('value', (snapshot) => {
        const logs = snapshot.val();
        if (logs) {
            Object.keys(logs).forEach(userId => {
                const log = logs[userId];
                if (log.joinTime < cutoffTime) {
                    database.ref(`userLogs/${userId}`).remove();
                }
            });
        }
    });
}, 60 * 60 * 1000); // Run every hour 