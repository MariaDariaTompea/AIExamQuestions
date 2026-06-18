// Enhanced Learning Content for AI Concepts

function getTopicContentHTML(topicKey, pageIndex = 0) {
    const topics = {
        'neural-networks': pageIndex === 2 ? `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[ACTIVATION_FUNCTIONS // TERM_AI_CORE]</div>
                <h2>Activation Functions & Neuron Math</h2>
                <p>An activation function introduces non-linearity into a neural network, allowing it to learn complex patterns. Without it, the network would just behave like a single linear regression model.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; gap: 20px;">
                    <div class="playground-control-panel">
                        <label for="act-select">Select Function: </label>
                        <select id="act-select" class="cyberpunk-input" style="padding: 5px 10px; background: var(--bg); border: 2px solid var(--border); color: var(--text);">
                            <option value="sigmoid">Sigmoid</option>
                            <option value="relu">ReLU</option>
                            <option value="tanh">Tanh</option>
                            <option value="leaky">Leaky ReLU</option>
                        </select>
                    </div>
                    
                    <div class="data-graph-container" style="height: 250px; position: relative;">
                        <canvas id="act-playground-chart"></canvas>
                    </div>
                    
                    <div class="concept-box">
                        <h4>Formula:</h4>
                        <div class="cyber-formula" id="act-formula" style="font-family: monospace; font-size: 1.1rem; text-align: center;">f(x) = \\frac{1}{1 + e^{-x}}</div>
                    </div>
                    
                    <div class="playground-box">
                        <h4>Live Neuron Math (ReLU)</h4>
                        <p>Adjust inputs and weights to see how they multiply, sum up, and pass through the ReLU activation function:</p>
                        
                        <div class="neuron-math-sliders" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div>
                                <label>Input x1: <input type="range" id="neu-x1" min="-5" max="5" step="0.1" value="1.0"></label> <span id="neu-x1-val">1.0</span>
                            </div>
                            <div>
                                <label>Input x2: <input type="range" id="neu-x2" min="-5" max="5" step="0.1" value="-2.0"></label> <span id="neu-x2-val">-2.0</span>
                            </div>
                            <div>
                                <label>Weight w1: <input type="range" id="neu-w1" min="-2" max="2" step="0.1" value="0.5"></label> <span id="neu-w1-val">0.5</span>
                            </div>
                            <div>
                                <label>Weight w2: <input type="range" id="neu-w2" min="-2" max="2" step="0.1" value="-0.8"></label> <span id="neu-w2-val">-0.8</span>
                            </div>
                        </div>
                        
                        <div class="cyber-result" id="neuron-formula-flow" style="font-family: monospace; line-height: 1.6;">
                            Output = ReLU( (1.0 × 0.5) + (-2.0 × -0.8) ) = 2.10
                        </div>
                    </div>
                </div>
                
                <div class="learning-actions" style="margin-top: 30px; display: flex; gap: 15px; justify-content: flex-start;">
                    <button class="back-btn" onclick="changeLearningPage(1)">← Back: Biological Mapping</button>
                </div>
            </div>
        ` : pageIndex === 1 ? `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[BIOLOGY_MAPPING // TERM_AI_CORE]</div>
                <h2>Biological Neuron vs Perceptron</h2>
                <p>Artificial neural networks draw direct inspiration from biological brain structures. In this interactive 3D model, hover over the biological components to decrypt how they map to artificial perceptron elements.</p>
                
                <div class="neuron-3d-container">
                    <div class="neuron-3d-scene">
                        <!-- Dendrites (Inputs) -->
                        <div class="dendrite-branch d-1" data-label="dendrites">
                            <span class="dendrite-tag">Dendrites (Inputs x1)</span>
                            <div class="dendrite-line"></div>
                        </div>
                        <div class="dendrite-branch d-2" data-label="dendrites">
                            <span class="dendrite-tag">Dendrites (Inputs x2)</span>
                            <div class="dendrite-line"></div>
                        </div>
                        <div class="dendrite-branch d-3" data-label="dendrites">
                            <span class="dendrite-tag">Dendrites (Inputs x3)</span>
                            <div class="dendrite-line"></div>
                        </div>
                        
                        <!-- Soma (Cell Body / Sum) -->
                        <div class="soma-body" data-label="soma">
                            <div class="soma-ring r-1"></div>
                            <div class="soma-ring r-2"></div>
                            <div class="soma-ring r-3"></div>
                            <!-- Nucleus core -->
                            <div class="nucleus-core" data-label="nucleus">Σ</div>
                        </div>
                        
                        <!-- Axon (Activation Function) -->
                        <div class="axon-branch" data-label="axon">
                            <div class="axon-tube"></div>
                            <div class="myelin-sheath ms-1"></div>
                            <div class="myelin-sheath ms-2"></div>
                            <div class="myelin-sheath ms-3"></div>
                            <span class="axon-tag">Axon (Activation f)</span>
                        </div>
                        
                        <!-- Axon Terminal (Output y) -->
                        <div class="terminal-node" data-label="terminals">
                            <span class="terminal-tag">Terminals (Output y)</span>
                        </div>
                    </div>
                </div>
                
                <!-- Hover Explanation Details -->
                <div class="neuron-details-box">
                    <h4 id="neuron-part-title">Hover over a neuron part above...</h4>
                    <p id="neuron-part-desc">Hover over the 3D model components (Dendrites, Soma, Axon, etc.) to decrypt their biological and artificial mapping.</p>
                </div>
                
                <div class="learning-actions" style="margin-top: 30px; display: flex; gap: 15px; justify-content: space-between;">
                    <button class="back-btn" onclick="changeLearningPage(0)">← Back: Perceptron Basics</button>
                    <button class="submit-btn" onclick="changeLearningPage(2)">Next: Activation Functions →</button>
                </div>
            </div>
        ` : `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[PERCEPTRON_BASICS // TERM_AI_CORE]</div>
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

                <div class="learning-actions" style="margin-top: 30px; display: flex; justify-content: flex-end;">
                    <button class="submit-btn" onclick="changeLearningPage(1)">Next: Biological Mapping →</button>
                </div>
            </div>
        `,
        'machine-learning': pageIndex === 2 ? `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[K_NEAREST_NEIGHBORS // MULTI_CLASS]</div>
                <h2>k-NN Nearest Neighbors</h2>
                <h3>Section 3: Neighbor Classification</h3>
                <p>Click anywhere inside the grid below to place a test point represented by a <strong>?</strong>. The algorithm identifies the <strong>k</strong> nearest training points, draws connection lines, and predicts the class based on a majority vote.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <canvas id="knn-demo-canvas" width="300" height="300" style="border: 2px solid var(--border); background: var(--card-bg); cursor: crosshair;"></canvas>
                    
                    <div class="playground-box" style="width: 100%;">
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div>
                                <label>Value of k: <input type="range" id="knn-k-slider" min="1" max="15" step="2" value="3"></label> <span id="knn-k-val">3</span>
                            </div>
                            <div class="cyber-result" id="knn-prediction" style="text-align: center; font-size: 1.1rem; padding: 15px;">
                                Click inside the grid to place a test point.
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="learning-actions" style="margin-top: 30px; display: flex; justify-content: flex-start;">
                    <button class="back-btn" onclick="changeLearningPage(1)">← Back: Classification Boundary</button>
                </div>
            </div>
        ` : pageIndex === 1 ? `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[CLASSIFICATION // DECISION_BOUNDARY]</div>
                <h2>Supervised Learning: Classification</h2>
                <h3>Section 2: Interactive Decision Boundary</h3>
                <p>Select a class color, then click anywhere inside the grid to add points. Adjust the decision boundary slider to classify them. Try separating Class A (purple) and Class B (green).</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <canvas id="class-demo-canvas" width="300" height="300" style="border: 2px solid var(--border); background: var(--card-bg); cursor: crosshair;"></canvas>
                    
                    <div class="playground-box" style="width: 100%;">
                        <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 15px;">
                            <button id="class-btn-a" class="restart-btn" style="border-color: var(--secondary);">Class A (Purple)</button>
                            <button id="class-btn-b" class="restart-btn" style="border-color: var(--border);">Class B (Green)</button>
                            <button id="reset-class-btn" class="review-btn">Clear All</button>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div>
                                <label>Boundary Angle: <input type="range" id="boundary-slider" min="-3" max="3" step="0.1" value="0.5"></label> <span id="boundary-val">0.5</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="learning-actions" style="margin-top: 30px; display: flex; justify-content: space-between;">
                    <button class="back-btn" onclick="changeLearningPage(0)">← Back: Learn from Data</button>
                    <button class="submit-btn" onclick="changeLearningPage(2)">Next: k-NN Demonstration →</button>
                </div>
            </div>
        ` : `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[SUPERVISED_LEARNING // DATA_FIT]</div>
                <h2>Machine Learning Fundamentals</h2>
                <h3>Section 1: Learn from Data</h3>
                <p>Machine learning starts with data points. Drag the noise and dataset size sliders to generate data and see how a linear regression model automatically learns the trend line.</p>
                
                <div class="playground-layout">
                    <div class="data-graph-container" style="height: 250px; position: relative; margin-bottom: 20px;">
                        <canvas id="ml-demo-chart"></canvas>
                    </div>
                    
                    <div class="playground-box">
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div>
                                <label>Dataset Size: <input type="range" id="size-slider" min="10" max="500" value="100"></label> <span id="size-val">100</span>
                            </div>
                            <div>
                                <label>Data Noise: <input type="range" id="noise-slider" min="0" max="5" step="0.1" value="1.0"></label> <span id="noise-val">1.0</span>
                            </div>
                            <button id="gen-dataset-btn" class="submit-btn" style="margin-top: 5px;">Generate New Dataset</button>
                        </div>
                    </div>
                </div>
                
                <div class="learning-actions" style="margin-top: 30px; display: flex; justify-content: flex-end;">
                    <button class="submit-btn" onclick="changeLearningPage(1)">Next: Classification →</button>
                </div>
            </div>
        `,
        'regression-overfitting': pageIndex === 1 ? `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[OVERFITTING // MODEL_COMPLEXITY]</div>
                <h2>Polynomial Overfitting & Complexity</h2>
                <p>Increasing model complexity (polynomial degree) reduces training error, but can lead to <strong>overfitting</strong> where the model fits noise in the training set and fails to generalize to validation data.</p>
                
                <div class="playground-layout" style="display: grid; grid-template-columns: 1fr; gap: 20px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="data-graph-container" style="height: 220px; position: relative;">
                            <canvas id="poly-chart-canvas"></canvas>
                        </div>
                        <div class="data-graph-container" style="height: 220px; position: relative;">
                            <canvas id="poly-error-canvas"></canvas>
                        </div>
                    </div>
                    
                    <div class="playground-box">
                        <div>
                            <label>Polynomial Degree: <input type="range" id="poly-deg-slider" min="1" max="5" step="1" value="1"></label> <span id="poly-deg-val">1</span>
                        </div>
                        <div class="cyber-result" id="poly-complexity-status" style="margin-top: 15px; text-align: center; font-size: 1.1rem; padding: 10px;">
                            Status: Underfitting
                        </div>
                    </div>
                </div>
                
                <div class="learning-actions" style="margin-top: 30px; display: flex; justify-content: flex-start;">
                    <button class="back-btn" onclick="changeLearningPage(0)">← Back: Linear Regression</button>
                </div>
            </div>
        ` : `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[LINEAR_REGRESSION // MSE_MINIMIZER]</div>
                <h2>Linear Regression & Mean Squared Error</h2>
                <p>Linear regression models the relationship between a dependent variable and one or more independent variables. Drag the Slope (m) and Intercept (b) sliders to manually fit the line to the training points, then click "Find Best Fit" to trigger least-squares animation.</p>
                
                <div class="playground-layout">
                    <div class="data-graph-container" style="height: 250px; position: relative; margin-bottom: 20px;">
                        <canvas id="reg-chart-canvas"></canvas>
                    </div>
                    
                    <div class="playground-box">
                        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                            <div>
                                <label>Slope (m): <input type="range" id="reg-slope-slider" min="-2" max="5" step="0.1" value="0.5"></label> <span id="reg-slope-val">0.5</span>
                            </div>
                            <div>
                                <label>Intercept (b): <input type="range" id="reg-intercept-slider" min="-2" max="5" step="0.1" value="1.0"></label> <span id="reg-intercept-val">1.0</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span class="cyber-result" id="reg-error-display" style="padding: 10px 15px; margin: 0; font-size: 1rem; width: 65%;">Current MSE = 0.000</span>
                            <button id="fit-reg-btn" class="submit-btn" style="width: 30%;">Find Best Fit</button>
                        </div>
                    </div>
                </div>
                
                <div class="learning-actions" style="margin-top: 30px; display: flex; justify-content: flex-end;">
                    <button class="submit-btn" onclick="changeLearningPage(1)">Next: Polynomial Overfitting →</button>
                </div>
            </div>
        `,
        'clustering': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[UNSUPERVISED_LEARNING // K_MEANS_CLUSTERING]</div>
                <h2>K-Means Clustering</h2>
                <p>K-Means is an unsupervised clustering algorithm. Centroids (stars) are initialized randomly. Clicking <strong>Step Algorithm</strong> alternates between assigning points to the nearest centroid and shifting centroids to the mean of their cluster.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <canvas id="kmeans-canvas" width="350" height="300" style="border: 2px solid var(--border); background: var(--card-bg);"></canvas>
                    
                    <div class="playground-box" style="width: 100%;">
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <label>Number of Clusters (K): <input type="range" id="kmeans-k-slider" min="2" max="5" step="1" value="3"></label> <span id="kmeans-k-val">3</span>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <button id="kmeans-step-btn" class="submit-btn">Step Algorithm</button>
                                    <button id="kmeans-reset-btn" class="review-btn">Re-initialize</button>
                                </div>
                            </div>
                            <div class="cyber-result" id="kmeans-status-msg" style="text-align: center; font-size: 1.1rem; padding: 10px; margin: 0;">
                                Centroids placed randomly. Click Step to assign points.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'optimization': pageIndex === 1 ? `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[3D_SURFACE // ISOMETRIC_PROJECTION]</div>
                <h2>3D Loss Surface Projection</h2>
                <p>Neural networks optimize loss functions over high-dimensional surfaces. This 3D wireframe plot represents the cost function $Z = \\sin(X) \\cdot \\cos(Y) \\cdot 2 + X^2/10 + Y^2/10$. Adjust the sliders below to rotate the isometric coordinate matrix.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <canvas id="loss-3d-canvas" width="400" height="300" style="border: 2px solid var(--border); background: var(--card-bg);"></canvas>
                    
                    <div class="playground-box" style="width: 100%;">
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div>
                                <label>Rotate X Angle: <input type="range" id="rotate-x-slider" min="-90" max="90" step="5" value="30"></label>
                            </div>
                            <div>
                                <label>Rotate Y Angle: <input type="range" id="rotate-y-slider" min="-90" max="90" step="5" value="45"></label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="learning-actions" style="margin-top: 30px; display: flex; justify-content: flex-start;">
                    <button class="back-btn" onclick="changeLearningPage(0)">← Back: Gradient Descent Parabola</button>
                </div>
            </div>
        ` : `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[OPTIMIZATION // GRADIENT_DESCENT]</div>
                <h2>Optimization & Gradient Descent</h2>
                <p>Gradient descent is an optimization algorithm used to minimize a loss function. The learning rate ($\\alpha$) controls the step size. Click "Start Training" to animate the parameter ball rolling down the slope to the minimum.</p>
                
                <div class="playground-layout">
                    <div class="data-graph-container" style="height: 250px; position: relative; margin-bottom: 20px;">
                        <canvas id="gd-chart-canvas"></canvas>
                    </div>
                    
                    <div class="playground-box">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div>
                                <label>Learning Rate (lr): <input type="range" id="gd-lr-slider" min="0.01" max="1.1" step="0.05" value="0.1"></label> <span id="gd-lr-val">0.10</span>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button id="gd-start-btn" class="submit-btn">Start Training</button>
                                <button id="gd-reset-btn" class="review-btn">Reset</button>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-around; gap: 15px;">
                            <div class="cyber-result" id="gd-iter-display" style="flex: 1; text-align: center; margin: 0; padding: 10px 0;">Iteration: 0</div>
                            <div class="cyber-result" id="gd-loss-display" style="flex: 1; text-align: center; margin: 0; padding: 10px 0;">Loss: 20.25</div>
                        </div>
                    </div>
                </div>
                
                <div class="learning-actions" style="margin-top: 30px; display: flex; justify-content: flex-end;">
                    <button class="submit-btn" onclick="changeLearningPage(1)">Next: 3D Cost Surface Projection →</button>
                </div>
            </div>
        `,
        'decision-trees-evaluation': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[MODEL_EVALUATION // DECISION_TREES]</div>
                <h2>Decision Trees & Model Evaluation</h2>
                
                <h3>What is a Decision Tree?</h3>
                <p>Decision trees split data recursively by selecting feature tests that maximize information gain. They segment data into homogeneous regions leading to leaf node classifications.</p>
                
                <div class="tree-diagram" style="margin-bottom: 25px;">
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

                <div class="concept-box" style="margin-bottom: 25px;">
                    <h4>Confusion Matrix Metrics</h4>
                    <ul>
                        <li><strong>TP (True Positives):</strong> Correct positive predictions</li>
                        <li><strong>TN (True Negatives):</strong> Correct negative predictions</li>
                        <li><strong>FP (False Positives):</strong> Type I error (incorrect positive alarm)</li>
                        <li><strong>FN (False Negatives):</strong> Type II error (missed positive detection)</li>
                    </ul>
                </div>

                <h3>Interactive Confusion Matrix heatmap</h3>
                <p>Enter the numerical counts for TP, FP, FN, and TN. The matrix cells will update their background opacity based on relative weight, and precision, recall, accuracy, and F1 metrics will be computed instantly.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <div class="confusion-matrix" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; width: 260px;">
                        <div class="cm-cell" id="cell-tp" style="border: 2px solid var(--border); padding: 15px; text-align: center; background: rgba(82, 244, 123, 0.2);">
                            <div style="font-size: 0.8rem; opacity: 0.6;">TP (True Positive)</div>
                            <input type="number" id="tp-in" value="50" min="0" style="width: 100%; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-family: monospace; text-align: center; margin-top: 5px;">
                        </div>
                        <div class="cm-cell" id="cell-fp" style="border: 2px solid var(--border); padding: 15px; text-align: center; background: rgba(139, 92, 246, 0.1);">
                            <div style="font-size: 0.8rem; opacity: 0.6;">FP (False Positive)</div>
                            <input type="number" id="fp-in" value="10" min="0" style="width: 100%; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-family: monospace; text-align: center; margin-top: 5px;">
                        </div>
                        <div class="cm-cell" id="cell-fn" style="border: 2px solid var(--border); padding: 15px; text-align: center; background: rgba(139, 92, 246, 0.1);">
                            <div style="font-size: 0.8rem; opacity: 0.6;">FN (False Negative)</div>
                            <input type="number" id="fn-in" value="5" min="0" style="width: 100%; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-family: monospace; text-align: center; margin-top: 5px;">
                        </div>
                        <div class="cm-cell" id="cell-tn" style="border: 2px solid var(--border); padding: 15px; text-align: center; background: rgba(82, 244, 123, 0.2);">
                            <div style="font-size: 0.8rem; opacity: 0.6;">TN (True Negative)</div>
                            <input type="number" id="tn-in" value="35" min="0" style="width: 100%; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-family: monospace; text-align: center; margin-top: 5px;">
                        </div>
                    </div>
                    
                    <div class="playground-box" style="width: 100%; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
                        <div style="border: 1px solid var(--border); padding: 10px 0;">
                            <div style="font-size: 0.8rem; opacity: 0.6;">Accuracy</div>
                            <div id="cm-accuracy" style="font-weight: bold; color: var(--secondary); font-size: 1.1rem; margin-top: 5px;">85.0%</div>
                        </div>
                        <div style="border: 1px solid var(--border); padding: 10px 0;">
                            <div style="font-size: 0.8rem; opacity: 0.6;">Precision</div>
                            <div id="cm-precision" style="font-weight: bold; color: var(--secondary); font-size: 1.1rem; margin-top: 5px;">83.3%</div>
                        </div>
                        <div style="border: 1px solid var(--border); padding: 10px 0;">
                            <div style="font-size: 0.8rem; opacity: 0.6;">Recall</div>
                            <div id="cm-recall" style="font-weight: bold; color: var(--secondary); font-size: 1.1rem; margin-top: 5px;">90.9%</div>
                        </div>
                        <div style="border: 1px solid var(--border); padding: 10px 0;">
                            <div style="font-size: 0.8rem; opacity: 0.6;">F1-Score</div>
                            <div id="cm-f1" style="font-weight: bold; color: var(--secondary); font-size: 1.1rem; margin-top: 5px;">0.870</div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'tensors-data': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[TENSORS_DATA // DATA_STRUCTURES]</div>
                <h2>Tensors & Data Structures</h2>
                
                <h3>What is a Tensor?</h3>
                <p>A tensor is a mathematical object that generalizes scalars, vectors, and matrices to an arbitrary number of dimensions (indices). It forms the foundational data element of modern Deep Learning.</p>
                
                <div class="tensor-container" style="margin: 30px 0;">
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
                        <li><strong>0D Tensor:</strong> Scalar (single number, e.g. 5)</li>
                        <li><strong>1D Tensor:</strong> Vector (one-dimensional array, e.g. [1, 2, 3])</li>
                        <li><strong>2D Tensor:</strong> Matrix (two-dimensional grid array)</li>
                        <li><strong>3D Tensor:</strong> Array slice stack (e.g. RGB color channel images)</li>
                        <li><strong>ND Tensor:</strong> High-dimensional tensor datasets</li>
                    </ul>
                </div>
            </div>
        `,
        'deep-learning': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[DEEP_LEARNING // CNNS]</div>
                <h2>Deep Learning & CNNs</h2>
                
                <h3>Convolutional Neural Networks</h3>
                <p>Convolutional Neural Networks (CNNs) are specialized deep learning networks designed to process grid-like structured data such as image pixels. They utilize sliding filters (kernels) to construct feature maps.</p>
                
                <div class="interactive-diagram" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <div style="display: flex; justify-content: space-around; width: 100%; gap: 10px;">
                        <div class="network-node input-node" id="box-input" style="flex: 1; padding: 15px 5px; text-align: center; border: 2px solid var(--border); font-size: 0.9rem;">Input Image</div>
                        <div class="network-node hidden-node" id="box-conv" style="flex: 1; padding: 15px 5px; text-align: center; border: 2px solid var(--border); font-size: 0.9rem;">Conv Layer</div>
                        <div class="network-node hidden-node" id="box-pool" style="flex: 1; padding: 15px 5px; text-align: center; border: 2px solid var(--border); font-size: 0.9rem;">Pool Layer</div>
                        <div class="network-node output-node" id="box-pred" style="flex: 1; padding: 15px 5px; text-align: center; border: 2px solid var(--border); font-size: 0.9rem;">Prediction</div>
                    </div>
                    
                    <button id="cnn-feedforward-btn" class="submit-btn" style="width: auto; padding: 10px 25px;">Run Feedforward Pulse</button>
                </div>
                
                <div class="concept-box" style="margin-top: 25px;">
                    <h4>Key Deep Learning Operations</h4>
                    <ul>
                        <li><strong>Convolution:</strong> Filters sliding across input coordinates to detect edges/textures.</li>
                        <li><strong>Pooling:</strong> Downsamples resolution dimensions to reduce computation size and ensure translation invariance.</li>
                        <li><strong>Dense:</strong> Fully-connected classifier layers mapping features to final output scores.</li>
                    </ul>
                </div>
            </div>
        `,
        'reinforcement-learning': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[REINFORCEMENT_LEARNING // Q_LEARNING]</div>
                <h2>Reinforcement Learning & Grid World</h2>
                <p>An agent is trained via trial and error. The grid world below consists of Start (S), Goal (G, +10 Reward), Obstacles (X, -5 Reward), and blank spots (step penalty -1). Navigate the agent manually or click <strong>Run Q-Learning</strong> to train Q-values automatically and find the optimal route.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <div id="gridworld-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; width: 240px; height: 240px; margin: 0 auto;"></div>
                    
                    <div class="playground-box" style="width: 100%;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <span id="grid-reward-display" style="font-weight: bold; color: var(--secondary); font-size: 1.1rem;">Total Reward: 0</span>
                            <button id="gw-train-btn" class="submit-btn" style="width: auto;">Run Q-Learning</button>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                            <div style="font-size: 0.9rem; opacity: 0.6; margin-bottom: 5px;">Manual Agent Control</div>
                            <button id="gw-up" class="restart-btn" style="width: 50px; padding: 5px 0;">▲</button>
                            <div style="display: flex; gap: 10px;">
                                <button id="gw-left" class="restart-btn" style="width: 50px; padding: 5px 0;">◀</button>
                                <button id="gw-down" class="restart-btn" style="width: 50px; padding: 5px 0;">▼</button>
                                <button id="gw-right" class="restart-btn" style="width: 50px; padding: 5px 0;">▶</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    // Render the content
    const contentHtml = topics[topicKey] || '<div class="topic-card"><h2>Topic under construction</h2></div>';
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
    
    document.getElementById('perceptron-result').innerText = `Output: ${output} (Sum: ${sum.toFixed(2)})`;
    
    // Cyberpunk glow effect based on output
    const resultBox = document.getElementById('perceptron-result');
    if (output === 1) {
        resultBox.style.boxShadow = '0 0 10px #52f47b';
        resultBox.style.color = '#52f47b';
    } else {
        resultBox.style.boxShadow = '0 0 10px #8b5cf6';
        resultBox.style.color = '#8b5cf6';
    }
}