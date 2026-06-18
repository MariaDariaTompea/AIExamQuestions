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
let currentLearningPage = 0;
let activeTopicKey = 'neural-networks';

// IP-based access control removed

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
    if (timePerQuestion <= 20) return { rating: 'Lightning Fast', icon: '', color: '#16a34a' };
    if (timePerQuestion <= 30) return { rating: 'Very Fast', icon: '', color: '#16a34a' };
    if (timePerQuestion <= 45) return { rating: 'Good Pace', icon: '', color: '#059669' };
    if (timePerQuestion <= 60) return { rating: 'Steady', icon: '', color: '#0891b2' };
    if (timePerQuestion <= 90) return { rating: 'Thoughtful', icon: '', color: '#ea580c' };
    return { rating: 'Deliberate', icon: '', color: '#dc2626' };
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

        // Initialize WebCraft theme effects
        initCursorBlob();
        initCursorTrails();
        initTechCanvas();
        initBootConsole();

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
                <div class="cyber-badge">[SYS_DATALINK // TERMINAL_LINK // STATUS: OK]</div>
                <h1 class="title glitch-text" data-text="AI Learning Platform">AI Learning Platform</h1>
                <p class="subtitle">Master artificial intelligence concepts through structured learning and assessment</p>
            </div>
            
            <div class="dashboard-grid">
                <div class="dashboard-card primary" onclick="showLearning()">
                    <div class="card-icon"></div>
                    <h3>Learning Modules</h3>
                    <p>Study AI concepts with guided explanations</p>
                    <button class="card-btn">Start Learning</button>
                </div>
                
                <div class="dashboard-card secondary" onclick="startNewSession()">
                    <div class="card-icon"></div>
                    <h3>New Assessment</h3>
                    <p>Test your knowledge with comprehensive questions</p>
                    <button class="card-btn">Take Test</button>
                </div>
                
                <div class="dashboard-card quaternary" onclick="startReviewSession()" id="reviewCard">
                    <div class="card-icon"></div>
                    <h3>Review Missed Questions</h3>
                    <p>Practice questions you got wrong in your last session</p>
                    <button class="card-btn">Start Review</button>
                </div>
                
                <div class="dashboard-card tertiary" onclick="showHistory()">
                    <div class="card-icon"></div>
                    <h3>Session History</h3>
                    <p>Review your progress and past performance</p>
                    <button class="card-btn">View History</button>
                </div>
            </div>

            <!-- Cyber Boot Console Logs -->
            <div id="cyber-console" style="margin-top: 2.5rem; font-family: monospace; font-size: 0.85rem; background: rgba(0,0,0,0.6); border: 2px solid var(--primary); padding: 1.2rem; border-radius: 0; text-align: left; max-width: 550px; margin-left: auto; margin-right: auto; max-height: 150px; overflow: hidden; box-shadow: 0 0 15px rgba(139, 92, 246, 0.25);">
                <div style="color: var(--secondary); margin-bottom: 0.5rem; font-weight: bold; font-family: monospace;">[LINKED TELEMETRY NODE DATA - ACTIVE]</div>
                <div id="logs-body"></div>
            </div>
            
            <div id="history-section" class="history-section hidden">
                <h2>Assessment History</h2>
                <div id="history-list" class="history-list"></div>
                <button class="back-btn" onclick="hideHistory()">Back to Dashboard</button>
            </div>
        `;
        initBootConsole();
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
        { key: 'intro-ml', title: '1. Introduction to ML' },
        { key: 'classification', title: '2. Classification' },
        { key: 'regression', title: '3. Regression' },
        { key: 'decision-trees', title: '4. Decision Trees' },
        { key: 'model-evaluation', title: '5. Model Evaluation' },
        { key: 'neural-networks', title: '6. Neural Networks' },
        { key: 'activation-functions', title: '7. Activation Functions' },
        { key: 'backpropagation', title: '8. Backpropagation' },
        { key: 'deep-learning-problems', title: '9. Deep Learning Problems' },
        { key: 'cnn', title: '10. CNNs' },
        { key: 'tensors', title: '11. Tensors & Dimensions' },
        { key: 'clustering', title: '12. Clustering (K-Means)' },
        { key: 'preprocessing', title: '13. Preprocessing' },
        { key: 'genetic-algorithms', title: '14. Genetic Algorithms' },
        { key: 'pso', title: '15. PSO (Swarm)' },
        { key: 'aco', title: '16. ACO (Ant Colony)' },
        { key: 'fuzzy-logic', title: '17. Fuzzy Logic' },
        { key: 'rule-based-systems', title: '18. Rule Systems' },
        { key: 'search-strategies', title: '19. Search Strategies' },
        { key: 'reinforcement-learning', title: '20. Reinforcement Learning' }
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

    activeTopicKey = topicKey;
    currentLearningPage = 0;

    // Get content based on topic & page
    const content = getTopicContentHTML(topicKey, currentLearningPage);
    DOMUtils.setHTML('learningContent', content);

    // Initialize interactive scripts
    initLearningInteractive(topicKey, currentLearningPage);
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
window.changeLearningPage = changeLearningPage;



// Debug: Test that functions are available
console.log('Functions exported to window:', {
    showDashboard: typeof window.showDashboard,
    showLearning: typeof window.showLearning,
    showHistory: typeof window.showHistory
});

// WebCraft Interactive Theme Effects
function initCursorBlob() {
    const blob = document.createElement('div');
    const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#8b5cf6';
    blob.style.cssText = "position:fixed; width:200px; height:200px; background:radial-gradient(circle, " + primaryColor + "1a 0%, transparent 70%); pointer-events:none; z-index:9999; transform:translate(-50%, -50%); transition: left 0.1s ease-out, top 0.1s ease-out;";
    document.body.appendChild(blob);
    document.addEventListener('mousemove', (e) => {
        blob.style.left = e.clientX + 'px';
        blob.style.top = e.clientY + 'px';
    });
}

function initCursorTrails() {
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.15) return;
        const block = document.createElement('div');
        const secondaryColor = getComputedStyle(document.body).getPropertyValue('--secondary').trim() || '#52f47b';
        block.style.cssText = "position:fixed; left:" + e.clientX + "px; top:" + e.clientY + "px; width:16px; height:16px; background:" + secondaryColor + "; pointer-events:none; z-index:9998; border: 2px solid #000; transform: translate(-50%, -50%) rotate(" + (Math.random() * 360) + "deg); transition: all 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28); opacity: 0.9;";
        document.body.appendChild(block);
        requestAnimationFrame(() => {
            block.style.transform = "translate(-50%, -50%) scale(0) rotate(90deg)";
            block.style.opacity = "0";
        });
        setTimeout(() => block.remove(), 600);
    });
}

function initTechCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'tech-canvas';
    canvas.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; pointer-events:none; z-index:-1; opacity:0.18;";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    const columns = Math.floor(width / 20) + 1;
    const ypos = Array(columns).fill(0);
    const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#8b5cf6';
    
    function update() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = primaryColor;
        ctx.font = '12px monospace';
        
        ypos.forEach((y, ind) => {
            const text = Math.random() > 0.5 ? '1' : '0';
            const x = ind * 20;
            ctx.fillText(text, x, y);
            if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
            else ypos[ind] = y + 15;
        });
        requestAnimationFrame(update);
    }
    update();
}

function initBootConsole() {
    const body = document.getElementById('logs-body');
    if (!body) return;
    // Clear any existing logs first
    body.innerHTML = '';
    
    const logs = [
        "CONNECTING TO NETWORK SUBNET...",
        "DECRYPTING SECURITY COEFFICIENTS: SUCCESS",
        "SECURE DATA LINK BRIDGE ACTIVE.",
        "RUNNING LIVE PIPELINE DIAGNOSTICS...",
        "STABILIZING CORE GRID LOAD CHANNELS...",
        "NODE SYSTEM PERFORMANCE STATUS: OPTIMAL.",
        "INITIALIZING AI COMPILER ENGINE...",
        "LOAD SYSTEM AGENT: SUCCESSFUL."
    ];
    let idx = 0;
    function addLog() {
        const currentBody = document.getElementById('logs-body');
        if (!currentBody) return;
        const d = document.createElement('div');
        d.innerHTML = '> ' + logs[idx % logs.length];
        d.style.color = 'var(--secondary)';
        d.style.fontFamily = 'monospace';
        d.style.fontSize = '0.75rem';
        d.style.marginBottom = '0.2rem';
        currentBody.appendChild(d);
        idx++;
        if (currentBody.children.length > 3) {
            currentBody.removeChild(currentBody.firstChild);
        }
        setTimeout(addLog, 2500 + Math.random() * 2000);
    }
    addLog();
}

// Sub-page Glitch Transitions & Interactive Neuron Mapping
function changeLearningPage(pageIndex) {
    const container = document.getElementById('learningContent');
    if (!container) return;
    
    // Add glitch transition class
    container.classList.add('glitch-transition');
    
    // Halfway through the glitch (200ms), swap the content
    setTimeout(() => {
        currentLearningPage = pageIndex;
        const content = getTopicContentHTML(activeTopicKey, currentLearningPage);
        DOMUtils.setHTML('learningContent', content);
        
        // Initialize interactive scripts
        initLearningInteractive(activeTopicKey, currentLearningPage);
        
        // Auto scroll to the top of the learning container
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
    
    // Remove glitch transition class after animation completes (400ms)
    setTimeout(() => {
        container.classList.remove('glitch-transition');
    }, 400);
}

function initNeuron3D() {
    const titleElem = document.getElementById('neuron-part-title');
    const descElem = document.getElementById('neuron-part-desc');
    if (!titleElem || !descElem) return;

    const mappings = {
        dendrites: {
            title: "Dendrites ➔ Input Features (x1, x2, x3)",
            desc: "In biology, <span class='active-part-highlight'>dendrites</span> receive chemical signals (neurotransmitters) from other neurons. In a Perceptron, these correspond to the <span class='active-part-highlight'>Input Features (x)</span> which represent the incoming data points or features."
        },
        soma: {
            title: "Soma (Cell Body) ➔ Linear Summation (Σ)",
            desc: "In biology, the <span class='active-part-highlight'>Soma</span> acts as an accumulator, adding up all the incoming chemical changes from the dendrites. In a Perceptron, this corresponds to the <span class='active-part-highlight'>Weighted Sum (w·x + b)</span> which aggregates all input signals multiplied by their weights, plus bias."
        },
        nucleus: {
            title: "Nucleus ➔ Summation Core & Bias",
            desc: "The <span class='active-part-highlight'>Nucleus</span> is the core of the soma. In a Perceptron, the summation core aggregates inputs and incorporates the <span class='active-part-highlight'>Bias (b)</span>, which adjusts the activation threshold of the neuron."
        },
        axon: {
            title: "Axon ➔ Activation Function f(z)",
            desc: "In biology, the <span class='active-part-highlight'>Axon</span> is a nerve fiber that transmits an electrical impulse (action potential) if the Soma's accumulated charge passes a certain threshold. In a Perceptron, this is represented by the <span class='active-part-highlight'>Activation Function</span> (e.g. Step or Sigmoid) which maps the sum to an output."
        },
        terminals: {
            title: "Axon Terminals ➔ Binary Output (y)",
            desc: "In biology, <span class='active-part-highlight'>Axon Terminals</span> transmit output signals to the dendrites of subsequent neurons. In a Perceptron, this corresponds to the final <span class='active-part-highlight'>Output (y)</span>, typically represented as binary values (0 or 1)."
        }
    };

    // Find all hover elements in the 3D scene
    const hoverElements = document.querySelectorAll('[data-label]');
    hoverElements.forEach(elem => {
        const label = elem.getAttribute('data-label');
        if (mappings[label]) {
            elem.addEventListener('mouseenter', () => {
                titleElem.textContent = mappings[label].title;
                descElem.innerHTML = mappings[label].desc;
            });
            elem.addEventListener('mouseleave', () => {
                titleElem.textContent = "Hover over a neuron part above...";
                descElem.innerHTML = "Hover over the 3D model components (Dendrites, Soma, Axon, etc.) to decrypt their biological and artificial mapping.";
            });
        }
    });
}

// Interactive Learning Orchestrator
function initLearningInteractive(topicKey, pageIndex) {
    console.log(`initLearningInteractive called for: ${topicKey}, page: ${pageIndex}`);
    
    if (topicKey === 'intro-ml') {
        if (pageIndex === 0) initMLDemo();
    }
    else if (topicKey === 'classification') {
        if (pageIndex === 0) initClassificationDemo();
        if (pageIndex === 1) initKNNDemo();
    }
    else if (topicKey === 'regression') {
        if (pageIndex === 0) initRegressionDemo();
    }
    else if (topicKey === 'decision-trees') {
        if (pageIndex === 0) initDecisionTreeDemo();
    }
    else if (topicKey === 'model-evaluation') {
        if (pageIndex === 0) initConfusionMatrixDemo();
        if (pageIndex === 1) initModelEvaluationDemo();
    }
    else if (topicKey === 'neural-networks') {
        if (pageIndex === 0) {
            setTimeout(window.updatePerceptron, 50);
        }
        if (pageIndex === 1) initNeuron3D();
    }
    else if (topicKey === 'activation-functions') {
        if (pageIndex === 0) initActivationPlayground();
    }
    else if (topicKey === 'backpropagation') {
        if (pageIndex === 0) initGradientDescentDemo();
        if (pageIndex === 1) initLossSurface3D();
    }
    else if (topicKey === 'deep-learning-problems') {
        if (pageIndex === 0) initPolyOverfitDemo();
    }
    else if (topicKey === 'cnn') {
        if (pageIndex === 0) initCNNFeedforward();
    }
    else if (topicKey === 'tensors') {
        if (pageIndex === 0) initTensorDemo();
    }
    else if (topicKey === 'clustering') {
        if (pageIndex === 0) initKMeansDemo();
    }
    else if (topicKey === 'preprocessing') {
        if (pageIndex === 0) initPreprocessingDemo();
    }
    else if (topicKey === 'genetic-algorithms') {
        if (pageIndex === 0) initGeneticDemo();
    }
    else if (topicKey === 'pso') {
        if (pageIndex === 0) initPSODemo();
    }
    else if (topicKey === 'aco') {
        if (pageIndex === 0) initACODemo();
    }
    else if (topicKey === 'fuzzy-logic') {
        if (pageIndex === 0) initFuzzyDemo();
    }
    else if (topicKey === 'rule-based-systems') {
        if (pageIndex === 0) initRuleSystemDemo();
    }
    else if (topicKey === 'search-strategies') {
        if (pageIndex === 0) initSearchDemo();
    }
    else if (topicKey === 'reinforcement-learning') {
        if (pageIndex === 0) initGridWorldDemo();
    }
}

// 1. Machine Learning Fundamentals - Learn from Data Demo
function initMLDemo() {
    const canvas = document.getElementById('ml-demo-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let chartInstance = null;
    let dataPoints = [];
    
    function generateData() {
        const size = parseInt(document.getElementById('size-slider').value);
        const noise = parseFloat(document.getElementById('noise-slider').value);
        document.getElementById('size-val').textContent = size;
        document.getElementById('noise-val').textContent = noise.toFixed(1);
        
        dataPoints = [];
        // True function: y = 2x + 1
        for (let i = 0; i < size; i++) {
            const x = (Math.random() * 10) - 5; // x between -5 and 5
            const error = (Math.random() - 0.5) * noise * 8;
            const y = 2 * x + 1 + error;
            dataPoints.push({x: x, y: y});
        }
        updateChart();
    }
    
    function updateChart() {
        // Compute Linear Regression line using Least Squares
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        const n = dataPoints.length;
        dataPoints.forEach(p => {
            sumX += p.x;
            sumY += p.y;
            sumXY += p.x * p.y;
            sumXX += p.x * p.x;
        });
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
        const intercept = (sumY - slope * sumX) / n;
        
        // Generate line coordinates
        const linePoints = [
            {x: -5, y: slope * -5 + intercept},
            {x: 5, y: slope * 5 + intercept}
        ];
        
        if (chartInstance) {
            chartInstance.destroy();
        }
        
        chartInstance = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Generated Data Points',
                    data: dataPoints,
                    backgroundColor: '#52f47b',
                    pointRadius: 4
                }, {
                    label: 'Model Fit (Prediction Line)',
                    data: linePoints,
                    type: 'line',
                    borderColor: '#8b5cf6',
                    borderWidth: 2,
                    fill: false,
                    showLine: true,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#e0e0e0' } } },
                scales: {
                    x: { type: 'linear', position: 'bottom', ticks: { color: '#aaaaaa' }, grid: { color: '#333333' } },
                    y: { ticks: { color: '#aaaaaa' }, grid: { color: '#333333' } }
                }
            }
        });
    }
    
    // Bind listeners
    document.getElementById('size-slider').oninput = generateData;
    document.getElementById('noise-slider').oninput = generateData;
    document.getElementById('gen-dataset-btn').onclick = generateData;
    
    // Initial run
    generateData();
}

// 2. Classification Decision Boundary
function initClassificationDemo() {
    const canvas = document.getElementById('class-demo-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let points = [
        {x: 80, y: 100, class: 'A'},
        {x: 120, y: 80, class: 'A'},
        {x: 100, y: 150, class: 'A'},
        {x: 220, y: 250, class: 'B'},
        {x: 280, y: 220, class: 'B'},
        {x: 250, y: 280, class: 'B'}
    ];
    let currentClass = 'A';
    
    function draw() {
        const boundaryVal = parseFloat(document.getElementById('boundary-slider').value);
        document.getElementById('boundary-val').textContent = boundaryVal.toFixed(1);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw classification regions
        // Line equation: y - 150 = boundaryVal * (x - 150)
        // Or y = boundaryVal * (x - 150) + 150
        for (let x = 0; x < canvas.width; x += 4) {
            for (let y = 0; y < canvas.height; y += 4) {
                const lineY = boundaryVal * (x - 150) + 150;
                if (y < lineY) {
                    ctx.fillStyle = 'rgba(139, 92, 246, 0.04)'; // Class A region
                } else {
                    ctx.fillStyle = 'rgba(82, 244, 123, 0.04)'; // Class B region
                }
                ctx.fillRect(x, y, 4, 4);
            }
        }
        
        // Draw Decision Boundary Line
        ctx.beginPath();
        ctx.moveTo(0, boundaryVal * (0 - 150) + 150);
        ctx.lineTo(canvas.width, boundaryVal * (canvas.width - 150) + 150);
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw Points
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
            ctx.fillStyle = p.class === 'A' ? '#8b5cf6' : '#52f47b';
            ctx.shadowBlur = 10;
            ctx.shadowColor = ctx.fillStyle;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });
    }
    
    // Toggle active class button click listener
    const btnA = document.getElementById('class-btn-a');
    const btnB = document.getElementById('class-btn-b');
    
    if (btnA && btnB) {
        btnA.onclick = () => {
            currentClass = 'A';
            btnA.style.borderColor = 'var(--secondary)';
            btnB.style.borderColor = 'var(--border)';
        };
        btnB.onclick = () => {
            currentClass = 'B';
            btnB.style.borderColor = 'var(--secondary)';
            btnA.style.borderColor = 'var(--border)';
        };
    }
    
    // Add point on canvas click
    canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        points.push({x: x, y: y, class: currentClass});
        draw();
    };
    
    // Reset points
    document.getElementById('reset-class-btn').onclick = () => {
        points = [];
        draw();
    };
    
    document.getElementById('boundary-slider').oninput = draw;
    draw();
}

// 3. k-NN Nearest Neighbors
function initKNNDemo() {
    const canvas = document.getElementById('knn-demo-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let trainData = [
        {x: 60, y: 70, class: 'A'},
        {x: 100, y: 60, class: 'A'},
        {x: 70, y: 110, class: 'A'},
        {x: 90, y: 100, class: 'A'},
        {x: 120, y: 120, class: 'A'},
        
        {x: 200, y: 220, class: 'B'},
        {x: 230, y: 180, class: 'B'},
        {x: 260, y: 240, class: 'B'},
        {x: 210, y: 260, class: 'B'},
        {x: 170, y: 200, class: 'B'}
    ];
    let testPoint = null;
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Grid background line drawing
        ctx.strokeStyle = '#22222b';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 30) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }
        
        // Draw training points
        trainData.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = p.class === 'A' ? '#8b5cf6' : '#52f47b';
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.stroke();
        });
        
        // If a test point exists, compute neighbors
        if (testPoint) {
            const k = parseInt(document.getElementById('knn-k-slider').value);
            document.getElementById('knn-k-val').textContent = k;
            
            // Calculate distances
            let distances = trainData.map(p => {
                const dist = Math.sqrt((p.x - testPoint.x)**2 + (p.y - testPoint.y)**2);
                return {point: p, distance: dist};
            });
            
            // Sort ascending
            distances.sort((a, b) => a.distance - b.distance);
            
            // Grab k nearest
            const nearest = distances.slice(0, k);
            
            // Draw lines to nearest
            ctx.strokeStyle = 'rgba(243, 244, 246, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            nearest.forEach(n => {
                ctx.beginPath();
                ctx.moveTo(testPoint.x, testPoint.y);
                ctx.lineTo(n.point.x, n.point.y);
                ctx.stroke();
            });
            ctx.setLineDash([]); // reset
            
            // Predict Class
            let countA = 0, countB = 0;
            nearest.forEach(n => {
                if (n.point.class === 'A') countA++;
                else countB++;
            });
            
            const prediction = countA >= countB ? 'Class A (Purple)' : 'Class B (Green)';
            const predictionColor = countA >= countB ? '#8b5cf6' : '#52f47b';
            document.getElementById('knn-prediction').innerHTML = `
                Nearest Count: A: <strong>${countA}</strong>, B: <strong>${countB}</strong><br>
                Prediction: <span style="color: ${predictionColor}; font-weight: bold;">${prediction}</span>
            `;
            
            // Draw Test Point ($?$)
            ctx.beginPath();
            ctx.arc(testPoint.x, testPoint.y, 9, 0, Math.PI * 2);
            ctx.fillStyle = '#f3f4f6';
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#f3f4f6';
            ctx.fill();
            ctx.shadowBlur = 0; // reset
            ctx.strokeStyle = '#000';
            ctx.stroke();
            
            ctx.fillStyle = '#000';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', testPoint.x, testPoint.y);
        } else {
            document.getElementById('knn-prediction').innerHTML = `Click anywhere inside the grid to place a test point.`;
        }
    }
    
    canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        testPoint = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        draw();
    };
    
    document.getElementById('knn-k-slider').oninput = draw;
    draw();
}

// 4. Regression & Overfitting - Linear Regression manual fit
function initRegressionDemo() {
    const canvas = document.getElementById('reg-chart-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const trainData = [
        {x: 1, y: 1.8},
        {x: 2, y: 2.5},
        {x: 3, y: 4.1},
        {x: 4, y: 4.8},
        {x: 5, y: 6.2}
    ];
    
    let chartInstance = null;
    
    function calculateMSE(slope, intercept) {
        let errorSum = 0;
        trainData.forEach(p => {
            const pred = slope * p.x + intercept;
            errorSum += (p.y - pred) ** 2;
        });
        return errorSum / trainData.length;
    }
    
    function update() {
        const slope = parseFloat(document.getElementById('reg-slope-slider').value);
        const intercept = parseFloat(document.getElementById('reg-intercept-slider').value);
        
        document.getElementById('reg-slope-val').textContent = slope.toFixed(1);
        document.getElementById('reg-intercept-val').textContent = intercept.toFixed(1);
        
        const mse = calculateMSE(slope, intercept);
        document.getElementById('reg-error-display').textContent = `Current MSE (Error) = ${mse.toFixed(3)}`;
        
        // Generate linear line points
        const linePoints = [
            {x: 0, y: intercept},
            {x: 6, y: slope * 6 + intercept}
        ];
        
        if (chartInstance) {
            chartInstance.destroy();
        }
        
        chartInstance = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Training Points',
                    data: trainData,
                    backgroundColor: '#52f47b',
                    pointRadius: 6
                }, {
                    label: 'Your Line',
                    data: linePoints,
                    type: 'line',
                    borderColor: '#8b5cf6',
                    borderWidth: 3,
                    fill: false,
                    showLine: true,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { min: 0, max: 6, ticks: { color: '#aaaaaa' }, grid: { color: '#333333' } },
                    y: { min: 0, max: 8, ticks: { color: '#aaaaaa' }, grid: { color: '#333333' } }
                }
            }
        });
    }
    
    document.getElementById('reg-slope-slider').oninput = update;
    document.getElementById('reg-intercept-slider').oninput = update;
    
    // Find Best Fit Least Squares
    document.getElementById('fit-reg-btn').onclick = () => {
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        const n = trainData.length;
        trainData.forEach(p => {
            sumX += p.x;
            sumY += p.y;
            sumXY += p.x * p.y;
            sumXX += p.x * p.x;
        });
        
        const optimalSlope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const optimalIntercept = (sumY - optimalSlope * sumX) / n;
        
        // Slide animation effect
        let t = 0;
        const startSlope = parseFloat(document.getElementById('reg-slope-slider').value);
        const startIntercept = parseFloat(document.getElementById('reg-intercept-slider').value);
        
        function animateFit() {
            t += 0.05;
            if (t >= 1) {
                document.getElementById('reg-slope-slider').value = optimalSlope;
                document.getElementById('reg-intercept-slider').value = optimalIntercept;
                update();
                notificationManager.success('Optimal Least Squares line locked in!');
            } else {
                document.getElementById('reg-slope-slider').value = startSlope + t * (optimalSlope - startSlope);
                document.getElementById('reg-intercept-slider').value = startIntercept + t * (optimalIntercept - startIntercept);
                update();
                requestAnimationFrame(animateFit);
            }
        }
        animateFit();
    };
    
    update();
}

// 5. Polynomial Regression & Overfitting Curves
function initPolyOverfitDemo() {
    const canvas = document.getElementById('poly-chart-canvas');
    const errCanvas = document.getElementById('poly-error-canvas');
    if (!canvas || !errCanvas) return;
    const ctx = canvas.getContext('2d');
    const errCtx = errCanvas.getContext('2d');
    
    const trainData = [
        {x: -2, y: 2.2},
        {x: -1.2, y: 0.8},
        {x: -0.2, y: -0.9},
        {x: 0.8, y: -0.2},
        {x: 1.5, y: 1.4},
        {x: 2.2, y: 4.5}
    ];
    // Slightly off points representing Validation
    const valData = [
        {x: -1.7, y: 1.6},
        {x: -0.8, y: -0.2},
        {x: 0.3, y: -0.8},
        {x: 1.1, y: 0.5},
        {x: 1.9, y: 2.8}
    ];
    
    let mainChart = null;
    let errorChart = null;
    
    // Matrix Solver Helper (Gaussian Elimination)
    function solveMatrix(A, B) {
        const n = B.length;
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
            }
            [A[i], A[maxRow]] = [A[maxRow], A[i]];
            [B[i], B[maxRow]] = [B[maxRow], B[i]];
            
            for (let k = i + 1; k < n; k++) {
                const c = -A[k][i] / A[i][i];
                for (let j = i; j < n; j++) {
                    A[k][j] += c * A[i][j];
                }
                B[k] += c * B[i];
            }
        }
        const x = Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < n; j++) {
                sum += A[i][j] * x[j];
            }
            x[i] = (B[i] - sum) / A[i][i];
        }
        return x;
    }
    
    function fitPolynomial(data, degree) {
        const n = degree + 1;
        const A = Array.from({length: n}, () => Array(n).fill(0));
        const B = Array(n).fill(0);
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let sumPower = 0;
                data.forEach(p => sumPower += p.x ** (i + j));
                A[i][j] = sumPower;
            }
            let sumYPower = 0;
            data.forEach(p => sumYPower += p.y * (p.x ** i));
            B[i] = sumYPower;
        }
        return solveMatrix(A, B);
    }
    
    function update() {
        const degree = parseInt(document.getElementById('poly-deg-slider').value);
        document.getElementById('poly-deg-val').textContent = degree;
        
        // Fit polynomial coefficients
        const coefficients = fitPolynomial(trainData, degree);
        
        // Evaluate y for given x
        function evaluatePoly(xVal) {
            let yVal = 0;
            coefficients.forEach((coef, idx) => yVal += coef * (xVal ** idx));
            return yVal;
        }
        
        // Generate continuous curve points
        const curvePoints = [];
        for (let x = -2.5; x <= 2.5; x += 0.1) {
            curvePoints.push({x: x, y: evaluatePoly(x)});
        }
        
        if (mainChart) mainChart.destroy();
        
        mainChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Training points',
                    data: trainData,
                    backgroundColor: '#52f47b',
                    pointRadius: 6
                }, {
                    label: 'Validation points',
                    data: valData,
                    backgroundColor: '#f59e0b',
                    pointRadius: 5
                }, {
                    label: `Polynomial Fit (Deg ${degree})`,
                    data: curvePoints,
                    type: 'line',
                    borderColor: '#8b5cf6',
                    borderWidth: 2.5,
                    fill: false,
                    showLine: true,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#e0e0e0' } } },
                scales: {
                    x: { min: -2.5, max: 2.5, ticks: { color: '#aaaaaa' }, grid: { color: '#222' } },
                    y: { min: -2, max: 6, ticks: { color: '#aaaaaa' }, grid: { color: '#222' } }
                }
            }
        });
        
        // Render Train vs Val error curves
        const degrees = Array.from({length: 6}, (_, i) => i);
        const trainErrors = [];
        const valErrors = [];
        
        degrees.forEach(d => {
            const coefs = fitPolynomial(trainData, d);
            function evalP(xVal) {
                let yVal = 0;
                coefs.forEach((c, idx) => yVal += c * (xVal ** idx));
                return yVal;
            }
            
            let trainErr = 0;
            trainData.forEach(p => trainErr += (p.y - evalP(p.x))**2);
            trainErrors.push(trainErr / trainData.length);
            
            let valErr = 0;
            valData.forEach(p => valErr += (p.y - evalP(p.x))**2);
            valErrors.push(valErr / valData.length);
        });
        
        if (errorChart) errorChart.destroy();
        
        errorChart = new Chart(errCtx, {
            type: 'line',
            data: {
                labels: degrees,
                datasets: [
                    { label: 'Train Loss', data: trainErrors, borderColor: '#52f47b', fill: false },
                    { label: 'Validation Loss', data: valErrors, borderColor: '#ff3e3e', fill: false }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#e0e0e0' } } },
                scales: {
                    x: { title: { display: true, text: 'Complexity (Degree)', color: '#aaa' }, ticks: { color: '#aaa' }, grid: { color: '#222' } },
                    y: {
                        title: { display: true, text: 'Loss', color: '#aaa' },
                        ticks: {
                            color: '#aaa',
                            callback: function(value) {
                                return value.toFixed(2);
                            }
                        },
                        grid: { color: '#222' }
                    }
                }
            }
        });
        
        // Display summary text
        let modelStatus = "Optimal Fit";
        let statusColor = "var(--secondary)";
        if (degree <= 1) {
            modelStatus = "Underfitting (Model too simple to fit curvature)";
            statusColor = "#ff3e3e";
        } else if (degree >= 4) {
            modelStatus = "Overfitting (Low Train loss but high Validation loss!)";
            statusColor = "#f59e0b";
        }
        document.getElementById('poly-complexity-status').innerHTML = `
            Status: <span style="color: ${statusColor}; font-weight: bold;">${modelStatus}</span>
        `;
    }
    
    document.getElementById('poly-deg-slider').oninput = update;
    update();
}

// 6. Optimization - Gradient Descent Parabola
function initGradientDescentDemo() {
    const canvas = document.getElementById('gd-chart-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let chartInstance = null;
    let trainingInterval = null;
    
    // Parabola Equation: L(w) = w^2
    const wValues = [];
    const lossValues = [];
    for (let w = -5; w <= 5; w += 0.2) {
        wValues.push(w);
        lossValues.push(w * w);
    }
    
    let currentW = -4.5;
    let path = [];
    
    function resetGD() {
        if (trainingInterval) clearInterval(trainingInterval);
        currentW = -4.5;
        path = [{x: currentW, y: currentW * currentW}];
        document.getElementById('gd-iter-display').textContent = 'Iteration: 0';
        document.getElementById('gd-loss-display').textContent = 'Loss: 20.25';
        update();
    }
    
    function update() {
        const linePoints = wValues.map(w => ({x: w, y: w*w}));
        
        if (chartInstance) chartInstance.destroy();
        
        chartInstance = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Loss Surface L(w) = w²',
                    data: linePoints,
                    type: 'line',
                    borderColor: '#8b5cf6',
                    fill: false,
                    showLine: true,
                    pointRadius: 0
                }, {
                    label: 'GD Steps path',
                    data: path,
                    type: 'line',
                    borderColor: '#52f47b',
                    borderWidth: 2,
                    showLine: true,
                    pointBackgroundColor: '#52f47b',
                    pointRadius: 5
                }, {
                    label: 'Current Ball position',
                    data: [{x: currentW, y: currentW*currentW}],
                    backgroundColor: '#ff3e3e',
                    pointRadius: 10,
                    pointHoverRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { min: -5, max: 5, ticks: { color: '#aaa' }, grid: { color: '#222' } },
                    y: { min: 0, max: 25, ticks: { color: '#aaa' }, grid: { color: '#222' } }
                }
            }
        });
    }
    
    document.getElementById('gd-start-btn').onclick = () => {
        if (trainingInterval) clearInterval(trainingInterval);
        resetGD();
        
        const lr = parseFloat(document.getElementById('gd-lr-slider').value);
        document.getElementById('gd-lr-val').textContent = lr.toFixed(2);
        
        let iteration = 0;
        
        trainingInterval = setInterval(() => {
            iteration++;
            // Gradient dL/dw of w^2 is 2w
            const gradient = 2 * currentW;
            currentW = currentW - lr * gradient;
            const loss = currentW * currentW;
            
            path.push({x: currentW, y: loss});
            
            document.getElementById('gd-iter-display').textContent = `Iteration: ${iteration}`;
            document.getElementById('gd-loss-display').textContent = `Loss: ${loss.toFixed(4)}`;
            
            update();
            
            // If converged or exploded
            if (Math.abs(gradient) < 0.01 || Math.abs(currentW) > 10) {
                clearInterval(trainingInterval);
                if (Math.abs(currentW) > 10) {
                    notificationManager.error('Gradient Exploded! Try a smaller Learning Rate.');
                } else {
                    notificationManager.success('Gradient converged to local minimum!');
                }
            }
        }, 300);
    };
    
    document.getElementById('gd-reset-btn').onclick = resetGD;
    resetGD();
}

// 7. Optimization - 3D Loss Surface
function initLossSurface3D() {
    const canvas = document.getElementById('loss-3d-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let rotX = 30; // degrees
    let rotY = 45;
    
    // Function: Z = cos(X) * sin(Y) * 2 + X^2/20 + Y^2/20
    // Render isometric projected grid lines
    function project(x, y, z) {
        // Rotate around Y-axis
        const radY = rotY * Math.PI / 180;
        let x1 = x * Math.cos(radY) - z * Math.sin(radY);
        let z1 = x * Math.sin(radY) + z * Math.cos(radY);
        
        // Rotate around X-axis
        const radX = rotX * Math.PI / 180;
        let y1 = y * Math.cos(radX) - z1 * Math.sin(radX);
        
        // Project to canvas coordinate space
        const screenX = canvas.width / 2 + x1 * 20;
        const screenY = canvas.height / 2 - y1 * 20;
        return {x: screenX, y: screenY};
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid mesh lines
        ctx.strokeStyle = '#8b5cf680';
        ctx.lineWidth = 1;
        
        const size = 8;
        const step = 0.5;
        
        for (let x = -size; x <= size; x += step) {
            ctx.beginPath();
            for (let y = -size; y <= size; y += step) {
                const z = Math.sin(x) * Math.cos(y) * 2 + (x*x)/10 + (y*y)/10;
                const p = project(x, z, y); // Map y of mesh to z (vertical)
                if (y === -size) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        }
        
        for (let y = -size; y <= size; y += step) {
            ctx.beginPath();
            for (let x = -size; x <= size; x += step) {
                const z = Math.sin(x) * Math.cos(y) * 2 + (x*x)/10 + (y*y)/10;
                const p = project(x, z, y);
                if (x === -size) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        }
        
        // Draw axes tags
        ctx.fillStyle = '#aaa';
        ctx.font = '10px monospace';
        const px = project(size, 0, 0);
        ctx.fillText('+W1', px.x, px.y);
        const py = project(0, 0, size);
        ctx.fillText('+W2', py.x, py.y);
    }
    
    document.getElementById('rotate-x-slider').oninput = (e) => {
        rotX = parseInt(e.target.value);
        draw();
    };
    document.getElementById('rotate-y-slider').oninput = (e) => {
        rotY = parseInt(e.target.value);
        draw();
    };
    
    draw();
}

// 8. Clustering - K-Means Clustering Simulator
function initKMeansDemo() {
    const canvas = document.getElementById('kmeans-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let points = [];
    let centroids = [];
    let state = 'init'; // init -> assign -> move -> step
    
    function initData() {
        points = [];
        centroids = [];
        state = 'init';
        
        // Generate three gaussian-like point blobs
        const centers = [
            {x: 80, y: 80},
            {x: 220, y: 100},
            {x: 150, y: 220}
        ];
        
        centers.forEach(c => {
            for (let i = 0; i < 15; i++) {
                points.push({
                    x: c.x + (Math.random() - 0.5) * 60,
                    y: c.y + (Math.random() - 0.5) * 60,
                    centroidIndex: -1
                });
            }
        });
        
        updateCentroids();
        draw();
    }
    
    function updateCentroids() {
        const k = parseInt(document.getElementById('kmeans-k-slider').value);
        centroids = [];
        // Place random initial centroids
        for (let i = 0; i < k; i++) {
            centroids.push({
                x: 40 + Math.random() * (canvas.width - 80),
                y: 40 + Math.random() * (canvas.height - 80),
                color: i === 0 ? '#8b5cf6' : i === 1 ? '#52f47b' : i === 2 ? '#f59e0b' : i === 3 ? '#ff3e3e' : '#00ffff'
            });
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw Points
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = p.centroidIndex === -1 ? '#aaaaaa' : centroids[p.centroidIndex].color;
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.stroke();
        });
        
        // Draw Centroids
        centroids.forEach(c => {
            ctx.beginPath();
            // Star Shape
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(c.x + Math.cos((18 + i * 72) * Math.PI / 180) * 12, c.y - Math.sin((18 + i * 72) * Math.PI / 180) * 12);
                ctx.lineTo(c.x + Math.cos((54 + i * 72) * Math.PI / 180) * 6, c.y - Math.sin((54 + i * 72) * Math.PI / 180) * 6);
            }
            ctx.closePath();
            ctx.fillStyle = c.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = c.color;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });
        
        // Update helper message
        const statusMsg = document.getElementById('kmeans-status-msg');
        if (state === 'init') {
            statusMsg.textContent = 'Centroids placed randomly. Click Step to assign points.';
        } else if (state === 'assign') {
            statusMsg.textContent = 'Points assigned to their nearest centroid. Click Step to move centroids.';
        } else if (state === 'move') {
            statusMsg.textContent = 'Centroids moved to mean center of their cluster. Click Step to re-assign.';
        }
    }
    
    document.getElementById('kmeans-k-slider').oninput = (e) => {
        document.getElementById('kmeans-k-val').textContent = e.target.value;
        initData();
    };
    
    document.getElementById('kmeans-reset-btn').onclick = initData;
    
    document.getElementById('kmeans-step-btn').onclick = () => {
        if (state === 'init' || state === 'move') {
            // Assign points to nearest centroid
            points.forEach(p => {
                let minDist = Infinity;
                let nearestIdx = 0;
                centroids.forEach((c, idx) => {
                    const dist = (p.x - c.x)**2 + (p.y - c.y)**2;
                    if (dist < minDist) {
                        minDist = dist;
                        nearestIdx = idx;
                    }
                });
                p.centroidIndex = nearestIdx;
            });
            state = 'assign';
        } else {
            // Move centroids to mean of assigned points
            centroids.forEach((c, idx) => {
                const assignedPoints = points.filter(p => p.centroidIndex === idx);
                if (assignedPoints.length > 0) {
                    let sumX = 0, sumY = 0;
                    assignedPoints.forEach(ap => {
                        sumX += ap.x;
                        sumY += ap.y;
                    });
                    c.x = sumX / assignedPoints.length;
                    c.y = sumY / assignedPoints.length;
                }
            });
            state = 'move';
        }
        draw();
    };
    
    initData();
}

// 9. Reinforcement Learning - Grid World
function initGridWorldDemo() {
    const worldContainer = document.getElementById('gridworld-grid');
    if (!worldContainer) return;
    
    const size = 4;
    let agentPos = {x: 0, y: 0}; // S
    const obstaclePos = [{x: 1, y: 1}, {x: 2, y: 2}]; // X
    const goalPos = {x: 3, y: 3}; // G
    
    let reward = 0;
    
    // Q-Table initialization (4x4 cells, 4 actions: UP, DOWN, LEFT, RIGHT)
    let qTable = {};
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            qTable[`${r},${c}`] = [0, 0, 0, 0]; // [U, D, L, R]
        }
    }
    
    function draw() {
        worldContainer.innerHTML = '';
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const cell = document.createElement('div');
                cell.className = 'gridworld-cell';
                
                // Set text / agent mapping
                if (r === agentPos.y && c === agentPos.x) {
                    cell.classList.add('active-agent');
                    cell.textContent = '🤖';
                } else if (r === goalPos.y && c === goalPos.x) {
                    cell.classList.add('goal');
                    cell.textContent = 'G';
                } else if (obstaclePos.some(o => o.x === c && o.y === r)) {
                    cell.classList.add('obstacle');
                    cell.textContent = 'X';
                } else if (r === 0 && c === 0) {
                    cell.classList.add('start');
                    cell.textContent = 'S';
                } else {
                    cell.textContent = '.';
                }
                
                // Show Q-value estimate
                const maxQ = Math.max(...qTable[`${r},${c}`]);
                if (maxQ !== 0) {
                    const qElem = document.createElement('div');
                    qElem.className = 'q-value';
                    qElem.textContent = maxQ.toFixed(1);
                    cell.appendChild(qElem);
                }
                
                worldContainer.appendChild(cell);
            }
        }
        document.getElementById('grid-reward-display').textContent = `Total Reward: ${reward}`;
    }
    
    function moveAgent(dx, dy) {
        const newX = Math.max(0, Math.min(size - 1, agentPos.x + dx));
        const newY = Math.max(0, Math.min(size - 1, agentPos.y + dy));
        
        // Check Obstacle
        if (obstaclePos.some(o => o.x === newX && o.y === newY)) {
            reward -= 5;
            notificationManager.error('Ouch! Obstacle hit (-5 Reward)');
            return;
        }
        
        agentPos.x = newX;
        agentPos.y = newY;
        
        if (agentPos.x === goalPos.x && agentPos.y === goalPos.y) {
            reward += 10;
            notificationManager.success('Goal Reached! (+10 Reward)');
            setTimeout(() => {
                agentPos = {x: 0, y: 0};
                draw();
            }, 800);
        } else {
            reward -= 1; // move penalty
        }
        draw();
    }
    
    document.getElementById('gw-up').onclick = () => moveAgent(0, -1);
    document.getElementById('gw-down').onclick = () => moveAgent(0, 1);
    document.getElementById('gw-left').onclick = () => moveAgent(-1, 0);
    document.getElementById('gw-right').onclick = () => moveAgent(1, 0);
    
    // Q-Learning Training Loop
    document.getElementById('gw-train-btn').onclick = () => {
        let alpha = 0.5; // learning rate
        let gamma = 0.9; // discount factor
        let epsilon = 0.3; // exploration
        
        // Run 50 training episodes in background
        for (let ep = 0; ep < 150; ep++) {
            let s = {x: 0, y: 0};
            while (s.x !== goalPos.x || s.y !== goalPos.y) {
                // Epsilon-greedy action selection
                let actionIdx = 0;
                if (Math.random() < epsilon) {
                    actionIdx = Math.floor(Math.random() * 4);
                } else {
                    actionIdx = qTable[`${s.y},${s.x}`].indexOf(Math.max(...qTable[`${s.y},${s.x}`]));
                }
                
                // Execute action
                let dx = 0, dy = 0;
                if (actionIdx === 0) dy = -1; // UP
                else if (actionIdx === 1) dy = 1; // DOWN
                else if (actionIdx === 2) dx = -1; // LEFT
                else if (actionIdx === 3) dx = 1; // RIGHT
                
                const nextX = Math.max(0, Math.min(size - 1, s.x + dx));
                const nextY = Math.max(0, Math.min(size - 1, s.y + dy));
                
                let r = -1;
                if (nextX === goalPos.x && nextY === goalPos.y) r = 10;
                else if (obstaclePos.some(o => o.x === nextX && o.y === nextY)) r = -5;
                
                // Q-Update
                const currentQ = qTable[`${s.y},${s.x}`][actionIdx];
                const nextMaxQ = obstaclePos.some(o => o.x === nextX && o.y === nextY) ? 0 : Math.max(...qTable[`${nextY},${nextX}`]);
                
                qTable[`${s.y},${s.x}`][actionIdx] = currentQ + alpha * (r + gamma * nextMaxQ - currentQ);
                
                // Move state
                if (!obstaclePos.some(o => o.x === nextX && o.y === nextY)) {
                    s.x = nextX;
                    s.y = nextY;
                } else {
                    break; // terminate episode on block
                }
            }
        }
        
        notificationManager.success('Q-Learning completed. Values shown in cells!');
        // Animate Agent optimal route trace
        agentPos = {x: 0, y: 0};
        draw();
        
        let pathInterval = setInterval(() => {
            const stateKey = `${agentPos.y},${agentPos.x}`;
            const optimalActionIdx = qTable[stateKey].indexOf(Math.max(...qTable[stateKey]));
            
            let dx = 0, dy = 0;
            if (optimalActionIdx === 0) dy = -1;
            else if (optimalActionIdx === 1) dy = 1;
            else if (optimalActionIdx === 2) dx = -1;
            else if (optimalActionIdx === 3) dx = 1;
            
            moveAgent(dx, dy);
            
            if (agentPos.x === goalPos.x && agentPos.y === goalPos.y) {
                clearInterval(pathInterval);
            }
        }, 600);
    };
    
    draw();
}

// 10. Confusion Matrix Model Evaluation
function initConfusionMatrixDemo() {
    const inputs = ['tp-in', 'fp-in', 'fn-in', 'tn-in'];
    
    function recalculate() {
        const tp = parseInt(document.getElementById('tp-in').value) || 0;
        const fp = parseInt(document.getElementById('fp-in').value) || 0;
        const fn = parseInt(document.getElementById('fn-in').value) || 0;
        const tn = parseInt(document.getElementById('tn-in').value) || 0;
        
        const total = tp + fp + fn + tn;
        
        const accuracy = total > 0 ? (tp + tn) / total : 0;
        const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
        const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
        
        const f1 = (precision + recall) > 0 ? 2 * (precision * recall) / (precision + recall) : 0;
        
        document.getElementById('cm-accuracy').textContent = `${(accuracy * 100).toFixed(1)}%`;
        document.getElementById('cm-precision').textContent = `${(precision * 100).toFixed(1)}%`;
        document.getElementById('cm-recall').textContent = `${(recall * 100).toFixed(1)}%`;
        document.getElementById('cm-f1').textContent = f1.toFixed(3);
        
        // Heatmap updates
        document.getElementById('cell-tp').style.background = `rgba(82, 244, 123, ${Math.min(tp / total || 0, 0.6)})`;
        document.getElementById('cell-tn').style.background = `rgba(82, 244, 123, ${Math.min(tn / total || 0, 0.6)})`;
        document.getElementById('cell-fp').style.background = `rgba(139, 92, 246, ${Math.min(fp / total || 0, 0.6)})`;
        document.getElementById('cell-fn').style.background = `rgba(139, 92, 246, ${Math.min(fn / total || 0, 0.6)})`;
    }
    
    inputs.forEach(id => {
        const inputElem = document.getElementById(id);
        if (inputElem) {
            inputElem.oninput = recalculate;
        }
    });
    
    recalculate();
}

// 11. Activation Playground & Live Neuron
function initActivationPlayground() {
    const canvas = document.getElementById('act-playground-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let chartInstance = null;
    
    function drawChart() {
        const selected = document.getElementById('act-select').value;
        const xVal = [];
        const yVal = [];
        
        let formula = "";
        
        for (let x = -5; x <= 5; x += 0.2) {
            xVal.push(x.toFixed(1));
            if (selected === 'sigmoid') {
                yVal.push(1 / (1 + Math.exp(-x)));
                formula = "f(x) = \\frac{1}{1 + e^{-x}}";
            } else if (selected === 'relu') {
                yVal.push(Math.max(0, x));
                formula = "f(x) = \\max(0, x)";
            } else if (selected === 'tanh') {
                yVal.push(Math.tanh(x));
                formula = "f(x) = \\tanh(x)";
            } else if (selected === 'leaky') {
                yVal.push(x >= 0 ? x : 0.1 * x);
                formula = "f(x) = \\max(0.1x, x)";
            }
        }
        
        document.getElementById('act-formula').textContent = formula;
        
        if (chartInstance) chartInstance.destroy();
        
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xVal,
                datasets: [{
                    label: selected.toUpperCase(),
                    data: yVal,
                    borderColor: '#52f47b',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#aaa' }, grid: { color: '#222' } },
                    y: { ticks: { color: '#aaa' }, grid: { color: '#222' } }
                }
            }
        });
    }
    
    document.getElementById('act-select').onchange = drawChart;
    
    // Live Neuron sliders update
    const sliders = ['neu-x1', 'neu-x2', 'neu-w1', 'neu-w2'];
    function updateNeuron() {
        const x1 = parseFloat(document.getElementById('neu-x1').value);
        const x2 = parseFloat(document.getElementById('neu-x2').value);
        const w1 = parseFloat(document.getElementById('neu-w1').value);
        const w2 = parseFloat(document.getElementById('neu-w2').value);
        
        document.getElementById('neu-x1-val').textContent = x1.toFixed(1);
        document.getElementById('neu-x2-val').textContent = x2.toFixed(1);
        document.getElementById('neu-w1-val').textContent = w1.toFixed(1);
        document.getElementById('neu-w2-val').textContent = w2.toFixed(1);
        
        const sum = (x1 * w1) + (x2 * w2);
        const output = Math.max(0, sum); // ReLU
        
        document.getElementById('neuron-formula-flow').innerHTML = `
            Output = ReLU( (${x1.toFixed(1)} × ${w1.toFixed(1)}) + (${x2.toFixed(1)} × ${w2.toFixed(1)}) ) <br>
            Output = ReLU( ${sum.toFixed(2)} ) = <strong>${output.toFixed(2)}</strong>
        `;
    }
    
    sliders.forEach(id => document.getElementById(id).oninput = updateNeuron);
    
    drawChart();
    updateNeuron();
}

// 12. Deep Learning Feedforward Path
function initCNNFeedforward() {
    const btn = document.getElementById('cnn-feedforward-btn');
    if (!btn) return;
    
    const layerIds = ['box-input', 'box-conv', 'box-pool', 'box-pred'];
    
    btn.onclick = () => {
        btn.disabled = true;
        
        let step = 0;
        function pulseNext() {
            // Remove previous active
            layerIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('active-pulse');
            });
            
            if (step < layerIds.length) {
                const el = document.getElementById(layerIds[step]);
                if (el) el.classList.add('active-pulse');
                step++;
                setTimeout(pulseNext, 850);
            } else {
                btn.disabled = false;
                notificationManager.success('Feedforward pulse sequence complete!');
            }
        }
        pulseNext();
    };
}

// 13. Decision Tree splits and Entropy calculations
function initDecisionTreeDemo() {
    const entSlider = document.getElementById('ent-slider');
    const entPctVal = document.getElementById('ent-pct-val');
    const entFormulaVal = document.getElementById('ent-formula-val');
    const mixCanvas = document.getElementById('entropy-mix-canvas');
    const curveCanvas = document.getElementById('entropy-curve-canvas');
    
    if (!entSlider) return;
    
    function drawEntropy() {
        const pct = parseInt(entSlider.value);
        const p = pct / 100;
        entPctVal.textContent = `${pct}%`;
        
        let entropy = 0;
        if (p > 0 && p < 1) {
            entropy = -p * Math.log2(p) - (1-p) * Math.log2(1-p);
        }
        entFormulaVal.innerHTML = `Probability p = ${p.toFixed(2)} | Entropy H(p) = <strong>${entropy.toFixed(3)}</strong>`;
        
        if (mixCanvas) {
            const ctx = mixCanvas.getContext('2d');
            ctx.clearRect(0, 0, mixCanvas.width, mixCanvas.height);
            const totalDots = 30;
            const posDots = Math.round(totalDots * p);
            for (let i = 0; i < totalDots; i++) {
                const x = 20 + (i % 6) * 30;
                const y = 20 + Math.floor(i / 6) * 25;
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fillStyle = i < posDots ? '#8b5cf6' : '#52f47b';
                ctx.shadowBlur = 8;
                ctx.shadowColor = ctx.fillStyle;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
        
        if (curveCanvas) {
            const ctx = curveCanvas.getContext('2d');
            ctx.clearRect(0, 0, curveCanvas.width, curveCanvas.height);
            
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(30, 10);
            ctx.lineTo(30, 130);
            ctx.lineTo(270, 130);
            ctx.stroke();
            
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let px = 0; px <= 100; px += 2) {
                const pVal = px / 100;
                let hVal = 0;
                if (pVal > 0 && pVal < 1) {
                    hVal = -pVal * Math.log2(pVal) - (1-pVal) * Math.log2(1-pVal);
                }
                const screenX = 30 + pVal * 240;
                const screenY = 130 - hVal * 100;
                if (px === 0) ctx.moveTo(screenX, screenY);
                else ctx.lineTo(screenX, screenY);
            }
            ctx.stroke();
            
            const curX = 30 + p * 240;
            const curY = 130 - entropy * 100;
            ctx.beginPath();
            ctx.arc(curX, curY, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#52f47b';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#52f47b';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    entSlider.oninput = drawEntropy;
    drawEntropy();
    
    const splitBtn = document.getElementById('dt-split-btn');
    if (splitBtn) {
        splitBtn.onclick = () => {
            const feat = document.getElementById('dt-split-feat').value;
            const thresh = parseFloat(document.getElementById('dt-split-thresh').value) || 0;
            
            const dataset = [
                {Age: 20, Income: 30, Buy: 0},
                {Age: 22, Income: 45, Buy: 0},
                {Age: 25, Income: 25, Buy: 0},
                {Age: 28, Income: 80, Buy: 1},
                {Age: 32, Income: 55, Buy: 1},
                {Age: 35, Income: 90, Buy: 1},
                {Age: 40, Income: 40, Buy: 0},
                {Age: 45, Income: 70, Buy: 1},
                {Age: 50, Income: 35, Buy: 0},
                {Age: 60, Income: 85, Buy: 1}
            ];
            
            let left = [], right = [];
            dataset.forEach(d => {
                if (d[feat] <= thresh) left.push(d);
                else right.push(d);
            });
            
            function getEnt(arr) {
                const n = arr.length;
                if (n === 0) return 0;
                const pos = arr.filter(d => d.Buy === 1).length;
                const p = pos / n;
                if (p === 0 || p === 1) return 0;
                return -p * Math.log2(p) - (1-p) * Math.log2(1-p);
            }
            
            const parentEnt = getEnt(dataset);
            const leftEnt = getEnt(left);
            const rightEnt = getEnt(right);
            
            const infoGain = parentEnt - (left.length/dataset.length*leftEnt + right.length/dataset.length*rightEnt);
            
            document.getElementById('dt-split-results').innerHTML = `
                Parent: 10 samples (Entropy: ${parentEnt.toFixed(3)})<br>
                Left Child (≤ ${thresh}): <strong>${left.length}</strong> samples (Entropy: ${leftEnt.toFixed(3)})<br>
                Right Child (> ${thresh}): <strong>${right.length}</strong> samples (Entropy: ${rightEnt.toFixed(3)})<br>
                Information Gain: <span style="color:var(--secondary); font-weight:bold;">${infoGain.toFixed(4)}</span>
            `;
            notificationManager.success('Split computed successfully!');
        };
    }
}

// 14. Model Evaluation metrics & ROC Curves
function initModelEvaluationDemo() {
    const slider = document.getElementById('me-threshold-slider');
    if (!slider) return;
    
    function updateMetrics() {
        const threshold = parseFloat(slider.value);
        document.getElementById('me-threshold-val').textContent = threshold.toFixed(2);
        
        let tp = 0, fp = 0, fn = 0, tn = 0;
        
        for (let i = 0; i < 50; i++) {
            const sickScore = 0.4 + (Math.sin(i * 1.5) + 1) * 0.275;
            if (sickScore >= threshold) tp++;
            else fn++;
            
            const healthyScore = 0.05 + (Math.cos(i * 1.5) + 1) * 0.275;
            if (healthyScore >= threshold) fp++;
            else tn++;
        }
        
        const total = tp + fp + fn + tn;
        const accuracy = (tp + tn) / total;
        const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
        const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
        const f1 = (precision + recall) > 0 ? 2 * (precision * recall) / (precision + recall) : 0;
        
        document.getElementById('me-tp-val').textContent = tp;
        document.getElementById('me-fp-val').textContent = fp;
        document.getElementById('me-fn-val').textContent = fn;
        document.getElementById('me-tn-val').textContent = tn;
        
        document.getElementById('me-acc-disp').textContent = `${(accuracy * 100).toFixed(1)}%`;
        document.getElementById('me-prec-disp').textContent = `${(precision * 100).toFixed(1)}%`;
        document.getElementById('me-rec-disp').textContent = `${(recall * 100).toFixed(1)}%`;
        document.getElementById('me-f1-disp').textContent = f1.toFixed(3);
        
        document.getElementById('cell-tp').style.background = `rgba(82, 244, 123, ${Math.min(tp / 50, 0.6)})`;
        document.getElementById('cell-tn').style.background = `rgba(82, 244, 123, ${Math.min(tn / 50, 0.6)})`;
        document.getElementById('cell-fp').style.background = `rgba(139, 92, 246, ${Math.min(fp / 50, 0.6)})`;
        document.getElementById('cell-fn').style.background = `rgba(139, 92, 246, ${Math.min(fn / 50, 0.6)})`;
        
        const canvas = document.getElementById('roc-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(25, 15);
            ctx.lineTo(25, 195);
            ctx.lineTo(205, 195);
            ctx.stroke();
            
            ctx.fillStyle = '#666';
            ctx.font = '8px monospace';
            ctx.fillText('1.0', 8, 20);
            ctx.fillText('1.0', 198, 205);
            ctx.fillText('TPR', 10, 10);
            ctx.fillText('FPR', 185, 190);
            
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(25, 195);
            ctx.lineTo(205, 15);
            ctx.stroke();
            ctx.setLineDash([]);
            
            const pathPoints = [];
            for (let t = 0.0; t <= 1.0; t += 0.05) {
                let tempTp = 0, tempFp = 0, tempFn = 0, tempTn = 0;
                for (let i = 0; i < 50; i++) {
                    const sScore = 0.4 + (Math.sin(i * 1.5) + 1) * 0.275;
                    if (sScore >= t) tempTp++; else tempFn++;
                    const hScore = 0.05 + (Math.cos(i * 1.5) + 1) * 0.275;
                    if (hScore >= t) tempFp++; else tempTn++;
                }
                const tpr = tempTp / 50;
                const fpr = tempFp / 50;
                pathPoints.push({x: 25 + fpr * 180, y: 195 - tpr * 180});
            }
            
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(205, 15);
            pathPoints.sort((a,b) => b.x - a.x);
            pathPoints.forEach((p) => {
                ctx.lineTo(p.x, p.y);
            });
            ctx.lineTo(25, 195);
            ctx.stroke();
            
            const curFpr = fp / 50;
            const curTpr = tp / 50;
            const screenX = 25 + curFpr * 180;
            const screenY = 195 - curTpr * 180;
            
            ctx.beginPath();
            ctx.arc(screenX, screenY, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#52f47b';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#52f47b';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    slider.oninput = updateMetrics;
    updateMetrics();
}

// 15. Tensor Rank visual updates
function initTensorDemo() {
    const slider = document.getElementById('tensor-rank-slider');
    if (!slider) return;
    
    const rankTag = document.getElementById('tensor-rank-tag');
    const rankDesc = document.getElementById('tensor-rank-desc');
    const wrapper = document.getElementById('tensor-visual-wrapper');
    
    function update() {
        const rank = parseInt(slider.value);
        if (rank === 0) {
            rankTag.textContent = '0D Scalar (Rank 0)';
            rankDesc.textContent = 'A single numerical value with zero axes. Example: X = 5. Used for hyperparameter scalars.';
            wrapper.innerHTML = '<div class="cyber-result" style="font-size:2.5rem; font-family:monospace; padding:20px; font-weight:bold; box-shadow:0 0 15px var(--secondary); color:var(--secondary);">5</div>';
        } else if (rank === 1) {
            rankTag.textContent = '1D Vector (Rank 1)';
            rankDesc.textContent = 'A single-axis array. Example: X = [1.2, -0.4, 3.1]. Used to represent single feature samples.';
            wrapper.innerHTML = '<div class="cyber-result" style="font-size:1.3rem; font-family:monospace; padding:15px; border: 1px solid var(--border);">[ 1.2, -0.4, 3.1, 0.8, -2.5 ]</div>';
        } else if (rank === 2) {
            rankTag.textContent = '2D Matrix (Rank 2)';
            rankDesc.textContent = 'A double-axis grid table (Rows × Columns). Used to represent batched features or weights layers.';
            wrapper.innerHTML = `
                <div class="cyber-result" style="font-family:monospace; font-size:0.9rem; padding:15px; border: 1px solid var(--border); line-height:1.4;">
                    [ [ 1.0,  0.5, -0.2 ],<br>
                    &nbsp;&nbsp;[ 0.0, -1.2,  0.8 ],<br>
                    &nbsp;&nbsp;[ 2.5,  0.3, -1.1 ] ]
                </div>
            `;
        } else if (rank === 3) {
            rankTag.textContent = '3D Tensor (Rank 3)';
            rankDesc.textContent = 'A multi-channel matrix stack (Channels × Rows × Columns). Example: RGB images. Rotates in 3D.';
            wrapper.innerHTML = `
                <div class="tensor-container">
                    <div class="cube-wrapper">
                        <div class="cube">
                            <div class="cube-face front">3D Tensor</div>
                            <div class="cube-face back">Depth</div>
                            <div class="cube-face right">Width</div>
                            <div class="cube-face left">Height</div>
                            <div class="cube-face top">Matrix Array</div>
                            <div class="cube-face bottom">Channels</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    slider.oninput = update;
    update();
}

// 16. Preprocessing scale visualizer
function initPreprocessingDemo() {
    const canvas = document.getElementById('pre-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let baseData = [
        {x: 1200, y: 1.5},
        {x: 2000, y: 2.2},
        {x: 1800, y: 3.8},
        {x: 3500, y: 1.1},
        {x: 4200, y: 4.5},
        {x: 2800, y: 2.8},
        {x: 3100, y: 3.1},
        {x: 4800, y: 4.8},
        {x: 1500, y: 1.2},
        {x: 2200, y: 3.5}
    ];
    let currentData = JSON.parse(JSON.stringify(baseData));
    let mode = 'raw';
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(35, 10); ctx.lineTo(35, 215); ctx.lineTo(335, 215);
        ctx.stroke();
        
        let minX = 0, maxX = 6000, minY = 0, maxY = 6;
        if (mode === 'standard') {
            minX = -2.5; maxX = 2.5; minY = -2.5; maxY = 2.5;
        } else if (mode === 'normal') {
            minX = -0.2; maxX = 1.2; minY = -0.2; maxY = 1.2;
        }
        
        function toScreen(x, y) {
            const sx = 35 + ((x - minX) / (maxX - minX)) * 280;
            const sy = 215 - ((y - minY) / (maxY - minY)) * 190;
            return {x: sx, y: sy};
        }
        
        currentData.forEach(p => {
            const s = toScreen(p.x, p.y);
            ctx.beginPath();
            ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#52f47b';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#52f47b';
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }
    
    document.getElementById('pre-standardize-btn').onclick = () => {
        mode = 'standard';
        let sumX = 0, sumY = 0;
        baseData.forEach(p => { sumX += p.x; sumY += p.y; });
        const meanX = sumX / baseData.length;
        const meanY = sumY / baseData.length;
        
        let varX = 0, varY = 0;
        baseData.forEach(p => {
            varX += (p.x - meanX) ** 2;
            varY += (p.y - meanY) ** 2;
        });
        const stdX = Math.sqrt(varX / baseData.length);
        const stdY = Math.sqrt(varY / baseData.length);
        
        currentData = baseData.map(p => ({
            x: (p.x - meanX) / stdX,
            y: (p.y - meanY) / stdY
        }));
        document.getElementById('pre-stats-display').innerHTML = `
            Standardized (Z-Score) <br> Mean = 0.00 | StdDev = 1.00
        `;
        draw();
    };
    
    document.getElementById('pre-normalize-btn').onclick = () => {
        mode = 'normal';
        const xs = baseData.map(p => p.x);
        const ys = baseData.map(p => p.y);
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...ys), maxY = Math.max(...ys);
        
        currentData = baseData.map(p => ({
            x: (p.x - minX) / (maxX - minX),
            y: (p.y - minY) / (maxY - minY)
        }));
        document.getElementById('pre-stats-display').innerHTML = `
            Normalized (Min-Max) <br> Bounds: X ∈ [0, 1], Y ∈ [0, 1]
        `;
        draw();
    };
    
    document.getElementById('pre-reset-btn').onclick = () => {
        mode = 'raw';
        currentData = JSON.parse(JSON.stringify(baseData));
        document.getElementById('pre-stats-display').innerHTML = `
            Raw - X Range: [1000, 5000], Y Range: [1, 5]
        `;
        draw();
    };
    
    draw();
}

// 17. Genetic Algorithm chromosome evolution
function initGeneticDemo() {
    const popContainer = document.getElementById('ga-population');
    if (!popContainer) return;
    
    let population = [
        '10001100',
        '00101010',
        '11000100',
        '01010101',
        '00001111',
        '11110000'
    ];
    let generation = 0;
    
    function getFitness(chrom) {
        return (chrom.match(/1/g) || []).length;
    }
    
    function draw() {
        popContainer.innerHTML = '';
        let sumFit = 0;
        
        population.forEach((chrom, idx) => {
            const fit = getFitness(chrom);
            sumFit += fit;
            
            const row = document.createElement('div');
            row.style.cssText = 'display:flex; justify-content:space-between; border:1px solid var(--border); padding:5px; background:rgba(0,0,0,0.2);';
            row.innerHTML = `
                <span>Indiv ${idx+1}: <span style="color:var(--secondary); font-family:monospace;">${chrom}</span></span>
                <span>Fit: ${fit}</span>
            `;
            popContainer.appendChild(row);
        });
        
        const avg = sumFit / population.length;
        document.getElementById('ga-info-display').innerHTML = `
            Gen: <strong>${generation}</strong> | Avg Fitness: <strong>${avg.toFixed(1)}</strong> / 8
        `;
    }
    
    document.getElementById('ga-step-btn').onclick = () => {
        generation++;
        
        const selected = [];
        for (let i = 0; i < population.length; i++) {
            const idx1 = Math.floor(Math.random() * population.length);
            const idx2 = Math.floor(Math.random() * population.length);
            const chosen = getFitness(population[idx1]) >= getFitness(population[idx2]) ? population[idx1] : population[idx2];
            selected.push(chosen);
        }
        
        const nextPop = [];
        for (let i = 0; i < selected.length; i += 2) {
            const parent1 = selected[i];
            const parent2 = selected[i+1] || selected[0];
            
            const split = 4;
            const child1 = parent1.substring(0, split) + parent2.substring(split);
            const child2 = parent2.substring(0, split) + parent1.substring(split);
            nextPop.push(child1);
            nextPop.push(child2);
        }
        
        population = nextPop.map(chrom => {
            let chars = chrom.split('');
            if (Math.random() < 0.25) {
                const flipIdx = Math.floor(Math.random() * 8);
                chars[flipIdx] = chars[flipIdx] === '1' ? '0' : '1';
            }
            return chars.join('');
        });
        
        notificationManager.success('Gen advanced! Selection, Crossover & Mutation run.');
        draw();
    };
    
    document.getElementById('ga-reset-btn').onclick = () => {
        generation = 0;
        population = [
            '10001100',
            '00101010',
            '11000100',
            '01010101',
            '00001111',
            '11110000'
        ];
        draw();
    };
    
    draw();
}

// 18. Particle Swarm Optimization
function initPSODemo() {
    const canvas = document.getElementById('pso-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const target = {x: 175, y: 125};
    let gBest = null;
    let iteration = 0;
    
    function initSwarm() {
        particles = [];
        gBest = null;
        iteration = 0;
        
        for (let i = 0; i < 15; i++) {
            const p = {
                x: 20 + Math.random() * (canvas.width - 40),
                y: 20 + Math.random() * (canvas.height - 40),
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5
            };
            p.pBestX = p.x;
            p.pBestY = p.y;
            p.bestScore = Math.hypot(p.x - target.x, p.y - target.y);
            particles.push(p);
        }
        updateGBest();
        draw();
    }
    
    function updateGBest() {
        particles.forEach(p => {
            const score = Math.hypot(p.x - target.x, p.y - target.y);
            if (score < p.bestScore) {
                p.bestScore = score;
                p.pBestX = p.x;
                p.pBestY = p.y;
            }
            if (!gBest || score < Math.hypot(gBest.x - target.x, gBest.y - target.y)) {
                gBest = {x: p.x, y: p.y};
            }
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1.5;
        for (let r = 30; r < 200; r += 30) {
            ctx.beginPath();
            ctx.arc(target.x, target.y, r, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(target.x, target.y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#52f47b';
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#52f47b';
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        
        document.getElementById('pso-status-msg').innerHTML = `
            Iteration: <strong>${iteration}</strong> | Global Best Dist: <strong>${Math.hypot(gBest.x - target.x, gBest.y - target.y).toFixed(1)}px</strong>
        `;
    }
    
    document.getElementById('pso-step-btn').onclick = () => {
        iteration++;
        const w = 0.5;
        const c1 = 1.5;
        const c2 = 1.5;
        
        particles.forEach(p => {
            const r1 = Math.random();
            const r2 = Math.random();
            
            p.vx = w * p.vx + c1 * r1 * (p.pBestX - p.x) + c2 * r2 * (gBest.x - p.x);
            p.vy = w * p.vy + c1 * r1 * (p.pBestY - p.y) + c2 * r2 * (gBest.y - p.y);
            
            p.x = Math.max(10, Math.min(canvas.width - 10, p.x + p.vx));
            p.y = Math.max(10, Math.min(canvas.height - 10, p.y + p.vy));
        });
        
        updateGBest();
        draw();
    };
    
    document.getElementById('pso-reset-btn').onclick = initSwarm;
    initSwarm();
}

// 19. Ant Colony Optimization
function initACODemo() {
    const canvas = document.getElementById('aco-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const startNode = {x: 50, y: 125};
    const endNode = {x: 300, y: 125};
    
    let pheromoneShort = 1.0;
    let pheromoneLong = 1.0;
    let iteration = 0;
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw Long Path (top arc) — purple
        ctx.beginPath();
        ctx.moveTo(startNode.x, startNode.y);
        ctx.quadraticCurveTo(175, 20, endNode.x, endNode.y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${Math.min(0.15 + pheromoneLong * 0.1, 0.9)})`;
        ctx.lineWidth = 2 + pheromoneLong * 1.5;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw Short Path (straight) — green
        ctx.beginPath();
        ctx.moveTo(startNode.x, startNode.y);
        ctx.lineTo(endNode.x, endNode.y);
        ctx.strokeStyle = `rgba(82, 244, 123, ${Math.min(0.15 + pheromoneShort * 0.1, 0.9)})`;
        ctx.lineWidth = 2 + pheromoneShort * 1.5;
        ctx.stroke();
        
        // Path labels
        ctx.font = '11px monospace';
        ctx.fillStyle = '#8b5cf6';
        ctx.fillText('Long Path (distance: 350)', 115, 45);
        ctx.fillStyle = '#52f47b';
        ctx.fillText('Short Path (distance: 250)', 110, 115);
        
        // Draw nodes
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath(); ctx.arc(startNode.x, startNode.y, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#52f47b';
        ctx.beginPath(); ctx.arc(endNode.x, endNode.y, 10, 0, Math.PI * 2); ctx.fill();
        
        // Node labels
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('🏠 Nest', startNode.x, startNode.y + 24);
        ctx.fillText('🍎 Food', endNode.x, endNode.y + 24);
        ctx.textAlign = 'left';
        
        document.getElementById('aco-status-msg').innerHTML = `
            Step: <strong>${iteration}</strong> | Pheromone Short: <strong>${pheromoneShort.toFixed(1)}</strong> | Long: <strong>${pheromoneLong.toFixed(1)}</strong>
        `;
    }
    
    document.getElementById('aco-step-btn').onclick = () => {
        iteration++;
        
        pheromoneShort *= 0.8;
        pheromoneLong *= 0.8;
        
        const totalP = pheromoneShort + pheromoneLong;
        const probShort = pheromoneShort / totalP;
        
        for (let i = 0; i < 10; i++) {
            if (Math.random() < probShort) {
                pheromoneShort += 0.5;
            } else {
                pheromoneLong += 0.25;
            }
        }
        
        draw();
    };
    
    document.getElementById('aco-reset-btn').onclick = () => {
        iteration = 0;
        pheromoneShort = 1.0;
        pheromoneLong = 1.0;
        draw();
    };
    
    draw();
}

// 20. Fuzzy Logic membership visualizer
function initFuzzyDemo() {
    const canvas = document.getElementById('fuzzy-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('fuzzy-age-slider');
    
    function getMembership(age) {
        let young = 0;
        if (age <= 25) young = 1;
        else if (age > 25 && age < 45) young = (45 - age) / 20;
        
        let adult = 0;
        if (age > 30 && age <= 50) adult = (age - 30) / 20;
        else if (age > 50 && age < 70) adult = (70 - age) / 20;
        
        let old = 0;
        if (age >= 75) old = 1;
        else if (age > 55 && age < 75) old = (age - 55) / 20;
        
        return {young, adult, old};
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(25, 30); ctx.lineTo(25 + 25*2.8, 30); ctx.lineTo(25 + 45*2.8, 150);
        ctx.stroke();
        
        ctx.strokeStyle = '#52f47b'; ctx.beginPath();
        ctx.moveTo(25 + 30*2.8, 150); ctx.lineTo(25 + 50*2.8, 30); ctx.lineTo(25 + 70*2.8, 150);
        ctx.stroke();
        
        ctx.strokeStyle = '#f59e0b'; ctx.beginPath();
        ctx.moveTo(25 + 55*2.8, 150); ctx.lineTo(25 + 75*2.8, 30); ctx.lineTo(25 + 100*2.8, 30);
        ctx.stroke();
        
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5; ctx.beginPath();
        ctx.moveTo(25, 15); ctx.lineTo(25, 150); ctx.lineTo(325, 150);
        ctx.stroke();
        
        const age = parseInt(slider.value);
        document.getElementById('fuzzy-age-val').textContent = age;
        
        const m = getMembership(age);
        const screenX = 25 + age * 2.8;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(screenX, 15); ctx.lineTo(screenX, 150); ctx.stroke();
        
        const yYoung = 150 - m.young * 120;
        const yAdult = 150 - m.adult * 120;
        const yOld = 150 - m.old * 120;
        
        if (m.young > 0) { ctx.beginPath(); ctx.arc(screenX, yYoung, 4, 0, Math.PI*2); ctx.fillStyle='#8b5cf6'; ctx.fill(); }
        if (m.adult > 0) { ctx.beginPath(); ctx.arc(screenX, yAdult, 4, 0, Math.PI*2); ctx.fillStyle='#52f47b'; ctx.fill(); }
        if (m.old > 0) { ctx.beginPath(); ctx.arc(screenX, yOld, 4, 0, Math.PI*2); ctx.fillStyle='#f59e0b'; ctx.fill(); }
        
        document.getElementById('fuzzy-outputs-display').innerHTML = `
            Fuzzy Set Membership Values for Age <strong>${age}</strong>:<br>
            <span style="color:#8b5cf6;">Young: ${m.young.toFixed(2)}</span> | 
            <span style="color:#52f47b;">Adult: ${m.adult.toFixed(2)}</span> | 
            <span style="color:#f59e0b;">Old: ${m.old.toFixed(2)}</span>
        `;
    }
    
    slider.oninput = draw;
    draw();
}

// 21. Forward Chaining Rule System
function initRuleSystemDemo() {
    let facts = ['A', 'B'];
    let rules = [
        {id: 'R1', cond: ['A', 'B'], out: 'C'},
        {id: 'R2', cond: ['C'], out: 'D'}
    ];
    
    function draw() {
        document.getElementById('rule-facts-box').innerHTML = facts.join(', ');
        
        let ruleHtml = '';
        rules.forEach(r => {
            const met = r.cond.every(c => facts.includes(c));
            const color = facts.includes(r.out) ? 'var(--secondary)' : met ? '#ffb703' : '#666';
            ruleHtml += `<span style="color:${color}">${r.id}: ${r.cond.join(' & ')} → ${r.out}</span><br>`;
        });
        document.getElementById('rule-rules-box').innerHTML = ruleHtml;
    }
    
    document.getElementById('rule-chain-btn').onclick = () => {
        let triggered = false;
        for (let i = 0; i < rules.length; i++) {
            const r = rules[i];
            const condMet = r.cond.every(c => facts.includes(c));
            if (condMet && !facts.includes(r.out)) {
                facts.push(r.out);
                document.getElementById('rule-log-display').innerHTML = `
                    Rule <strong style="color:var(--secondary);">${r.id}</strong> triggered! Inferred fact <strong style="color:var(--secondary);">${r.out}</strong>.
                `;
                triggered = true;
                break;
            }
        }
        
        if (!triggered) {
            document.getElementById('rule-log-display').textContent = 'No more rules can be triggered. Fact base saturated!';
        }
        draw();
    };
    
    document.getElementById('rule-reset-btn').onclick = () => {
        facts = ['A', 'B'];
        document.getElementById('rule-log-display').textContent = 'Facts reset to initial values [A, B].';
        draw();
    };
    
    draw();
}

// 22. DFS/BFS Search Strategies
function initSearchDemo() {
    const canvas = document.getElementById('search-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const size = 5;
    const cellSize = 50;
    
    const grid = [
        [0, 0, 0, 0, 0],
        [1, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0]
    ];
    
    const start = {r: 0, c: 0};
    const target = {r: 4, c: 4};
    
    let visited = [];
    let searchInterval = null;
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                ctx.strokeStyle = '#222';
                ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
                
                if (grid[r][c] === 1) {
                    ctx.fillStyle = 'rgba(139, 92, 246, 0.35)';
                    ctx.fillRect(c * cellSize + 2, r * cellSize + 2, cellSize - 4, cellSize - 4);
                } else if (visited.some(v => v.r === r && v.c === c)) {
                    ctx.fillStyle = 'rgba(82, 244, 123, 0.4)';
                    ctx.fillRect(c * cellSize + 2, r * cellSize + 2, cellSize - 4, cellSize - 4);
                }
                
                if (r === start.r && c === start.c) {
                    ctx.fillStyle = '#52f47b';
                    ctx.font = 'bold 12px monospace';
                    ctx.fillText('S', c * cellSize + 20, r * cellSize + 30);
                } else if (r === target.r && c === target.c) {
                    ctx.fillStyle = '#8b5cf6';
                    ctx.font = 'bold 12px monospace';
                    ctx.fillText('G', c * cellSize + 20, r * cellSize + 30);
                }
            }
        }
    }
    
    function runSearch() {
        if (searchInterval) clearInterval(searchInterval);
        visited = [];
        
        const type = document.getElementById('search-type-select').value;
        let frontier = [ {r: start.r, c: start.c} ];
        
        searchInterval = setInterval(() => {
            if (frontier.length === 0) {
                clearInterval(searchInterval);
                document.getElementById('search-info-display').textContent = 'Search Saturation: Target unreachable!';
                return;
            }
            
            let current;
            if (type === 'bfs') {
                current = frontier.shift();
            } else {
                current = frontier.pop();
            }
            
            if (!visited.some(v => v.r === current.r && v.c === current.c)) {
                visited.push({r: current.r, c: current.c});
            }
            
            draw();
            
            if (current.r === target.r && current.c === target.c) {
                clearInterval(searchInterval);
                document.getElementById('search-info-display').innerHTML = `
                    Target found! Visited cells count: <strong style="color:var(--secondary);">${visited.length}</strong>
                `;
                notificationManager.success('Search target reached!');
                return;
            }
            
            const dirs = [ {dr: 1, dc: 0}, {dr: 0, dc: 1}, {dr: -1, dc: 0}, {dr: 0, dc: -1} ];
            dirs.forEach(d => {
                const nr = current.r + d.dr;
                const nc = current.c + d.dc;
                
                if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === 0) {
                    if (!visited.some(v => v.r === nr && v.c === nc) && !frontier.some(f => f.r === nr && f.c === nc)) {
                        frontier.push({r: nr, c: nc});
                    }
                }
            });
            
            document.getElementById('search-info-display').textContent = `
                Active frontier count: ${frontier.length} cells
            `;
            
        }, 350);
    }
    
    document.getElementById('search-animate-btn').onclick = runSearch;
    document.getElementById('search-reset-btn').onclick = () => {
        if (searchInterval) clearInterval(searchInterval);
        visited = [];
        document.getElementById('search-info-display').textContent = 'Grid maze initialized. Press Run.';
        draw();
    };
    
    draw();
} 