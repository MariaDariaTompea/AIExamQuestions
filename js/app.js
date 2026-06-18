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