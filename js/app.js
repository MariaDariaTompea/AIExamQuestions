// Main Application Logic for AI Learning Platform

// Global variables
let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let selectedAnswers = [];
let sessionStartTime = null;
let sessionManager = null;
let notificationManager = null;
let incorrectQuestions = [];
let currentQuestions = [];
let isReviewMode = false;
let timerInterval = null;

// IP-based access control
let userIP = 'Unknown';
const ADMIN_IP = '188.24.53.198'; // Only this IP can see settings

// Initialize IP detection
async function detectUserIP() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        userIP = data.ip || 'Unknown';
        console.log('🌐 User IP detected:', userIP);
        
        // Hide/show settings based on IP
        updateUIBasedOnPermissions();
    } catch (error) {
        console.log('Could not detect IP:', error);
        userIP = 'Unknown';
        updateUIBasedOnPermissions();
    }
}

// Update UI based on user permissions
function updateUIBasedOnPermissions() {
    const isAdmin = userIP === ADMIN_IP;
    console.log('👮 Admin access:', isAdmin ? 'GRANTED' : 'DENIED');
    
    // Make userIP available globally for other modules
    window.userIP = userIP;
    
    // Find settings button and hide/show based on IP
    const settingsButton = document.querySelector('button[onclick="showUserSettings()"]');
    if (settingsButton) {
        if (isAdmin) {
            settingsButton.style.display = 'inline-block';
            settingsButton.style.visibility = 'visible';
        } else {
            settingsButton.style.display = 'none';
            settingsButton.style.visibility = 'hidden';
        }
    }
    
    // Update rankings card description based on permissions
    const rankingsCard = document.querySelector('.dashboard-card.rankings');
    if (rankingsCard) {
        const cardText = rankingsCard.querySelector('p');
        if (cardText) {
            if (isAdmin) {
                cardText.textContent = 'See how you rank against other learners worldwide';
            } else {
                cardText.textContent = 'See how you rank against other learners worldwide';
            }
        }
    }
}

// Timer Functions
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - sessionStartTime) / 1000);
        updateTimerDisplay(elapsedTime);
    }, 1000);
    
    // Update immediately
    updateTimerDisplay(0);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    
    const timerElement = document.getElementById('elapsedTimer');
    if (timerElement) {
        timerElement.textContent = timeString;
    }
}

function calculateOverallScore(accuracy, totalTimeSeconds, questionsAnswered) {
    // Constants for the scoring algorithm
    const BASELINE_TIME_PER_QUESTION = 45; // 45 seconds per question baseline
    const ACCURACY_WEIGHT = 0.7; // 70% weight for accuracy
    const SPEED_WEIGHT = 0.3; // 30% weight for speed
    
    // Calculate time per question
    const timePerQuestion = totalTimeSeconds / questionsAnswered;
    
    // Calculate speed score (higher is better)
    // If you answer faster than baseline, you get bonus points
    // If you answer slower, you get penalty
    let speedFactor = BASELINE_TIME_PER_QUESTION / timePerQuestion;
    
    // Cap the speed factor to prevent extreme scores
    speedFactor = Math.min(speedFactor, 2.0); // Maximum 2x bonus for speed
    speedFactor = Math.max(speedFactor, 0.2); // Minimum 0.2x for very slow answers
    
    // Calculate speed score (0-100 scale)
    const speedScore = speedFactor * 100;
    
    // Calculate weighted overall score
    const overallScore = (accuracy * ACCURACY_WEIGHT) + (speedScore * SPEED_WEIGHT);
    
    // Cap at 100 and ensure minimum of 0
    return Math.min(Math.max(Math.round(overallScore), 0), 100);
}

function getPerformanceGrade(overallScore) {
    if (overallScore >= 90) return { grade: 'A+', color: '#16a34a', message: 'Outstanding Performance!' };
    if (overallScore >= 80) return { grade: 'A', color: '#16a34a', message: 'Excellent Work!' };
    if (overallScore >= 70) return { grade: 'B+', color: '#059669', message: 'Great Performance!' };
    if (overallScore >= 60) return { grade: 'B', color: '#0891b2', message: 'Good Work!' };
    if (overallScore >= 50) return { grade: 'C', color: '#ea580c', message: 'Fair Performance' };
    return { grade: 'D', color: '#dc2626', message: 'Needs Improvement' };
}

function getSpeedRating(timePerQuestion) {
    if (timePerQuestion <= 20) return { rating: 'Lightning Fast', icon: '⚡', color: '#16a34a' };
    if (timePerQuestion <= 30) return { rating: 'Very Fast', icon: '🚀', color: '#16a34a' };
    if (timePerQuestion <= 45) return { rating: 'Good Pace', icon: '✅', color: '#059669' };
    if (timePerQuestion <= 60) return { rating: 'Steady', icon: '🎯', color: '#0891b2' };
    if (timePerQuestion <= 90) return { rating: 'Thoughtful', icon: '🤔', color: '#ea580c' };
    return { rating: 'Deliberate', icon: '🐌', color: '#dc2626' };
}

// Initialize application
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded - Initializing app...');

    try {
        sessionManager = new SessionManager();
        notificationManager = new NotificationManager();

        // Initialize learning content
        initializeLearning();

        // Load session history
        loadSessionHistory();

        // Update dashboard review card
        updateDashboardReviewCard();

        notificationManager.info('Welcome to the AI Learning Platform!');
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});

// Navigation Functions
function showDashboard() {
    console.log('showDashboard called');
    
    // Stop timer if running
    stopTimer();
    
    // Restore dashboard content if it was replaced
    restoreDashboard();
    
    DOMUtils.showView('dashboard');
    loadSessionHistory();
    updateDashboardReviewCard();
}

function restoreDashboard() {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;
    
    // Check if dashboard has been replaced (no dashboard-grid element)
    if (!dashboard.querySelector('.dashboard-grid')) {
        dashboard.innerHTML = `
            <div class="header">
                <div class="live-users">
                    <span class="users-count" id="userCount">• 0</span>
                    <span class="users-label">users practicing</span>
                </div>
                <h1 class="title">AI Learning Platform</h1>
                <p class="subtitle">Master artificial intelligence concepts through structured learning and assessment</p>
            </div>
            
            <div class="dashboard-grid">
                <div class="dashboard-card primary" onclick="showLearning()">
                    <div class="card-icon">📚</div>
                    <h3>Learning Modules</h3>
                    <p>Study AI concepts with guided explanations</p>
                    <button class="card-btn">Start Learning</button>
                </div>
                
                <div class="dashboard-card secondary" onclick="startNewSession()">
                    <div class="card-icon">🎯</div>
                    <h3>New Assessment</h3>
                    <p>Test your knowledge with comprehensive questions</p>
                    <button class="card-btn">Take Test</button>
                </div>
                
                <div class="dashboard-card quaternary" onclick="startReviewSession()" id="reviewCard">
                    <div class="card-icon">🔄</div>
                    <h3>Review Missed Questions</h3>
                    <p>Practice questions you got wrong in your last session</p>
                    <button class="card-btn">Start Review</button>
                </div>
                
                <div class="dashboard-card tertiary" onclick="showHistory()">
                    <div class="card-icon">📊</div>
                    <h3>Session History</h3>
                    <p>Review your progress and past performance</p>
                    <button class="card-btn">View History</button>
                </div>
                
                <div class="dashboard-card rankings">
                    <div class="card-icon">🏆</div>
                    <h3>Global Rankings</h3>
                    <p>See how you rank against other learners worldwide</p>
                    <button onclick="showUserSettings()" class="card-btn secondary">Settings</button>
                </div>
            </div>

            <!-- Global Rankings Section -->
            <div id="globalRankings" class="global-rankings-section">
                <!-- Rankings will be loaded here by JavaScript -->
            </div>
            
            <div id="history-section" class="history-section hidden">
                <h2>Assessment History</h2>
                <div id="history-list" class="history-list"></div>
                <button class="back-btn" onclick="hideHistory()">Back to Dashboard</button>
            </div>
        `;
        
        // Need to reload rankings after restoring dashboard
        setTimeout(() => {
            if (window.loadGlobalRankings) {
                loadGlobalRankings();
            }
        }, 100);
    }
}

function updateDashboardReviewCard() {
    const lastSession = sessionManager.getLastSession();
    const reviewCard = document.getElementById('reviewCard');

    if (lastSession && lastSession.incorrectQuestions && lastSession.incorrectQuestions.length > 0) {
        reviewCard.style.display = 'block';
        reviewCard.style.opacity = '1';
        const questionText = reviewCard.querySelector('p');
        questionText.textContent = `Practice ${lastSession.incorrectQuestions.length} questions you got wrong in your last session`;
    } else {
        reviewCard.style.opacity = '0.5';
        reviewCard.style.cursor = 'not-allowed';
        const questionText = reviewCard.querySelector('p');
        questionText.textContent = 'No incorrect questions to review yet. Take an assessment first!';
    }
}

function showLearning() {
    console.log('showLearning called');
    DOMUtils.showView('learning');
    initializeLearning();
}

function startNewSession() {
    // Check if user has entered a name for rankings
    const savedUserName = localStorage.getItem('aiQuizUserName');
    
    if (!savedUserName) {
        showUserNameDialog();
        return;
    }
    
    beginSession();
}

function showUserNameDialog() {
    // Show dashboard view first
    DOMUtils.showView('dashboard');
    
    const dashboard = document.getElementById('dashboard');
    dashboard.innerHTML = `
        <div class="quiz-container">
            <div class="user-name-dialog">
                <h2>🏆 Join the Global Rankings!</h2>
                <p>Enter your name or nickname to compete with other learners worldwide.</p>
                
                <div class="name-input-section">
                    <input 
                        type="text" 
                        id="userNameInput" 
                        placeholder="Enter your name or nickname"
                        maxlength="20"
                        autocomplete="off"
                    />
                    <div class="name-requirements">
                        <small>• 2-20 characters • Letters, numbers, spaces allowed</small>
                    </div>
                </div>
                
                <div class="dialog-actions">
                    <button onclick="saveUserNameAndStart()" class="btn-primary" id="confirmNameBtn">
                        Start Assessment
                    </button>
                    <button onclick="showDashboard()" class="btn-secondary">
                        Back to Dashboard
                    </button>
                </div>
                
                <div class="privacy-note">
                    <small>🔒 Your name will be visible in global rankings with your scores</small>
                </div>
            </div>
        </div>
    `;
    
    // Focus on input and add enter key listener
    const nameInput = document.getElementById('userNameInput');
    nameInput.focus();
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveUserNameAndStart();
        }
    });
    
    nameInput.addEventListener('input', validateNameInput);
}

function validateNameInput() {
    const nameInput = document.getElementById('userNameInput');
    const confirmBtn = document.getElementById('confirmNameBtn');
    const name = nameInput.value.trim();
    
    const isValid = name.length >= 2 && name.length <= 20 && /^[a-zA-Z0-9\s]+$/.test(name);
    
    confirmBtn.disabled = !isValid;
    confirmBtn.style.opacity = isValid ? '1' : '0.5';
    confirmBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
}

function saveUserNameAndStart() {
    const nameInput = document.getElementById('userNameInput');
    const name = nameInput.value.trim();
    
    if (name.length < 2 || name.length > 20 || !/^[a-zA-Z0-9\s]+$/.test(name)) {
        notificationManager.error('Please enter a valid name (2-20 characters, letters and numbers only)');
        return;
    }
    
    localStorage.setItem('aiQuizUserName', name);
    notificationManager.success(`Welcome, ${name}! Starting your assessment...`);
    
    beginSession();
}

function beginSession() {
    // Reset quiz state
    currentQuestion = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    selectedAnswers = [];
    incorrectQuestions = [];
    sessionStartTime = Date.now();
    isReviewMode = false;

    // Load all questions
    currentQuestions = QuizUtils.shuffleArray([...window.questions]);

    // Show quiz view
    DOMUtils.showView('quiz');

    // Set session time
    DOMUtils.setText('sessionTime', new Date().toLocaleTimeString());

    // Start timer
    startTimer();

    // Start quiz
    displayQuestion();
    updateStats();
    notificationManager.success('Assessment started! Good luck!');
}

function startReviewSession() {
    const lastSession = sessionManager.getLastSession();

    if (!lastSession || !lastSession.incorrectQuestions || lastSession.incorrectQuestions.length === 0) {
        notificationManager.error('No incorrect questions to review from your last session.');
        return;
    }

    // Reset quiz state
    currentQuestion = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    selectedAnswers = [];
    incorrectQuestions = [];
    sessionStartTime = Date.now();
    isReviewMode = true;

    // Load only incorrect questions from last session
    currentQuestions = [...lastSession.incorrectQuestions];

    // Show quiz view
    DOMUtils.showView('quiz');

    // Set session time
    DOMUtils.setText('sessionTime', new Date().toLocaleTimeString());

    // Start timer
    startTimer();

    // Start quiz
    displayQuestion();
    updateStats();
    notificationManager.success(`Review mode started! Practicing ${currentQuestions.length} questions you missed.`);
}

function showHistory() {
    console.log('showHistory called');
    const historySection = document.getElementById('history-section');
    historySection.classList.remove('hidden');
    loadSessionHistory();
}

function hideHistory() {
    const historySection = document.getElementById('history-section');
    historySection.classList.add('hidden');
}

// Learning Module Functions
function initializeLearning() {
    const topics = [
        { key: 'neural-networks', title: 'Neural Networks & Perceptrons' },
        { key: 'machine-learning', title: 'Machine Learning Fundamentals' },
        { key: 'decision-trees', title: 'Decision Trees' },
        { key: 'tensors-data', title: 'Tensors & Data Structures' },
        { key: 'activation-functions', title: 'Activation Functions' },
        { key: 'optimization', title: 'Optimization & Training' },
        { key: 'deep-learning', title: 'Deep Learning & CNNs' }
    ];

    const tabsContainer = document.getElementById('topicTabs');
    const contentContainer = document.getElementById('learningContent');

    // Create topic tabs
    tabsContainer.innerHTML = '';
    topics.forEach((topic, index) => {
        const tab = document.createElement('div');
        tab.className = `topic-tab ${index === 0 ? 'active' : ''}`;
        tab.textContent = topic.title;
        tab.onclick = () => showTopicContent(topic.key, tab);
        tabsContainer.appendChild(tab);
    });

    // Show first topic by default
    showTopicContent(topics[0].key);
}

function showTopicContent(topicKey, clickedTab = null) {
    // Update active tab
    if (clickedTab) {
        document.querySelectorAll('.topic-tab').forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');
    }

    // Get content based on topic
    const content = getTopicContentHTML(topicKey);
    DOMUtils.setHTML('learningContent', content);
}

function getTopicContentHTML(topicKey) {
    const topics = {
        'neural-networks': `
            <div class="topic-card">
                <h2>Neural Networks & Perceptrons</h2>
                
                <h3>What is a Perceptron?</h3>
                <p>A perceptron is the simplest form of artificial neural network, consisting of a single neuron that makes binary decisions. It takes multiple inputs, applies weights, and produces a single binary output.</p>
                
                <div class="concept-box">
                    <h4>Key Components of a Perceptron</h4>
                    <ul>
                        <li><strong>Inputs (x₁, x₂, ..., xₙ):</strong> The features or data points</li>
                        <li><strong>Weights (w₁, w₂, ..., wₙ):</strong> Learned parameters that determine importance</li>
                        <li><strong>Bias (b):</strong> An additional parameter that shifts the decision boundary</li>
                        <li><strong>Activation Function:</strong> Determines the output based on the weighted sum</li>
                    </ul>
                </div>

                <h3>How Does a Perceptron Work?</h3>
                <p>The perceptron computes a weighted sum of inputs plus bias, then applies an activation function:</p>
                <p><strong>Output = f(w₁x₁ + w₂x₂ + ... + wₙxₙ + b)</strong></p>
                
                <div class="example-box">
                    <h4>Simple Example</h4>
                    <p>For a perceptron with 2 inputs [1, 0] and weights [0.5, -0.3] with bias 0.1:</p>
                    <p>Sum = (0.5 × 1) + (-0.3 × 0) + 0.1 = 0.6</p>
                    <p>If using step function: Output = 1 (since 0.6 > 0)</p>
                </div>

                <h3>Perceptron Limitations</h3>
                <div class="warning-box">
                    <h4>The XOR Problem</h4>
                    <p>Single perceptrons can only solve linearly separable problems. They cannot solve XOR because it requires a non-linear decision boundary. This limitation led to the development of multi-layer neural networks.</p>
                </div>

                <h3>Overcoming Perceptron Limits</h3>
                <ul>
                    <li><strong>Multi-layer Networks:</strong> Adding hidden layers creates non-linear decision boundaries</li>
                    <li><strong>Non-linear Activation Functions:</strong> Using sigmoid, ReLU, or tanh instead of step functions</li>
                    <li><strong>Kernel Methods:</strong> Transform input space to make problems linearly separable</li>
                    <li><strong>More Neurons:</strong> Increase network capacity with additional neurons</li>
                </ul>

                <h3>Training Algorithms</h3>
                <h4>Perceptron Learning Rule</h4>
                <p>Updates weights based on individual training examples:</p>
                <p><strong>w_new = w_old + α(target - output) × input</strong></p>
                
                <h4>Delta Rule (Gradient Descent)</h4>
                <p>Updates weights based on the entire dataset using continuous error:</p>
                <p><strong>w_new = w_old - α × ∇E</strong></p>
                
                <div class="concept-box">
                    <h4>Key Differences</h4>
                    <ul>
                        <li><strong>Perceptron Rule:</strong> Updates on individual examples, uses binary output</li>
                        <li><strong>Delta Rule:</strong> Uses continuous output, considers all training data</li>
                        <li><strong>Both:</strong> Start with random weights and use learning rate (α)</li>
                    </ul>
                </div>
            </div>
        `,
        'machine-learning': `
            <div class="topic-card">
                <h2>Machine Learning Fundamentals</h2>
                
                <h3>What is Machine Learning?</h3>
                <p>Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.</p>
                
                <h3>Types of Problems ML Can Solve</h3>
                <div class="concept-box">
                    <h4>Supervised Learning Problems</h4>
                    <ul>
                        <li><strong>Classification:</strong> Predicting discrete categories (spam/not spam, image recognition)</li>
                        <li><strong>Regression:</strong> Predicting continuous values (house prices, stock prices)</li>
                        <li><strong>Planning:</strong> Sequential decision making (route optimization, game playing)</li>
                    </ul>
                </div>

                <h3>Learning Types</h3>
                
                <h4>Supervised Learning</h4>
                <p>Uses labeled training data with input-output pairs. The goal is to learn a mapping function from inputs to outputs.</p>
                <div class="example-box">
                    <h4>Example</h4>
                    <p>Training data: (house features → price), (email text → spam/not spam)</p>
                    <p>Goal: Predict price for new house or classify new email</p>
                </div>

                <h4>Unsupervised Learning</h4>
                <p>Finds patterns in data without labeled examples. No target outputs provided.</p>
                <ul>
                    <li><strong>Clustering:</strong> Grouping similar data points</li>
                    <li><strong>Dimensionality Reduction:</strong> Finding simpler representations</li>
                    <li><strong>Association Rules:</strong> Finding relationships between variables</li>
                </ul>

                <h3>ML Algorithm Objectives</h3>
                <p>Machine learning algorithms can represent their objectives in various ways:</p>
                <div class="concept-box">
                    <h4>Representation Types</h4>
                    <ul>
                        <li><strong>Numeric Functions:</strong> Mathematical formulas (linear regression: y = mx + b)</li>
                        <li><strong>Probabilistic Functions:</strong> Probability distributions (Naive Bayes)</li>
                        <li><strong>Symbolic Rules:</strong> If-then statements (decision trees)</li>
                        <li><strong>Tables:</strong> Lookup tables or decision matrices</li>
                    </ul>
                </div>

                <h3>Performance Evaluation</h3>
                
                <h4>Classification Metrics</h4>
                <ul>
                    <li><strong>Accuracy:</strong> Percentage of correct predictions</li>
                    <li><strong>Precision:</strong> True positives / (True positives + False positives)</li>
                    <li><strong>Recall:</strong> True positives / (True positives + False negatives)</li>
                    <li><strong>F1 Score:</strong> Harmonic mean of precision and recall</li>
                </ul>

                <div class="concept-box">
                    <h4>F1 Score Formula</h4>
                    <p><strong>F1 = 2 × (Precision × Recall) / (Precision + Recall)</strong></p>
                    <p>The harmonic mean gives equal weight to both precision and recall, providing a balanced measure of model performance.</p>
                </div>
            </div>
        `,
        'decision-trees': `
            <div class="topic-card">
                <h2>Decision Trees</h2>
                
                <h3>What are Decision Trees?</h3>
                <p>Decision trees are hierarchical models that make decisions by splitting data based on feature values. They create a tree-like structure of decision rules leading to predictions.</p>
                
                <div class="concept-box">
                    <h4>Tree Components</h4>
                    <ul>
                        <li><strong>Root Node:</strong> Starting point with entire dataset</li>
                        <li><strong>Internal Nodes:</strong> Decision points based on feature tests</li>
                        <li><strong>Leaves:</strong> Final predictions or class labels</li>
                        <li><strong>Branches:</strong> Connections representing decision outcomes</li>
                    </ul>
                </div>

                <h3>Building Decision Trees: The Induction Phase</h3>
                <p>The induction phase constructs the tree from training data using these steps:</p>
                
                <h4>1. Attribute Selection</h4>
                <p>Choose the best feature to split on at each node:</p>
                <ul>
                    <li><strong>Information Gain:</strong> Measures reduction in entropy</li>
                    <li><strong>Gini Index:</strong> Measures impurity reduction</li>
                    <li><strong>Gain Ratio:</strong> Information gain normalized by split info</li>
                    <li><strong>Random Selection:</strong> Sometimes used to reduce overfitting</li>
                </ul>

                <div class="concept-box">
                    <h4>Information Gain Ratio</h4>
                    <p><strong>Gain Ratio = Information Gain / Split Information</strong></p>
                    <p>This metric reduces bias toward attributes with many values by normalizing the information gain with the intrinsic information of the split.</p>
                </div>

                <h3>Advantages and Disadvantages</h3>
                
                <h4>Advantages</h4>
                <ul>
                    <li>Easy to understand and interpret</li>
                    <li>No need for data preprocessing</li>
                    <li>Handles both numerical and categorical data</li>
                    <li>Performs feature selection automatically</li>
                </ul>

                <h4>Disadvantages</h4>
                <ul>
                    <li>Prone to overfitting</li>
                    <li>Can be unstable (small data changes = different tree)</li>
                    <li>Biased toward features with many levels</li>
                    <li>Difficulty with linear relationships</li>
                </ul>
            </div>
        `,
        'tensors-data': `
            <div class="topic-card">
                <h2>Tensors & Data Structures</h2>
                
                <h3>What is a Tensor?</h3>
                <p>A tensor is a mathematical object that generalizes scalars, vectors, and matrices to an arbitrary number of dimensions (indices). It's the fundamental data structure in modern machine learning.</p>
                
                <div class="concept-box">
                    <h4>Tensor Hierarchy</h4>
                    <ul>
                        <li><strong>0D Tensor (Scalar):</strong> Single number (e.g., 5)</li>
                        <li><strong>1D Tensor (Vector):</strong> Array of numbers (e.g., [1, 2, 3])</li>
                        <li><strong>2D Tensor (Matrix):</strong> Table of numbers (e.g., [[1,2], [3,4]])</li>
                        <li><strong>3D Tensor:</strong> Cube of numbers (e.g., RGB image)</li>
                        <li><strong>nD Tensor:</strong> n-dimensional array</li>
                    </ul>
                </div>

                <h3>Tensors in Machine Learning</h3>
                
                <h4>Common Applications</h4>
                <ul>
                    <li><strong>Images:</strong> 3D tensors (height, width, channels)</li>
                    <li><strong>Videos:</strong> 4D tensors (time, height, width, channels)</li>
                    <li><strong>Text:</strong> 2D tensors (sequence length, vocabulary size)</li>
                    <li><strong>Batches:</strong> Add batch dimension to any tensor</li>
                </ul>

                <h4>Standardization (Z-score Normalization)</h4>
                <p>Transforms raw values into z-scores with mean 0 and standard deviation 1:</p>
                <p><strong>z = (x - μ) / σ</strong></p>
                
                <div class="example-box">
                    <h4>Why Standardize?</h4>
                    <ul>
                        <li>Ensures all features have similar scales</li>
                        <li>Prevents features with large values from dominating</li>
                        <li>Improves convergence in gradient-based algorithms</li>
                        <li>Required for many distance-based algorithms</li>
                    </ul>
                </div>
            </div>
        `,
        'activation-functions': `
            <div class="topic-card">
                <h2>Activation Functions</h2>
                
                <h3>What are Activation Functions?</h3>
                <p>Activation functions determine the output of a neural network node given input signals. They introduce non-linearity, enabling networks to learn complex patterns.</p>
                
                <h3>Common Activation Functions</h3>
                
                <h4>1. Sigmoid (Logistic)</h4>
                <p><strong>Formula:</strong> σ(x) = 1 / (1 + e^(-x))</p>
                <p><strong>Range:</strong> (0, 1)</p>
                
                <div class="concept-box">
                    <h4>Sigmoid Characteristics</h4>
                    <ul>
                        <li><strong>Pros:</strong> Smooth, differentiable, good for binary classification</li>
                        <li><strong>Cons:</strong> Vanishing gradient problem, not zero-centered</li>
                        <li><strong>Use case:</strong> Output layer for binary classification</li>
                    </ul>
                </div>

                <div class="warning-box">
                    <h4>Vanishing Gradient Problem</h4>
                    <p>Sigmoid function saturates (becomes flat) for large positive or negative inputs, causing gradients to become very small during backpropagation, especially in deep networks.</p>
                </div>

                <h4>2. ReLU (Rectified Linear Unit)</h4>
                <p><strong>Formula:</strong> ReLU(x) = max(0, x)</p>
                <p><strong>Range:</strong> [0, ∞)</p>
                
                <div class="warning-box">
                    <h4>Dying ReLU Problem</h4>
                    <p>When inputs are consistently negative, ReLU outputs 0 and its derivative is also 0. This means the neuron stops learning (gradients become 0), effectively "dying."</p>
                </div>

                <h4>3. Softmax</h4>
                <p><strong>Formula:</strong> softmax(x_i) = e^(x_i) / Σ(e^(x_j))</p>
                <p><strong>Range:</strong> (0, 1) with outputs summing to 1</p>
                
                <div class="concept-box">
                    <h4>Softmax Characteristics</h4>
                    <ul>
                        <li><strong>Purpose:</strong> Converts raw scores to probabilities</li>
                        <li><strong>Use case:</strong> Multi-class classification output layer</li>
                        <li><strong>Property:</strong> All outputs sum to 1.0</li>
                    </ul>
                </div>
            </div>
        `,
        'optimization': `
            <div class="topic-card">
                <h2>Optimization & Training Algorithms</h2>
                
                <h3>Gradient Descent</h3>
                <p>Gradient descent is the fundamental optimization algorithm for training neural networks. It iteratively adjusts parameters to minimize the loss function.</p>
                
                <div class="concept-box">
                    <h4>Gradient Descent Formula</h4>
                    <p><strong>θ_new = θ_old - α × ∇J(θ)</strong></p>
                    <ul>
                        <li><strong>θ:</strong> Parameters (weights and biases)</li>
                        <li><strong>α:</strong> Learning rate</li>
                        <li><strong>∇J(θ):</strong> Gradient of cost function</li>
                    </ul>
                </div>

                <h3>Backpropagation Algorithm</h3>
                <p>Backpropagation efficiently computes gradients in neural networks by applying the chain rule backward through the network.</p>
                
                <h4>Key Characteristics</h4>
                <ul>
                    <li><strong>Efficiency:</strong> Computes all gradients in one backward pass</li>
                    <li><strong>Chain Rule:</strong> Propagates errors through composite functions</li>
                    <li><strong>Local Minima:</strong> May get stuck in local optima</li>
                    <li><strong>Requires Derivatives:</strong> Activation functions must be differentiable</li>
                </ul>

                <h3>Evolutionary Algorithms</h3>
                
                <h4>Particle Swarm Optimization (PSO)</h4>
                <p>Inspired by bird flocking behavior, PSO optimizes by moving particles through the solution space.</p>
                
                <div class="concept-box">
                    <h4>PSO Velocity Update</h4>
                    <p><strong>v_new = w×v_old + c1×r1×(pbest - position) + c2×r2×(gbest - position)</strong></p>
                    <ul>
                        <li><strong>w:</strong> Inertia weight</li>
                        <li><strong>c1, c2:</strong> Acceleration coefficients</li>
                        <li><strong>pbest:</strong> Particle's best position</li>
                        <li><strong>gbest:</strong> Global best position</li>
                    </ul>
                </div>

                <h4>PSO vs GA Differences</h4>
                <div class="example-box">
                    <h4>Key Distinctions</h4>
                    <ul>
                        <li><strong>Memory:</strong> PSO particles remember their best positions; GA individuals don't</li>
                        <li><strong>Information Sharing:</strong> PSO shares global best; GA only through reproduction</li>
                        <li><strong>Solution Quality:</strong> PSO often converges faster to good solutions</li>
                        <li><strong>Diversity:</strong> GA maintains more diversity through mutation</li>
                    </ul>
                </div>
            </div>
        `,
        'deep-learning': `
            <div class="topic-card">
                <h2>Deep Learning & Convolutional Neural Networks</h2>
                
                <h3>What is Deep Learning?</h3>
                <p>Deep learning uses neural networks with multiple hidden layers (typically 3 or more) to learn hierarchical representations of data automatically.</p>
                
                <div class="concept-box">
                    <h4>Why "Deep" Networks?</h4>
                    <ul>
                        <li><strong>Hierarchical Learning:</strong> Each layer learns increasingly complex features</li>
                        <li><strong>Automatic Feature Extraction:</strong> No manual feature engineering needed</li>
                        <li><strong>Universal Approximation:</strong> Can approximate any continuous function</li>
                        <li><strong>Representation Learning:</strong> Discovers useful data representations</li>
                    </ul>
                </div>

                <h3>Convolutional Neural Networks (CNNs)</h3>
                <p>CNNs are specialized deep networks designed for processing grid-like data such as images.</p>
                
                <h4>CNN Architecture</h4>
                <div class="concept-box">
                    <h4>Typical CNN Layers</h4>
                    <ol>
                        <li><strong>Convolutional Layers:</strong> Apply filters to detect features</li>
                        <li><strong>Activation Layers:</strong> Apply non-linear functions (usually ReLU)</li>
                        <li><strong>Pooling Layers:</strong> Reduce spatial dimensions</li>
                        <li><strong>Fully Connected:</strong> Traditional neural network layers</li>
                        <li><strong>Output Layer:</strong> Final predictions</li>
                    </ol>
                </div>

                <h3>Convolution Operation</h3>
                <p>Convolution applies a small filter (kernel) across the input to detect local patterns.</p>
                
                <h4>Convolution Properties</h4>
                <ul>
                    <li><strong>Translation Invariance:</strong> Detects features regardless of position</li>
                    <li><strong>Parameter Sharing:</strong> Same filter used across entire image</li>
                    <li><strong>Local Connectivity:</strong> Each neuron connected to small local region</li>
                    <li><strong>Sparse Interactions:</strong> Fewer parameters than fully connected</li>
                </ul>

                <h3>Pooling Operations</h3>
                
                <h4>Max Pooling</h4>
                <p>Takes the maximum value from each region covered by the pooling kernel.</p>
                <div class="concept-box">
                    <h4>Max Pooling Benefits</h4>
                    <ul>
                        <li><strong>Translation Invariance:</strong> Small shifts don't change output</li>
                        <li><strong>Dimensionality Reduction:</strong> Reduces computational load</li>
                        <li><strong>Feature Emphasis:</strong> Highlights strongest activations</li>
                    </ul>
                </div>
            </div>
        `
    };

    return topics[topicKey] || '<div class="topic-card"><h2>Topic not found</h2><p>Please select a valid topic.</p></div>';
}

// Quiz Functions
function displayQuestion() {
    if (currentQuestion >= currentQuestions.length) {
        endQuiz();
        return;
    }

    const question = currentQuestions[currentQuestion];
    const questionContainer = document.getElementById('quiz-container');
    const finalContainer = document.getElementById('final');

    questionContainer.classList.remove('hidden');
    finalContainer.classList.add('hidden');

    // Update question display
    DOMUtils.setText('questionNum', (currentQuestion + 1).toString());
    DOMUtils.setText('question', question.question);

    // Handle question image if present
    if (question.image) {
        const questionContainer = document.getElementById('question');
        const existingImage = questionContainer.querySelector('img');
        if (existingImage) {
            existingImage.remove();
        }

        const img = document.createElement('img');
        img.src = question.image;
        img.alt = 'Question diagram';
        img.style.maxWidth = '100%';
        img.style.marginTop = '15px';
        questionContainer.appendChild(img);
    }

    // Update progress bar
    const progress = ((currentQuestion + 1) / currentQuestions.length) * 100;
    document.getElementById('progress').style.width = progress + '%';

    // Display answers with shuffling
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    // Create answer objects with original indices for tracking correct answers
    const answerObjects = question.answers.map((answer, index) => ({
        text: answer,
        originalIndex: index
    }));

    // Shuffle the answers only once per question
    if (!question.shuffledAnswers) {
        question.shuffledAnswers = QuizUtils.shuffleArray(answerObjects);
        question.shuffledMapping = question.shuffledAnswers.map(item => item.originalIndex);
        console.log('Question:', question.question.substring(0, 50) + '...');
        console.log('Original correct:', question.correct);
        console.log('Shuffled mapping:', question.shuffledMapping);
    }

    question.shuffledAnswers.forEach((answerObj, displayIndex) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        answerDiv.onclick = () => selectAnswer(displayIndex, answerDiv);

        const label = document.createElement('div');
        label.className = 'answer-label';
        label.textContent = QuizUtils.getLetterFromIndex(displayIndex).toUpperCase();

        const text = document.createElement('div');
        text.className = 'answer-text';
        text.textContent = answerObj.text;

        answerDiv.appendChild(label);
        answerDiv.appendChild(text);
        answersContainer.appendChild(answerDiv);
    });

    // Reset submit button
    const submitBtn = document.getElementById('submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submit Answer';

    selectedAnswers = [];
}

function selectAnswer(index, answerElement) {
    const answerIndex = selectedAnswers.indexOf(index);

    if (answerIndex > -1) {
        // Deselect answer
        selectedAnswers.splice(answerIndex, 1);
        answerElement.classList.remove('selected');
    } else {
        // Select answer
        selectedAnswers.push(index);
        answerElement.classList.add('selected');
    }

    // Enable submit button if any answer is selected
    const submitBtn = document.getElementById('submit');
    submitBtn.disabled = selectedAnswers.length === 0;
}

function submitAnswer() {
    const currentQ = currentQuestions[currentQuestion];
    const originalCorrectIndices = QuizUtils.parseCorrectAnswers(currentQ.correct);

    // Map selected display indices back to original indices
    const selectedOriginalIndices = selectedAnswers.map(displayIndex =>
        currentQ.shuffledMapping[displayIndex]
    );

    console.log('Submit Answer Debug:');
    console.log('- Selected display indices:', selectedAnswers);
    console.log('- Shuffled mapping:', currentQ.shuffledMapping);
    console.log('- Selected original indices:', selectedOriginalIndices);
    console.log('- Original correct indices:', originalCorrectIndices);

    // Check if answer is correct using original indices
    const isCorrect = selectedOriginalIndices.length === originalCorrectIndices.length &&
        selectedOriginalIndices.every(index => originalCorrectIndices.includes(index));

    if (isCorrect) {
        correctAnswers++;
        notificationManager.success('Correct! Well done!');
    } else {
        wrongAnswers++;
        // Track incorrect question for review
        incorrectQuestions.push(currentQ);
        notificationManager.error('Incorrect. The correct answer(s) have been highlighted.');
    }

    // Show correct/incorrect styling
    const answerOptions = document.querySelectorAll('.answer-option');
    console.log('Highlighting Debug:');
    answerOptions.forEach((option, displayIndex) => {
        const originalIndex = currentQ.shuffledMapping[displayIndex];
        const isCorrectAnswer = originalCorrectIndices.includes(originalIndex);
        const wasSelected = selectedAnswers.includes(displayIndex);

        console.log(`- Display ${displayIndex} (${QuizUtils.getLetterFromIndex(displayIndex).toUpperCase()}): original=${originalIndex}, correct=${isCorrectAnswer}, selected=${wasSelected}`);

        if (isCorrectAnswer) {
            option.classList.add('correct');
        } else if (wasSelected) {
            option.classList.add('wrong');
        }
        option.onclick = null; // Disable clicking
    });

    // Update submit button
    const submitBtn = document.getElementById('submit');
    submitBtn.textContent = currentQuestion < currentQuestions.length - 1 ? 'Next Question' : 'Finish Quiz';
    submitBtn.onclick = nextQuestion;

    updateStats();
}

function nextQuestion() {
    currentQuestion++;
    displayQuestion();

    // Reset submit button function
    const submitBtn = document.getElementById('submit');
    submitBtn.onclick = submitAnswer;
}

function updateStats() {
    const questionsAnswered = correctAnswers + wrongAnswers;
    const accuracyPercentage = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;

    DOMUtils.setText('currentQ', `${currentQuestion + 1}/${currentQuestions.length}`);
    DOMUtils.setText('totalQ', currentQuestions.length.toString());
    DOMUtils.setText('score', `${accuracyPercentage}%`);
    DOMUtils.setText('correct', correctAnswers.toString());
    DOMUtils.setText('wrong', wrongAnswers.toString());
}

function endQuiz() {
    // Stop the timer
    stopTimer();
    
    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const questionsAnswered = correctAnswers + wrongAnswers;
    const accuracy = (correctAnswers / questionsAnswered) * 100;
    const percentage = QuizUtils.calculatePercentage(correctAnswers, currentQuestions.length);
    const timePerQuestion = sessionDuration / questionsAnswered;
    
    // Calculate overall score and performance metrics
    const overallScore = calculateOverallScore(accuracy, sessionDuration, questionsAnswered);
    const performanceGrade = getPerformanceGrade(overallScore);
    const speedRating = getSpeedRating(timePerQuestion);

    // Hide quiz container, show final results
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('final').classList.remove('hidden');

    // Update final scores with enhanced statistics
    const finalContainer = document.getElementById('final');
    
    // Format time display
    const minutes = Math.floor(sessionDuration / 60);
    const seconds = sessionDuration % 60;
    const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    finalContainer.innerHTML = `
        <h2>🎯 Assessment Complete!</h2>
        
        <!-- Overall Score Section -->
        <div class="overall-score-section">
            <div class="overall-score-card">
                <div class="overall-score-header">
                    <h3>Overall Performance Score</h3>
                    <div class="score-breakdown">Accuracy (70%) + Speed (30%)</div>
                </div>
                <div class="overall-score-display">
                    <div class="score-value" style="color: ${performanceGrade.color}">${overallScore}/100</div>
                    <div class="score-grade" style="color: ${performanceGrade.color}">
                        Grade: ${performanceGrade.grade}
                    </div>
                    <div class="score-message" style="color: ${performanceGrade.color}">
                        ${performanceGrade.message}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Detailed Statistics -->
        <div class="results-summary">
            <div class="result-card primary">
                <div class="result-value">${accuracy.toFixed(1)}%</div>
                <div class="result-label">Accuracy</div>
            </div>
            
            <div class="result-card">
                <div class="result-value">${correctAnswers}</div>
                <div class="result-label">Correct</div>
            </div>
            
            <div class="result-card">
                <div class="result-value">${wrongAnswers}</div>
                <div class="result-label">Incorrect</div>
            </div>
            
            <div class="result-card">
                <div class="result-value">${timeDisplay}</div>
                <div class="result-label">Total Time</div>
            </div>
            
            <div class="result-card">
                <div class="result-value">${timePerQuestion.toFixed(1)}s</div>
                <div class="result-label">Avg per Question</div>
            </div>
            
            <div class="result-card speed-rating" style="border-color: ${speedRating.color}">
                <div class="result-value" style="color: ${speedRating.color}">
                    ${speedRating.icon}
                </div>
                <div class="result-label" style="color: ${speedRating.color}">
                    ${speedRating.rating}
                </div>
            </div>
        </div>
        
        <!-- Performance Analysis -->
        <div class="performance-analysis">
            <h4>📊 Performance Analysis</h4>
            <div class="analysis-metrics">
                <div class="metric">
                    <span class="metric-label">Accuracy Component:</span>
                    <span class="metric-value">${(accuracy * 0.7).toFixed(1)} points</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Speed Component:</span>
                    <span class="metric-value">${(overallScore - (accuracy * 0.7)).toFixed(1)} points</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Time vs Baseline:</span>
                    <span class="metric-value">${timePerQuestion > 45 ? 'Slower' : 'Faster'} than 45s target</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Questions Answered:</span>
                    <span class="metric-value">${questionsAnswered} / ${currentQuestions.length} ${questionsAnswered < currentQuestions.length ? '(Early finish)' : ''}</span>
                </div>
            </div>
        </div>
        
        <div class="final-actions">
            ${incorrectQuestions.length > 0 && !isReviewMode ? `
            <button id="reviewBtn" onclick="startReviewSession()" class="btn-secondary">
                📚 Review ${incorrectQuestions.length} Incorrect Questions
            </button>
            ` : ''}
            
            <button onclick="showDashboard()" class="btn-primary">Return to Dashboard</button>
            <button onclick="restart()" class="btn-secondary">New Assessment</button>
        </div>
    `;

    // Save session with enhanced data
    const sessionData = {
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers,
        totalQuestions: currentQuestions.length,
        questionsAnswered: questionsAnswered,
        accuracy: accuracy,
        percentage: percentage,
        overallScore: overallScore,
        timePerQuestion: timePerQuestion,
        duration: sessionDuration,
        date: new Date().toLocaleDateString(),
        completed: questionsAnswered === currentQuestions.length,
        incorrectQuestions: incorrectQuestions,
        isReviewMode: isReviewMode
    };
    
    sessionManager.saveSession(sessionData);
    
    // Save to global Firebase rankings (only if not review mode)
    if (!isReviewMode) {
        saveToGlobalRankings(sessionData);
    }

    const completionMessage = questionsAnswered < currentQuestions.length ?
        `Session finished early! Overall score: ${overallScore}/100 (Grade: ${performanceGrade.grade})` :
        `Assessment completed! Overall score: ${overallScore}/100 (Grade: ${performanceGrade.grade})`;

    notificationManager.success(completionMessage);
}

function restart() {
    startNewSession();
}

function finishSession() {
    if (currentQuestion === 0 && correctAnswers === 0 && wrongAnswers === 0) {
        notificationManager.info('No questions answered yet. Please answer at least one question before finishing.');
        return;
    }

    if (confirm('Are you sure you want to finish this session? Your current progress will be saved.')) {
        endQuiz();
    }
}

// Session History Functions
function loadSessionHistory() {
    const sessions = sessionManager.getSessions();
    const historyList = document.getElementById('history-list');

    if (sessions.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #64748b;">No assessment history yet. Take your first assessment to see results here!</p>';
        return;
    }

    historyList.innerHTML = '';

    // Show recent sessions first
    sessions.reverse().forEach((session, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        const formattedDate = QuizUtils.formatDate(session.timestamp);
        const duration = QuizUtils.formatTime(session.duration || 0);
        const questionsAnswered = session.questionsAnswered || (session.correctAnswers + session.wrongAnswers);
        const completionStatus = session.completed === false ? ' (Early finish)' : '';

        historyItem.innerHTML = `
            <div class="history-info">
                <h4>Assessment #${sessions.length - index}${completionStatus}</h4>
                <p>${formattedDate} • Duration: ${duration}</p>
            </div>
            <div class="history-score">
                <div class="score-display">${session.percentage}%</div>
                <div class="score-details">${session.correctAnswers}/${questionsAnswered} answered</div>
            </div>
        `;

        historyList.appendChild(historyItem);
    });
}

// Make functions globally accessible for HTML onclick attributes
window.showDashboard = showDashboard;
window.showLearning = showLearning;
window.startNewSession = startNewSession;
window.startReviewSession = startReviewSession;
window.showHistory = showHistory;
window.hideHistory = hideHistory;
window.submitAnswer = submitAnswer;
window.restart = restart;
window.finishSession = finishSession;
window.saveUserNameAndStart = saveUserNameAndStart;
window.validateNameInput = validateNameInput;

// Initialize IP detection when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Detect IP for access control
    detectUserIP();
    
    // Also call update after a delay to catch elements that load later
    setTimeout(() => {
        updateUIBasedOnPermissions();
    }, 2000);
});

// Debug: Test that functions are available
console.log('Functions exported to window:', {
    showDashboard: typeof window.showDashboard,
    showLearning: typeof window.showLearning,
    showHistory: typeof window.showHistory
}); 