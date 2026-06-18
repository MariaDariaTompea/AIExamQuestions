// Firebase Rankings System for AI Learning Platform

let rankingsDatabase = null;

// Initialize Firebase Rankings
function initializeRankings() {
    if (typeof firebase === 'undefined') {
        console.log('Firebase not available, rankings disabled');
        return;
    }
    
    try {
        // Try to get Firebase app instance
        const app = firebase.app();
        rankingsDatabase = firebase.database();
        console.log('Firebase Rankings initialized successfully');
        loadGlobalRankings();
    } catch (error) {
        console.log('Firebase Rankings initialization failed:', error);
        // Fallback to mock rankings for development
        rankingsDatabase = null;
    }
}

// Save session to global rankings
function saveToGlobalRankings(sessionData) {
    if (!rankingsDatabase) {
        console.log('Rankings database not available');
        return;
    }
    
    const userName = localStorage.getItem('aiQuizUserName');
    if (!userName) {
        console.log('No username found, skipping global rankings');
        return;
    }
    
    try {
        const rankingEntry = {
            userName: userName,
            overallScore: sessionData.overallScore,
            accuracy: Math.round(sessionData.accuracy * 10) / 10, // Round to 1 decimal
            questionsAnswered: sessionData.questionsAnswered,
            totalQuestions: sessionData.totalQuestions,
            duration: sessionData.duration,
            timePerQuestion: Math.round(sessionData.timePerQuestion * 10) / 10,
            timestamp: Date.now(),
            date: new Date().toISOString(),
            completed: sessionData.completed
        };
        
        // Push to rankings node
        rankingsDatabase.ref('rankings').push(rankingEntry)
            .then(() => {
                console.log('Session saved to global rankings successfully');
                // Refresh rankings display
                setTimeout(loadGlobalRankings, 1000);
            })
            .catch((error) => {
                console.error('Error saving to global rankings:', error);
            });
            
    } catch (error) {
        console.error('Error in saveToGlobalRankings:', error);
    }
}

// Load and display global rankings
function loadGlobalRankings() {
    if (!rankingsDatabase) {
        displayMockRankings();
        return;
    }
    
    try {
        rankingsDatabase.ref('rankings')
            .orderByChild('timestamp')
            .limitToLast(50) // Get last 50 entries
            .once('value')
            .then((snapshot) => {
                const rankings = [];
                snapshot.forEach((childSnapshot) => {
                    rankings.push(childSnapshot.val());
                });
                
                // Reverse to get newest first, then sort by current filter
                rankings.reverse();
                displayRankings(rankings, currentRankingsFilter);
            })
            .catch((error) => {
                console.error('Error loading rankings:', error);
                displayMockRankings();
            });
    } catch (error) {
        console.error('Error in loadGlobalRankings:', error);
        displayMockRankings();
    }
}

// Display rankings with current filter
function displayRankings(rankings, sortBy = 'overallScore') {
    const rankingsContainer = document.getElementById('globalRankings');
    if (!rankingsContainer) return;
    
    // Filter to only include users who completed ALL questions
    const completedTestsOnly = rankings.filter(entry => {
        return entry.questionsAnswered === entry.totalQuestions && entry.totalQuestions > 0;
    });
    
    // Group by user and get their best score (from completed tests only)
    const userBestScores = new Map();
    
    completedTestsOnly.forEach(entry => {
        const existing = userBestScores.get(entry.userName);
        if (!existing || entry[sortBy] > existing[sortBy]) {
            userBestScores.set(entry.userName, entry);
        }
    });
    
    // Convert to array and sort
    const sortedRankings = Array.from(userBestScores.values())
        .sort((a, b) => b[sortBy] - a[sortBy])
        .slice(0, 10); // Top 10
    
    let rankingsHTML = `
        <div class="rankings-header">
            <h3>🏆 Global Rankings</h3>
            <div class="ranking-filters">
                <button onclick="updateRankingsFilter('overallScore')" class="filter-btn ${sortBy === 'overallScore' ? 'active' : ''}">
                    Overall Score
                </button>
                <button onclick="updateRankingsFilter('accuracy')" class="filter-btn ${sortBy === 'accuracy' ? 'active' : ''}">
                    Accuracy
                </button>
            </div>
        </div>
        <div class="rankings-list">
    `;
    
    if (sortedRankings.length === 0) {
        rankingsHTML += `
            <div class="no-rankings">
                <p>🎯 No complete assessments yet. Be the first to finish all ${rankings.length > 0 ? rankings[0].totalQuestions || 129 : 129} questions!</p>
            </div>
        `;
    } else {
        sortedRankings.forEach((entry, index) => {
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            const isCurrentUser = entry.userName === localStorage.getItem('aiQuizUserName');
            
            rankingsHTML += `
                <div class="ranking-item ${isCurrentUser ? 'current-user' : ''}">
                    <div class="rank-position">${medal}</div>
                    <div class="rank-info">
                        <div class="rank-name">${entry.userName} ${isCurrentUser ? '(You)' : ''}</div>
                        <div class="rank-stats">
                            ${entry.questionsAnswered}/${entry.totalQuestions} questions
                            • ${Math.floor(entry.duration / 60)}:${(entry.duration % 60).toString().padStart(2, '0')}
                        </div>
                    </div>
                    <div class="rank-scores">
                        <div class="primary-score">${sortBy === 'overallScore' ? entry.overallScore : entry.accuracy.toFixed(1) + '%'}</div>
                        <div class="secondary-score">${sortBy === 'overallScore' ? entry.accuracy.toFixed(1) + '% accuracy' : entry.overallScore + '/100 overall'}</div>
                    </div>
                </div>
            `;
        });
    }
    
    rankingsHTML += '</div>';
    rankingsContainer.innerHTML = rankingsHTML;
}

// Mock rankings for development/fallback
function displayMockRankings() {
    const mockData = [
        { userName: 'Alex Chen', overallScore: 94, accuracy: 92.5, questionsAnswered: 40, totalQuestions: 40, duration: 1200 },
        { userName: 'Sarah Kim', overallScore: 89, accuracy: 95.0, questionsAnswered: 35, totalQuestions: 35, duration: 1800 },
        { userName: 'Mike Johnson', overallScore: 87, accuracy: 88.6, questionsAnswered: 42, totalQuestions: 42, duration: 1350 },
        { userName: 'Lisa Wang', overallScore: 85, accuracy: 91.2, questionsAnswered: 38, totalQuestions: 38, duration: 1950 },
        { userName: 'David Brown', overallScore: 83, accuracy: 86.7, questionsAnswered: 30, totalQuestions: 30, duration: 1100 }
    ];
    
    displayRankings(mockData, currentRankingsFilter);
}

// Update rankings filter
let currentRankingsFilter = 'overallScore';

function updateRankingsFilter(filterType) {
    currentRankingsFilter = filterType;
    loadGlobalRankings();
}

// User settings management
function showUserSettings() {
    // Check if user has admin access
    if (typeof window.userIP !== 'undefined' && window.userIP !== '188.24.53.198') {
        console.log('🚫 Settings access denied for IP:', window.userIP);
        notificationManager.error('Settings access is restricted');
        return;
    }
    
    const currentName = localStorage.getItem('aiQuizUserName');
    
    // Show dashboard view first
    DOMUtils.showView('dashboard');
    
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) {
        console.error('dashboard element not found');
        return;
    }
    
    dashboard.innerHTML = `
        <div class="quiz-container">
            <div class="user-settings-dialog">
                <h2>⚙️ User Settings</h2>
                <p>Manage your profile and ranking preferences.</p>
                
                <div class="setting-group">
                    <label for="userNameEdit">Display Name:</label>
                    <input 
                        type="text" 
                        id="userNameEdit" 
                        value="${currentName || ''}"
                        placeholder="Enter your name or nickname"
                        maxlength="20"
                        autocomplete="off"
                    />
                    <div class="name-requirements">
                        <small>• 2-20 characters • Letters, numbers, spaces allowed</small>
                    </div>
                </div>
                
                <div class="dialog-actions">
                    <button onclick="updateUserName()" class="btn-primary" id="updateNameBtn">
                        Update Name
                    </button>
                    <button onclick="clearUserData()" class="btn-danger">
                        Clear All Data
                    </button>
                    <button onclick="showDashboard()" class="btn-secondary">
                        Back to Dashboard
                    </button>
                </div>
                
                <div class="privacy-note">
                    <small>🔒 Your name is only used for rankings display</small>
                </div>
            </div>
        </div>
    `;
    
    // Add input validation
    const nameInput = document.getElementById('userNameEdit');
    nameInput.addEventListener('input', () => {
        const updateBtn = document.getElementById('updateNameBtn');
        const name = nameInput.value.trim();
        const isValid = name.length >= 2 && name.length <= 20 && /^[a-zA-Z0-9\s]+$/.test(name);
        
        updateBtn.disabled = !isValid;
        updateBtn.style.opacity = isValid ? '1' : '0.5';
    });
}

function updateUserName() {
    const nameInput = document.getElementById('userNameEdit');
    const name = nameInput.value.trim();
    
    if (name.length < 2 || name.length > 20 || !/^[a-zA-Z0-9\s]+$/.test(name)) {
        notificationManager.error('Please enter a valid name (2-20 characters, letters and numbers only)');
        return;
    }
    
    localStorage.setItem('aiQuizUserName', name);
    notificationManager.success(`Name updated to: ${name}`);
    showDashboard();
}

function clearUserData() {
    if (confirm('Are you sure you want to clear all your local data? This will remove your name and local session history (but not global rankings).')) {
        localStorage.removeItem('aiQuizUserName');
        localStorage.removeItem('ai-quiz-sessions');
        notificationManager.info('Local data cleared successfully');
        showDashboard();
    }
}

// Export functions to window
window.saveToGlobalRankings = saveToGlobalRankings;
window.loadGlobalRankings = loadGlobalRankings;
window.updateRankingsFilter = updateRankingsFilter;
window.showUserSettings = showUserSettings;
window.updateUserName = updateUserName;
window.clearUserData = clearUserData;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure Firebase is loaded
    setTimeout(initializeRankings, 1000);
}); 