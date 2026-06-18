// Enhanced Learning Content for 20-Module AI Curriculum

function getTopicContentHTML(topicKey, pageIndex = 0) {
    const topics = {
        'intro-ml': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[SUPERVISED_LEARNING // DATA_FIT]</div>
                <h2>1. Introduction to Machine Learning</h2>
                <p>Machine Learning enables computers to learn patterns directly from empirical datasets instead of following hand-coded rules. Machine learning starts with data points. Drag the noise and dataset size sliders to generate data in this playground to see how a linear regression model automatically learns the trend line of best fit.</p>
                
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
            </div>
        `,
        'classification': pageIndex === 1 ? `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[K_NEAREST_NEIGHBORS // MULTI_CLASS]</div>
                <h2>2. Classification (Page 2: k-NN)</h2>
                <p>Click anywhere inside the grid below to place a test query point (<strong>?</strong>). The k-NN algorithm identifies the <strong>k</strong> closest training points, draws distance connection lines, and performs a majority class vote to predict the class.</p>
                
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
                    <button class="back-btn" onclick="changeLearningPage(0)">← Back: Linear Boundary</button>
                </div>
            </div>
        ` : `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[CLASSIFICATION // DECISION_BOUNDARY]</div>
                <h2>2. Classification (Page 1: Linear Boundary)</h2>
                <p>Classification splits data points into discrete categories. Select a class color, then click anywhere inside the grid to add custom points. Move the boundary slider to adjust the dividing hyperplane. Try separating Class A (purple) and Class B (green).</p>
                
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
                
                <div class="learning-actions" style="margin-top: 30px; display: flex; justify-content: flex-end;">
                    <button class="submit-btn" onclick="changeLearningPage(1)">Next: k-NN Demo →</button>
                </div>
            </div>
        `,
        'regression': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[LINEAR_REGRESSION // MSE_MINIMIZER]</div>
                <h2>3. Regression</h2>
                <p>Regression predicts continuous numerical values. Linear regression models the relationship between a dependent variable and one or more independent variables. Manually tune the Slope (m) and Intercept (b) sliders to manually fit the line and minimize the Mean Squared Error (MSE), or click "Find Best Fit" to trigger the least-squares solver animation.</p>
                
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
            </div>
        `,
        'decision-trees': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[DECISION_TREES // SHANNON_ENTROPY]</div>
                <h2>4. Decision Trees & Entropy</h2>
                
                <h3>What is a Decision Tree?</h3>
                <p>Decision trees split data recursively by selecting feature tests that maximize information gain. They segment data into homogeneous regions leading to leaf node classifications.</p>
                
                <div class="tree-diagram" style="margin-bottom: 25px; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                    <div class="tree-node root-node" style="border: 2px solid var(--border); padding: 8px 15px; font-family: monospace;">Feature A > 5?</div>
                    <div class="tree-branches" style="display: flex; gap: 40px; justify-content: center; width: 100%;">
                        <div class="tree-branch" style="text-align: center;">
                            <div class="tree-label" style="font-size: 0.8rem; opacity: 0.6; margin-bottom: 5px;">Yes</div>
                            <div class="tree-node leaf-node correct" style="border: 2px solid var(--secondary); padding: 8px 15px; color: var(--secondary); font-family: monospace;">Class 1</div>
                        </div>
                        <div class="tree-branch" style="text-align: center;">
                            <div class="tree-label" style="font-size: 0.8rem; opacity: 0.6; margin-bottom: 5px;">No</div>
                            <div class="tree-node leaf-node wrong" style="border: 2px solid #ff3e3e; padding: 8px 15px; color: #ff3e3e; font-family: monospace;">Class 2</div>
                        </div>
                    </div>
                </div>

                <h3>Entropy Visualization</h3>
                <p>Entropy measures the impurity of a node. A purely uniform mix of classes has an entropy of 1.0, while a single-class pure node has an entropy of 0. Drag the slider to observe how entropy changes.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; gap: 20px; align-items: center; margin-bottom: 25px;">
                    <div style="display: flex; flex-wrap: wrap; gap: 15px; width: 100%;">
                        <canvas id="entropy-mix-canvas" width="200" height="150" style="border: 1px solid var(--border); background: var(--card-bg); flex: 1 1 180px;"></canvas>
                        <canvas id="entropy-curve-canvas" width="300" height="150" style="border: 1px solid var(--border); background: var(--card-bg); flex: 1 1 240px;"></canvas>
                    </div>
                    
                    <div class="playground-box" style="width: 100%;">
                        <label>Positive Class %: <input type="range" id="ent-slider" min="0" max="100" value="50"></label> <span id="ent-pct-val">50%</span>
                        <div class="cyber-result" id="ent-formula-val" style="margin-top: 10px; text-align: center; font-family: monospace;">Entropy H(p) = 1.000</div>
                    </div>
                </div>

                <h3>Interactive Tree Split Builder</h3>
                <p>Simulate database splits. Select a feature and threshold, then click Split to grow nodes dynamically and evaluate information gain.</p>
                <div class="playground-box" style="margin-bottom: 25px;">
                    <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                        <label>Feature: 
                            <select id="dt-split-feat" class="cyberpunk-input" style="background:var(--bg); border:1px solid var(--border); color:var(--text);">
                                <option value="Age">Age</option>
                                <option value="Income">Income</option>
                            </select>
                        </label>
                        <label>Threshold: <input type="number" id="dt-split-thresh" value="30" style="width:60px; background:var(--bg); border:1px solid var(--border); color:var(--text); text-align:center;"></label>
                        <button id="dt-split-btn" class="submit-btn" style="width:auto; padding:0 15px;">Split Data</button>
                    </div>
                    <div class="cyber-result" id="dt-split-results" style="font-family: monospace; font-size: 0.9rem;">
                        Parent: 10 samples. Entropy = 1.000
                    </div>
                </div>
            </div>
        `,
        'model-evaluation': pageIndex === 1 ? `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[MODEL_EVALUATION // CONFUSION_MATRIX]</div>
                <h2>5. Model Evaluation (Page 2: Decision Thresholds & ROC)</h2>
                
                <h3>Confusion Matrix & Threshold Tradeoffs</h3>
                <p>Adjust the classification decision threshold. In this medical disease simulator, lowering the threshold detects more patients (High Recall) but increases false positives (Low Precision). Observe the current point shift on the ROC curve.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <div style="width: 100%;">
                        <label>Decision Threshold: <input type="range" id="me-threshold-slider" min="0.05" max="0.95" step="0.05" value="0.50"></label> <span id="me-threshold-val">0.50</span>
                    </div>
                    
                    <div style="display: flex; flex-wrap: wrap; gap: 15px; width: 100%; justify-content: center; align-items: center;">
                        <!-- Matrix Grid -->
                        <div class="confusion-matrix" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; width: 220px;">
                            <div class="cm-cell" id="cell-tp" style="border: 2px solid var(--border); padding: 10px; text-align: center;">
                                <div style="font-size: 0.75rem; opacity: 0.6;">TP</div>
                                <div id="me-tp-val" style="font-weight: bold; font-family: monospace;">-</div>
                            </div>
                            <div class="cm-cell" id="cell-fp" style="border: 2px solid var(--border); padding: 10px; text-align: center;">
                                <div style="font-size: 0.75rem; opacity: 0.6;">FP</div>
                                <div id="me-fp-val" style="font-weight: bold; font-family: monospace;">-</div>
                            </div>
                            <div class="cm-cell" id="cell-fn" style="border: 2px solid var(--border); padding: 10px; text-align: center;">
                                <div style="font-size: 0.75rem; opacity: 0.6;">FN</div>
                                <div id="me-fn-val" style="font-weight: bold; font-family: monospace;">-</div>
                            </div>
                            <div class="cm-cell" id="cell-tn" style="border: 2px solid var(--border); padding: 10px; text-align: center;">
                                <div style="font-size: 0.75rem; opacity: 0.6;">TN</div>
                                <div id="me-tn-val" style="font-weight: bold; font-family: monospace;">-</div>
                            </div>
                        </div>
                        
                        <!-- ROC Canvas -->
                        <canvas id="roc-canvas" width="220" height="220" style="border: 1px solid var(--border); background: var(--card-bg);"></canvas>
                    </div>
                    
                    <div class="playground-box" style="width: 100%; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center;">
                        <div style="border: 1px solid var(--border); padding: 6px 0;">
                            <div style="font-size: 0.75rem; opacity: 0.6;">Accuracy</div>
                            <div id="me-acc-disp" style="font-weight: bold; color: var(--secondary); font-size: 0.95rem;">-</div>
                        </div>
                        <div style="border: 1px solid var(--border); padding: 6px 0;">
                            <div style="font-size: 0.75rem; opacity: 0.6;">Precision</div>
                            <div id="me-prec-disp" style="font-weight: bold; color: var(--secondary); font-size: 0.95rem;">-</div>
                        </div>
                        <div style="border: 1px solid var(--border); padding: 6px 0;">
                            <div style="font-size: 0.75rem; opacity: 0.6;">Recall</div>
                            <div id="me-rec-disp" style="font-weight: bold; color: var(--secondary); font-size: 0.95rem;">-</div>
                        </div>
                        <div style="border: 1px solid var(--border); padding: 6px 0;">
                            <div style="font-size: 0.75rem; opacity: 0.6;">F1-Score</div>
                            <div id="me-f1-disp" style="font-weight: bold; color: var(--secondary); font-size: 0.95rem;">-</div>
                        </div>
                    </div>
                </div>
                
                <div class="learning-actions" style="margin-top: 30px; display: flex; justify-content: flex-start;">
                    <button class="back-btn" onclick="changeLearningPage(0)">← Back: Manual Heatmap</button>
                </div>
            </div>
        ` : `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[MODEL_EVALUATION // HEATMAP]</div>
                <h2>5. Model Evaluation (Page 1: Manual Metrics Heatmap)</h2>
                
                <h3>Confusion Matrix Metrics</h3>
                <p>Confusion Matrix Metrics measure classification performance. Enter the numerical counts for TP, FP, FN, and TN. The matrix cells will update their background opacity based on relative weight, and precision, recall, accuracy, and F1 metrics will be computed instantly.</p>
                
                <div class="concept-box" style="margin-bottom: 25px;">
                    <h4>Confusion Matrix Metrics</h4>
                    <ul>
                        <li><strong>TP (True Positives):</strong> Correct positive predictions</li>
                        <li><strong>TN (True Negatives):</strong> Correct negative predictions</li>
                        <li><strong>FP (False Positives):</strong> Type I error (incorrect positive alarm)</li>
                        <li><strong>FN (False Negatives):</strong> Type II error (missed positive detection)</li>
                    </ul>
                </div>
                
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
                
                <div class="learning-actions" style="margin-top: 30px; display: flex; justify-content: flex-end;">
                    <button class="submit-btn" onclick="changeLearningPage(1)">Next: Thresholds & ROC →</button>
                </div>
            </div>
        `,
        'neural-networks': pageIndex === 1 ? `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[BIOLOGY_MAPPING // TERM_AI_CORE]</div>
                <h2>6. Neural Networks (Page 2: Biological Mapping)</h2>
                <p>Artificial neural networks draw direct inspiration from biological brain structures. Hover over the biological components in this interactive model to see how they map to artificial perceptron elements.</p>
                
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
                
                <div class="learning-actions" style="margin-top: 30px; display: flex; gap: 15px; justify-content: flex-start;">
                    <button class="back-btn" onclick="changeLearningPage(0)">← Back: Perceptron Basics</button>
                </div>
            </div>
        ` : `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[PERCEPTRON_BASICS // TERM_AI_CORE]</div>
                <h2>6. Neural Networks (Page 1: Perceptron Basics)</h2>
                
                <h3>What is a Perceptron?</h3>
                <p>A perceptron is the simplest form of artificial neural network, consisting of a single neuron that makes binary decisions. It takes multiple inputs ($x_i$), multiplies them by weights ($w_i$), sums them up, and runs an activation function to generate a binary output ($y$).</p>
                
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
                <div class="cyber-formula" style="font-family: monospace; font-size: 1.1rem; text-align: center; margin-bottom: 20px;">Output = f(w1x1 + w2x2 + ... + wnxn + b)</div>

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
        'activation-functions': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[ACTIVATION_FUNCTIONS // TERM_AI_CORE]</div>
                <h2>7. Activation Functions</h2>
                <p>An activation function introduces non-linearity into a neural network, allowing it to learn complex patterns. Without it, the network would just behave like a single linear regression model. Test different activation types on a live math graph and adjust inputs to feed weights to a single perceptron node.</p>
                
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
                    
                    <div class="data-graph-container" style="height: 200px; position: relative;">
                        <canvas id="act-playground-chart"></canvas>
                    </div>
                    
                    <div class="concept-box">
                        <h4>Formula:</h4>
                        <div class="cyber-formula" id="act-formula" style="font-family: monospace; font-size: 1.1rem; text-align: center;">f(x) = \frac{1}{1 + e^{-x}}</div>
                    </div>
                    
                    <div class="playground-box">
                        <h4>Live Neuron Math (ReLU)</h4>
                        <p>Adjust inputs and weights to see how they multiply, sum up, and pass through the activation function:</p>
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
            </div>
        `,
        'backpropagation': pageIndex === 1 ? `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[3D_SURFACE // COST_LANDSCAPE]</div>
                <h2>8. Backpropagation (Page 2: 3D Loss Surface)</h2>
                <p>Gradient descent propagates errors backwards over cost surfaces. Adjust the sliders to rotate the projected Z-cost matrix landscape in isometric 3D.</p>
                
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
                    <button class="back-btn" onclick="changeLearningPage(0)">← Back: GD Parabola</button>
                </div>
            </div>
        ` : `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[BACKPROPAGATION // GRADIENT_DESCENT]</div>
                <h2>8. Backpropagation (Page 1: GD Parabola)</h2>
                <p>Backpropagation computes loss gradients to tweak model parameters. Adjust the learning rate ($lpha$) to watch the cost ball descend towards the minimum.</p>
                
                <div class="playground-layout">
                    <div class="data-graph-container" style="height: 220px; position: relative; margin-bottom: 20px;">
                        <canvas id="gd-chart-canvas"></canvas>
                    </div>
                    
                    <div class="playground-box">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div>
                                <label>Learning Rate (lr): <input type="range" id="gd-lr-slider" min="0.01" max="1.1" step="0.05" value="0.10"></label> <span id="gd-lr-val">0.10</span>
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
                    <button class="submit-btn" onclick="changeLearningPage(1)">Next: 3D Cost Surface →</button>
                </div>
            </div>
        `,
        'deep-learning-problems': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[DEEP_LEARNING_PROBLEMS // COMPLEXITY]</div>
                <h2>9. Deep Learning Problems & Overfitting</h2>
                <p>Over-parameterization can trigger overfitting. Increasing model complexity (polynomial degree) reduces training error, but can lead to overfitting where the model fits noise in the training set and fails to generalize to validation data. Drag the slider to adjust the polynomial fitting complexity and compare training vs validation error curves.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; gap: 20px;">
                    <div style="display: flex; flex-wrap: wrap; gap: 15px; width: 100%;">
                        <div class="data-graph-container" style="flex: 1 1 280px; height: 200px; position: relative;">
                            <canvas id="poly-chart-canvas"></canvas>
                        </div>
                        <div class="data-graph-container" style="flex: 1 1 280px; height: 200px; position: relative;">
                            <canvas id="poly-error-canvas"></canvas>
                        </div>
                    </div>
                    
                    <div class="playground-box">
                        <div>
                            <label>Complexity Degree: <input type="range" id="poly-deg-slider" min="1" max="5" step="1" value="1"></label> <span id="poly-deg-val">1</span>
                        </div>
                        <div class="cyber-result" id="poly-complexity-status" style="margin-top: 15px; text-align: center; font-size: 1.1rem; padding: 10px;">
                            Status: Underfitting
                        </div>
                    </div>
                </div>
            </div>
        `,
        'cnn': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[DEEP_LEARNING // CNNS]</div>
                <h2>10. Convolutional Neural Networks</h2>
                <p>Convolutional Neural Networks (CNNs) are specialized deep learning networks designed to process grid-like structured data such as image pixels. They utilize sliding filters (kernels) to construct feature maps. Click feedforward to animate kernel sliding filters and pooling layers extracting spatial features.</p>
                
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
        'tensors': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[TENSORS // DIMENSIONS]</div>
                <h2>11. Tensors & Rank</h2>
                <p>What is a Tensor? A tensor is a mathematical object that generalizes scalars, vectors, and matrices to an arbitrary number of dimensions (indices). It forms the foundational data element of modern Deep Learning and the mathematical foundation of deep learning structures. Drag the rank slider to examine tensor dimensions visually.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <div style="width: 100%;">
                        <label>Tensor Rank: <input type="range" id="tensor-rank-slider" min="0" max="3" step="1" value="3"></label> 
                        <span id="tensor-rank-tag" style="font-weight: bold; color: var(--secondary); margin-left: 10px;">3D Tensor</span>
                    </div>

                    <div id="tensor-visual-wrapper" style="height: 200px; display: flex; align-items: center; justify-content: center;">
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
                    </div>

                    <div class="concept-box" id="tensor-rank-desc" style="width: 100%;">
                        A 3D Tensor represents a stack of multi-channel grids (e.g. RGB image layers).
                    </div>

                    <div class="concept-box" style="margin-top: 25px; width: 100%;">
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
            </div>
        `,
        'clustering': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[CLUSTERING // K_MEANS]</div>
                <h2>12. Clustering</h2>
                <p>K-Means is an unsupervised clustering algorithm. Centroids (stars) are initialized randomly. Clicking <strong>Step Algorithm</strong> alternates between assigning points to the nearest centroid and shifting centroids to the mean of their cluster.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <canvas id="kmeans-canvas" width="350" height="300" style="border: 2px solid var(--border); background: var(--card-bg);"></canvas>
                    
                    <div class="playground-box" style="width: 100%;">
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <label>Clusters K: <input type="range" id="kmeans-k-slider" min="2" max="5" step="1" value="3"></label> <span id="kmeans-k-val">3</span>
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
        'preprocessing': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[DATA_PREPROCESSING // STANDARDIZATION]</div>
                <h2>13. Data Preprocessing</h2>
                <p>Standardization centers features to zero mean ($\mu=0$) and unit variance ($\sigma=1$). Click buttons to transform the data and observe the shift on the graph.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <canvas id="pre-canvas" width="350" height="250" style="border: 2px solid var(--border); background: var(--card-bg);"></canvas>
                    
                    <div class="playground-box" style="width: 100%;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <div style="display: flex; gap: 8px;">
                                <button id="pre-standardize-btn" class="submit-btn">Standardize (Z-Score)</button>
                                <button id="pre-normalize-btn" class="submit-btn">Normalize (Min-Max)</button>
                            </div>
                            <button id="pre-reset-btn" class="review-btn">Reset</button>
                        </div>
                        <div class="cyber-result" id="pre-stats-display" style="font-family: monospace; font-size: 0.9rem; text-align: center;">
                            Raw - X Range: [1000, 5000], Y Range: [1, 5]
                        </div>
                    </div>
                </div>
            </div>
        `,
        'genetic-algorithms': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[GENETIC_ALGORITHMS // EVOLUTION]</div>
                <h2>14. Genetic Algorithms</h2>
                <p>Genetic algorithms simulate natural selection. Press "Run Next Gen" to execute selection, crossover, and mutation, driving the population's binary fitness upwards.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <div id="ga-population" style="display: flex; flex-direction: column; gap: 6px; width: 100%; max-width: 320px; font-family: monospace;"></div>
                    
                    <div class="playground-box" style="width: 100%;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <button id="ga-step-btn" class="submit-btn">Run Next Gen</button>
                            <button id="ga-reset-btn" class="review-btn">Reset</button>
                        </div>
                        <div class="cyber-result" id="ga-info-display" style="font-family: monospace; font-size: 1rem; text-align: center; padding: 10px 0;">
                            Gen: 0 | Average Fitness: 0.0
                        </div>
                    </div>
                </div>
            </div>
        `,
        'pso': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[PARTICLE_SWARM // SEARCH_OPTIMUM]</div>
                <h2>15. Particle Swarm Optimization</h2>
                <p>PSO mimics bird flocking behavior. Step the simulation to watch particles coordinate and steer velocities toward their personal bests and the global best minimum.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <canvas id="pso-canvas" width="350" height="250" style="border: 2px solid var(--border); background: var(--card-bg);"></canvas>
                    
                    <div class="playground-box" style="width: 100%;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <button id="pso-step-btn" class="submit-btn">Step Swarm</button>
                            <button id="pso-reset-btn" class="review-btn">Reset Swarm</button>
                        </div>
                        <div class="cyber-result" id="pso-status-msg" style="font-family: monospace; font-size: 0.95rem; text-align: center; padding: 8px 0;">
                            Swarm initialized. Click Step to iterate.
                        </div>
                    </div>
                </div>
            </div>
        `,
        'aco': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[ANT_COLONY_OPTIMIZATION // PHEROMONE]</div>
                <h2>16. Ant Colony Optimization</h2>
                <p>Ants lay down pheromone trails to explore paths. Click Step to animate ants discovering the shortest route, reinforcing trails through positive feedback.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <canvas id="aco-canvas" width="350" height="250" style="border: 2px solid var(--border); background: var(--card-bg);"></canvas>
                    
                    <div class="playground-box" style="width: 100%;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <button id="aco-step-btn" class="submit-btn">Step Ants</button>
                            <button id="aco-reset-btn" class="review-btn">Reset Colony</button>
                        </div>
                        <div class="cyber-result" id="aco-status-msg" style="font-family: monospace; font-size: 0.95rem; text-align: center; padding: 8px 0;">
                            Pheromones uniform. Click Step to release ants.
                        </div>
                    </div>
                </div>
            </div>
        `,
        'fuzzy-logic': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[FUZZY_LOGIC // MEMBERSHIP]</div>
                <h2>17. Fuzzy Logic</h2>
                <p>Fuzzy logic handles degrees of truth. Move the slider to compute membership levels (Young, Adult, Old) across overlapping fuzzification curves.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <canvas id="fuzzy-canvas" width="350" height="180" style="border: 2px solid var(--border); background: var(--card-bg);"></canvas>
                    
                    <div class="playground-box" style="width: 100%;">
                        <div style="margin-bottom: 15px;">
                            <label>Input Age: <input type="range" id="fuzzy-age-slider" min="0" max="100" value="30"></label> <span id="fuzzy-age-val">30</span>
                        </div>
                        <div class="cyber-result" id="fuzzy-outputs-display" style="font-family: monospace; font-size: 0.95rem; line-height: 1.6;">
                            Fuzzy Sets: Young: 0.40, Adult: 0.60, Old: 0.00
                        </div>
                    </div>
                </div>
            </div>
        `,
        'rule-based-systems': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[RULE_BASED // FORWARD_CHAINING]</div>
                <h2>18. Rule-Based Systems</h2>
                <p>Forward chaining infers facts by checking triggered rule thresholds. Click Step to propagate rules and expand the facts database.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; gap: 20px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%;">
                        <div style="border: 1px solid var(--border); padding: 8px; background: rgba(0,0,0,0.2);">
                            <div style="font-size:0.8rem; opacity:0.6; margin-bottom:5px;">Fact Base</div>
                            <div id="rule-facts-box" style="font-family:monospace; font-size:0.9rem; line-height:1.4;">A, B</div>
                        </div>
                        <div style="border: 1px solid var(--border); padding: 8px; background: rgba(0,0,0,0.2);">
                            <div style="font-size:0.8rem; opacity:0.6; margin-bottom:5px;">Rules List</div>
                            <div id="rule-rules-box" style="font-family:monospace; font-size:0.8rem; line-height:1.4;">R1: A & B → C<br>R2: C → D</div>
                        </div>
                    </div>
                    
                    <div class="playground-box" style="width: 100%;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <button id="rule-chain-btn" class="submit-btn">Step Chain</button>
                            <button id="rule-reset-btn" class="review-btn">Reset facts</button>
                        </div>
                        <div class="cyber-result" id="rule-log-display" style="font-family: monospace; font-size: 0.9rem; padding: 8px 0; text-align: center;">
                            Initial facts loaded. Ready to infer.
                        </div>
                    </div>
                </div>
            </div>
        `,
        'search-strategies': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[SEARCH_STRATEGIES // BFS_DFS]</div>
                <h2>19. Search Strategies</h2>
                <p>Heuristics and search paths solve grids. Select BFS (breadth search queue) or DFS (depth search stack) to animate exploration towards the exit.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <canvas id="search-canvas" width="250" height="250" style="border: 2px solid var(--border); background: var(--card-bg);"></canvas>
                    
                    <div class="playground-box" style="width: 100%;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <label>Strategy:
                                <select id="search-type-select" class="cyberpunk-input" style="background:var(--bg); border:1px solid var(--border); color:var(--text); padding: 4px;">
                                    <option value="bfs">BFS (Queue)</option>
                                    <option value="dfs">DFS (Stack)</option>
                                </select>
                            </label>
                            <div style="display: flex; gap: 8px;">
                                <button id="search-animate-btn" class="submit-btn">Run Search</button>
                                <button id="search-reset-btn" class="review-btn">Reset</button>
                            </div>
                        </div>
                        <div class="cyber-result" id="search-info-display" style="font-family: monospace; font-size: 0.9rem; text-align: center; padding: 6px 0;">
                            Grid maze initialized. Press Run.
                        </div>
                    </div>
                </div>
            </div>
        `,
        'reinforcement-learning': `
            <div class="topic-card cyberpunk-card">
                <div class="cyber-badge">[REINFORCEMENT_LEARNING // Q_LEARNING]</div>
                <h2>20. Reinforcement Learning & Grid World</h2>
                <p>Reinforcement agents learn optimal paths via rewards. In reinforcement learning, an agent is trained via trial and error. The grid world below consists of Start (S), Goal (G, +10 Reward), Obstacles (X, -5 Reward), and blank spots (step penalty -1). Navigate the agent manually or click "Run Q-Learning" to train state-action Q-values automatically and trace the optimal path.</p>
                
                <div class="playground-layout" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <div id="gridworld-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; max-width: 320px; margin: 0 auto;"></div>
                    
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

    const contentHtml = topics[topicKey] || '<div class="topic-card"><h2>Topic under construction</h2></div>';
    return contentHtml;
}

// Interactive Perceptron logic (Page 0 of neural-networks)
window.updatePerceptron = function() {
    const w1 = parseFloat(document.getElementById('w1-slider').value);
    const w2 = parseFloat(document.getElementById('w2-slider').value);
    document.getElementById('w1-val').innerText = w1.toFixed(1);
    document.getElementById('w2-val').innerText = w2.toFixed(1);
    
    const x1 = 1, x2 = 0, b = 0.1;
    const sum = (w1 * x1) + (w2 * x2) + b;
    const output = sum > 0 ? 1 : 0;
    
    document.getElementById('perceptron-result').innerText = `Output: ${output} (Sum: ${sum.toFixed(2)})`;
    
    const resultBox = document.getElementById('perceptron-result');
    if (output === 1) {
        resultBox.style.boxShadow = '0 0 10px #52f47b';
        resultBox.style.color = '#52f47b';
    } else {
        resultBox.style.boxShadow = '0 0 10px #8b5cf6';
        resultBox.style.color = '#8b5cf6';
    }
}
