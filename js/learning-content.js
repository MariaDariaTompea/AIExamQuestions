// Enhanced Learning Content for AI Concepts

function getTopicContentHTML(topicKey) {
    const topics = {
        'neural-networks': `
            <div class="topic-card cyberpunk-card">
                <h2>Neural Networks & Perceptrons</h2>
                
                <h3>What is a Perceptron?</h3>
                <p>A perceptron is the simplest form of artificial neural network, consisting of a single neuron that makes binary decisions. It takes multiple inputs, applies weights, and produces a single binary output.</p>
                
                <div class="interactive-diagram">
                    <div class="network-node input-node" style="animation-delay: 0s">x1</div>
                    <div class="network-node input-node" style="animation-delay: 0.2s">x2</div>
                    <div class="network-line"></div>
                    <div class="network-node hidden-node" style="animation-delay: 0.4s">Σ</div>
                    <div class="network-line"></div>
                    <div class="network-node output-node" style="animation-delay: 0.6s">y</div>
                </div>

                <div class="concept-box">
                    <h4>Key Components of a Perceptron</h4>
                    <ul>
                        <li><strong>Inputs (x1, x2, ..., xn):</strong> The features or data points</li>
                        <li><strong>Weights (w1, w2, ..., wn):</strong> Learned parameters that determine importance</li>
                        <li><strong>Bias (b):</strong> An additional parameter that shifts the decision boundary</li>
                        <li><strong>Activation Function:</strong> Determines the output based on the weighted sum</li>
                    </ul>
                </div>

                <h3>How Does a Perceptron Work?</h3>
                <p>The perceptron computes a weighted sum of inputs plus bias, then applies an activation function:</p>
                <div class="cyber-formula">Output = f(w1x1 + w2x2 + ... + wnxn + b)</div>
                
                <div class="playground-box">
                    <h4>Interactive Perceptron</h4>
                    <p>Adjust the weights to see the output change (assuming input x1=1, x2=0, bias=0.1):</p>
                    <label>w1: <input type="range" id="w1-slider" min="-1" max="1" step="0.1" value="0.5" oninput="updatePerceptron()"></label> <span id="w1-val">0.5</span><br>
                    <label>w2: <input type="range" id="w2-slider" min="-1" max="1" step="0.1" value="-0.3" oninput="updatePerceptron()"></label> <span id="w2-val">-0.3</span>
                    <div class="cyber-result" id="perceptron-result">Output: 1 (Sum: 0.6)</div>
                </div>
            </div>
        `,
        'machine-learning': `
            <div class="topic-card cyberpunk-card">
                <h2>Machine Learning Fundamentals</h2>
                
                <h3>What is Machine Learning?</h3>
                <p>Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.</p>
                
                <div class="data-graph-container">
                    <canvas id="ml-chart"></canvas>
                </div>

                <div class="concept-box">
                    <h4>Supervised Learning Problems</h4>
                    <ul>
                        <li><strong>Classification:</strong> Predicting discrete categories</li>
                        <li><strong>Regression:</strong> Predicting continuous values</li>
                        <li><strong>Planning:</strong> Sequential decision making</li>
                    </ul>
                </div>
            </div>
        `,
        'decision-trees': `
            <div class="topic-card cyberpunk-card">
                <h2>Decision Trees</h2>
                
                <h3>What are Decision Trees?</h3>
                <p>Decision trees are hierarchical models that make decisions by splitting data based on feature values. They create a tree-like structure of decision rules leading to predictions.</p>
                
                <div class="tree-diagram">
                    <div class="tree-node root-node">Feature A > 5?</div>
                    <div class="tree-branches">
                        <div class="tree-branch">
                            <div class="tree-label">Yes</div>
                            <div class="tree-node leaf-node correct">Class 1</div>
                        </div>
                        <div class="tree-branch">
                            <div class="tree-label">No</div>
                            <div class="tree-node leaf-node wrong">Class 2</div>
                        </div>
                    </div>
                </div>

                <div class="concept-box">
                    <h4>Tree Components</h4>
                    <ul>
                        <li><strong>Root Node:</strong> Starting point with entire dataset</li>
                        <li><strong>Internal Nodes:</strong> Decision points based on feature tests</li>
                        <li><strong>Leaves:</strong> Final predictions or class labels</li>
                    </ul>
                </div>
            </div>
        `,
        'tensors-data': `
            <div class="topic-card cyberpunk-card">
                <h2>Tensors & Data Structures</h2>
                
                <h3>What is a Tensor?</h3>
                <p>A tensor is a mathematical object that generalizes scalars, vectors, and matrices to an arbitrary number of dimensions (indices).</p>
                
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

                <div class="concept-box">
                    <h4>Tensor Hierarchy</h4>
                    <ul>
                        <li><strong>0D Tensor:</strong> Scalar (single number)</li>
                        <li><strong>1D Tensor:</strong> Vector (array)</li>
                        <li><strong>2D Tensor:</strong> Matrix (table)</li>
                        <li><strong>3D Tensor:</strong> RGB Image</li>
                    </ul>
                </div>
            </div>
        `,
        'activation-functions': `
            <div class="topic-card cyberpunk-card">
                <h2>Activation Functions</h2>
                
                <h3>Common Activation Functions</h3>
                <p>Activation functions determine the output of a neural network node given input signals.</p>
                
                <div class="data-graph-container">
                    <canvas id="activation-chart"></canvas>
                </div>

                <div class="concept-box">
                    <h4>Characteristics</h4>
                    <ul>
                        <li><strong>Sigmoid:</strong> Output between 0 and 1, good for probabilities.</li>
                        <li><strong>ReLU:</strong> Output max(0, x), avoids vanishing gradients.</li>
                    </ul>
                </div>
            </div>
        `,
        'optimization': `
            <div class="topic-card cyberpunk-card">
                <h2>Optimization & Training Algorithms</h2>
                
                <h3>Gradient Descent</h3>
                <p>Gradient descent is the fundamental optimization algorithm for training neural networks. It iteratively adjusts parameters to minimize the loss function.</p>
                
                <div class="cyber-formula">θ_new = θ_old - α × ∇J(θ)</div>

                <div class="data-graph-container">
                    <canvas id="loss-chart"></canvas>
                </div>
            </div>
        `,
        'deep-learning': `
            <div class="topic-card cyberpunk-card">
                <h2>Deep Learning & CNNs</h2>
                
                <h3>Convolutional Neural Networks</h3>
                <p>Specialized architectures designed to process grid-like data such as images. They use convolution operations to extract spatial hierarchies of features.</p>
                
                <div class="interactive-diagram">
                    <div class="network-node input-node">Input Image</div>
                    <div class="network-node hidden-node">Conv Layer</div>
                    <div class="network-node hidden-node">Pool Layer</div>
                    <div class="network-node output-node">Prediction</div>
                </div>
            </div>
        `
    };

    // Render the content
    const contentHtml = topics[topicKey] || '<div class="topic-card"><h2>Topic under construction</h2></div>';
    
    // Add a slight delay for chart rendering so the DOM is ready
    setTimeout(() => {
        if (topicKey === 'machine-learning') renderMLChart();
        if (topicKey === 'activation-functions') renderActivationChart();
        if (topicKey === 'optimization') renderLossChart();
    }, 100);

    return contentHtml;
}

// Interactive Perceptron logic
window.updatePerceptron = function() {
    const w1 = parseFloat(document.getElementById('w1-slider').value);
    const w2 = parseFloat(document.getElementById('w2-slider').value);
    document.getElementById('w1-val').innerText = w1.toFixed(1);
    document.getElementById('w2-val').innerText = w2.toFixed(1);
    
    const x1 = 1, x2 = 0, b = 0.1;
    const sum = (w1 * x1) + (w2 * x2) + b;
    const output = sum > 0 ? 1 : 0;
    
    document.getElementById('perceptron-result').innerText = \`Output: \${output} (Sum: \${sum.toFixed(2)})\`;
    
    // Cyberpunk glow effect based on output
    const resultBox = document.getElementById('perceptron-result');
    if (output === 1) {
        resultBox.style.boxShadow = '0 0 10px #00ffff';
        resultBox.style.color = '#00ffff';
    } else {
        resultBox.style.boxShadow = '0 0 10px #ff003c';
        resultBox.style.color = '#ff003c';
    }
}

// Chart.js Renders
function renderMLChart() {
    const ctx = document.getElementById('ml-chart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Class A',
                data: [{x: -2, y: -1}, {x: -1, y: 0}, {x: -3, y: -2}],
                backgroundColor: '#00ffff'
            }, {
                label: 'Class B',
                data: [{x: 2, y: 1}, {x: 3, y: 2}, {x: 1, y: 3}],
                backgroundColor: '#ff00ff'
            }]
        },
        options: {
            plugins: { legend: { labels: { color: '#e0e0e0' } } },
            scales: {
                x: { ticks: { color: '#aaaaaa' }, grid: { color: '#333333' } },
                y: { ticks: { color: '#aaaaaa' }, grid: { color: '#333333' } }
            }
        }
    });
}

function renderActivationChart() {
    const ctx = document.getElementById('activation-chart');
    if (!ctx) return;
    const xValues = [];
    const sigmoid = [];
    const relu = [];
    for (let x = -5; x <= 5; x += 0.5) {
        xValues.push(x);
        sigmoid.push(1 / (1 + Math.exp(-x)));
        relu.push(Math.max(0, x));
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [
                { label: 'Sigmoid', data: sigmoid, borderColor: '#00ffff', fill: false, tension: 0.4 },
                { label: 'ReLU', data: relu, borderColor: '#ff00ff', fill: false, tension: 0.1 }
            ]
        },
        options: {
            plugins: { legend: { labels: { color: '#e0e0e0' } } },
            scales: {
                x: { ticks: { color: '#aaaaaa' }, grid: { color: '#333333' } },
                y: { ticks: { color: '#aaaaaa' }, grid: { color: '#333333' } }
            }
        }
    });
}

function renderLossChart() {
    const ctx = document.getElementById('loss-chart');
    if (!ctx) return;
    const epochs = Array.from({length: 20}, (_, i) => i + 1);
    const loss = epochs.map(e => 10 * Math.exp(-0.2 * e) + Math.random()*0.5);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: epochs,
            datasets: [{
                label: 'Training Loss over Epochs',
                data: loss,
                borderColor: '#ff003c',
                fill: true,
                backgroundColor: 'rgba(255, 0, 60, 0.2)',
                tension: 0.4
            }]
        },
        options: {
            plugins: { legend: { labels: { color: '#e0e0e0' } } },
            scales: {
                x: { ticks: { color: '#aaaaaa' }, grid: { color: '#333333' } },
                y: { ticks: { color: '#aaaaaa' }, grid: { color: '#333333' } }
            }
        }
    });
}