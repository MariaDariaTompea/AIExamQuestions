// Complete Question Bank for AI Learning Platform
const questions = [
  {
    "question": "In order to overcome the perceptron's limits, we can:",
    "answers": [
      "use neurons with a continuous threshold",
      "use kernel transformations on the domain",
      "these limits can't be overcome",
      "increase the number of neurons"
    ],
    "correct": "ad"
  },
  {
    "question": "What problems can be solved with machine learning?",
    "answers": [
      "regressions",
      "???",
      "plannings and classifications",
      "none of the above"
    ],
    "correct": "ac"
  },
  {
    "question": "The objective of a machine learning algorithm can be represented as:",
    "answers": [
      "numeric functions",
      "probabilistic functions",
      "a set of symbolic rules",
      "a table"
    ],
    "correct": "abcd"
  },
  {
    "question": "The induction phase for the process of building a decision tree is:",
    "answers": [
      "it labels the new data with the build rules",
      "it eliminates the branches that reflect noise & exceptions",
      "based on the training data",
      "works bottom-up or top-down"
    ],
    "correct": "cd"
  },
  {
    "question": "What is a tensor?",
    "answers": [
      "an image with multiple",
      "a mathematical object",
      "generalizations of scalars, vectors, and matrices in an arbitrary number of indices",
      "none of the above"
    ],
    "correct": "bc"
  },
  {
    "question": "Select the correct combination(s):",
    "answers": [
      "Output type: Continuous Output distribution: Gaussian Output layer: Linear Cost function: MSE",
      "Output type: Discrete Output distribution: Multinoulli Output layer: Softmax Cost function: Cross Entropy",
      "Output type: Binary Output distribution: Bernoulli Output layer: Sigmoid Cost function: BCE",
      "none of the above"
    ],
    "correct": "abc"
  },
  {
    "question": "What are the differences and similarities between the perceptron's rule and the delta rule?",
    "answers": [
      "In the delta rule, the model's quality is established based on all the data.",
      "The perceptron's rule is based on gradient descent.",
      "They both start with some random weights.",
      "Perceptron's rule recomputes the weights based on while the delta rule.",
      "The perceptron rule and delta rule always converge to the global optimum and are not affected by local minima.",
      "The perceptron rule and delta rule do not require any iterative optimization process and can achieve optimal weights in a single pass."
    ],
    "correct": "ac"
  },
  {
    "question": "What elements determine the velocity of a particle in a PSO algorithm (check all correct ones):",
    "answers": [
      "the old velocity",
      "inertia, social coefficient",
      "the current position of the particle",
      "none of the above"
    ],
    "correct": "abc"
  },
  {
    "question": "The limited model capacity of an ANN can be overcome by:",
    "answers": [
      "adding more layers in depth",
      "reducing the number of artificial neurons",
      "adding nonlinearity to the model",
      "none of the above"
    ],
    "correct": "c"
  },
  {
    "question": "What is the fitness function for the following problem: \"There is a set of M cards printed with integer numbers from -10 to 10. Select two subsets (that have no common elements and do not necessarily form a partition) using a GA, in such a way that they have the same sum of elements\"?",
    "answers": [
      "the absolute value of the sum of the selected elements from the first set / the number of elements from the second set.",
      "the difference in absolute value between the sum of the subset' elements and their divisors",
      "the difference in absolute value between the sums of elements from each subset",
      "the number of elements"
    ],
    "correct": "c"
  },
  {
    "question": "The Perceptron's algorithm:",
    "answers": [
      "is based on error minimization associated with an instance of train data",
      "the error is the difference between the real output y and the output o computed by the perceptron for an input",
      "it modifies the weights based on errors associated with an instance of train data",
      "none of the above"
    ],
    "correct": "abc"
  },
  {
    "question": "The \"dying ReLU\" problem refers to:",
    "answers": [
      "the values of the derivative",
      "the vanishing gradient",
      "the values of the function",
      "none of the above"
    ],
    "correct": "a"
  },
  {
    "question": "Choose the correct compatibility between the error function and the activation function from the output layer:",
    "answers": [
      "cross entropy error with softmax",
      "binary cross entropy with logistic error with the sigmoid activation function",
      "mean square error with the linear function",
      "none of the above"
    ],
    "correct": "abc"
  },
  {
    "question": "How does a ConvNet compute an image?",
    "answers": [
      "in such a network, the filters results are never combined",
      "there is automation in detecting the weights for the kernels",
      "there are usually three stages; several convolutions, a detector stage, and a pooling stage",
      "none of the above"
    ],
    "correct": "bc"
  },
  {
    "question": "Select the correct statements for Cross-Entropy loss:",
    "answers": [
      "is used in classifications",
      "is the difference between two probability distributions for a provided set of occurrences or random variables",
      "is never used after the softmax transformation after output",
      "none of the above"
    ],
    "correct": "ab"
  },
  {
    "question": "What are the properties of the training and testing data?",
    "answers": [
      "they have to respect the same distribution law",
      "the test data should be based on real experiences, and the training should be based on theoretical experiences",
      "if possible, the training and the data test should be disjunct sets",
      "none of the above"
    ],
    "correct": "ac"
  },
  {
    "question": "The harmonic mean between the precision and the recall is:",
    "answers": [
      "a metric for distance in a reinforcement learning algo",
      "the F1 score",
      "a statistical metric used to evaluate performance in a supervised learning process",
      "none of the above"
    ],
    "correct": "bc"
  },
  {
    "question": "When we compare two algorithms, we can use:",
    "answers": [
      "the divergence of the Accuracy",
      "confidence intervals",
      "performance measures",
      "none of the above"
    ],
    "correct": "bc"
  },
  {
    "question": "How are the neurons connected in a feed forward ANN?",
    "answers": [
      "through a backward signal",
      "through an output with a neuron from the same layer",
      "they are not connected",
      "through weighted links"
    ],
    "correct": "d"
  },
  {
    "question": "What sort of problems can a perceptron solve?",
    "answers": [
      "linear separation of elements from the domain",
      "XOR problem",
      "depends on the structure",
      "none of the above"
    ],
    "correct": "a"
  },
  {
    "question": "The vanishing gradients during backpropagation are:",
    "answers": [
      "not affecting us since the derivative is zero in this case on most of the domain",
      "are advantage in the training process that leads to faster convergence",
      "a typical problem when the network has too many hidden layers",
      "none of the above"
    ],
    "correct": "c"
  },
  {
    "question": "The activation logistic function:",
    "answers": [
      "is a linear function",
      "suffers from a vanishing gradient",
      "has limitations regarding the output domain",
      "has limitations regarding the input domain",
      "none of the above"
    ],
    "correct": "bc"
  },
  {
    "question": "An ANN with a structure of 226:15:10:2 with a sigmoid activation function. How many weights will the first neuron from the first hidden layer have?",
    "answers": [
      "2",
      "226",
      "10",
      "15"
    ],
    "correct": "b"
  },
  {
    "question": "In an artificial neuron, the transfer function:",
    "answers": [
      "is the equation of a hyperplane",
      "its nature limits the solving capacity of the neuron",
      "is the inner product of the input vector with the weight vector",
      "it can be the sigmoid function"
    ],
    "correct": "ac"
  },
  {
    "question": "The indirect experience when choosing the training database is:",
    "answers": [
      "in pairs (in/out)",
      "useful feedback for the objective function",
      "based on independent data with annotated content",
      "none of the above"
    ],
    "correct": "b"
  },
  {
    "question": "On a ConvNet, feature learning:",
    "answers": [
      "will minimize the loss function by extracting those who are most useful for classifying the images.",
      "allows a suite of tens or even hundreds of other small filters to be designed in order to detect more complex features in the image",
      "is performed before training the conv. layers",
      "none of the above"
    ],
    "correct": "ab"
  },
  {
    "question": "We can implement the infinite summation as a sum over a finite number of array elements:",
    "answers": [
      "in practice, we have two tensors: the input and the kernel",
      "such implementation is impossible in practice",
      "the input and the kernel are zero everywhere bet in the finite set of points",
      "by using a convolution operation"
    ],
    "correct": "d"
  },
  {
    "question": "Clustering is:",
    "answers": [
      "a process in two steps: training and testing",
      "using an unlabeled database",
      "another name for unsupervised learning",
      "none of the above"
    ],
    "correct": "abc"
  },
  {
    "question": "What are the correct statements about Decision Trees?",
    "answers": [
      "The decision nodes are located at the terminal levels of the tree while the result nodes are at the internal levels.",
      "Each leaf of the tree corresponds to a specific attribute or feature.",
      "They are used to divide a collection of articles into smaller sets by successively applying decision rules.",
      "Decision trees contain four types of nodes: decision nodes, hazard nodes, class nodes, and result nodes."
    ],
    "correct": "c"
  },
  {
    "question": "The activation logistic function:",
    "answers": [
      "suffers from vanishing gradient.",
      "is a linear function.",
      "has limitations regarding the input domain.",
      "none of the above."
    ],
    "correct": "a"
  },
  {
    "question": "Clustering is:",
    "answers": [
      "a one-step process: testing.",
      "Another name for unsupervised learning.",
      "using a labeled database.",
      "none of the above."
    ],
    "correct": "b"
  },
  {
    "question": "What is a feature of the database in training with indirect experience:",
    "answers": [
      "it is based on useful feedback for some objective function.",
      "it comes in pairs (in/out).",
      "it is based on independent data with annotated content.",
      "none of the above."
    ],
    "correct": "a"
  },
  {
    "question": "An ANN has a structure of 26:15:10:2 with a sigmoid activation function. How many weights will have the first neuron from the first hidden layer?",
    "answers": [
      "2",
      "15",
      "26",
      "10"
    ],
    "correct": "c"
  },
  {
    "question": "When constructing a decision tree, the attribute selection can be:",
    "answers": [
      "In preorder.",
      "Random.",
      "Based on the top parent.",
      "None of the above."
    ],
    "correct": "b"
  },
  {
    "question": "The induction phase of the process of building a Decision Tree is:",
    "answers": [
      "It labels the new data with the built rules.",
      "It eliminates the branches that reflect noise or exception",
      "Based on the training data.",
      "Works bottom to bottom or top to top."
    ],
    "correct": "c"
  },
  {
    "question": "The back-propagation algorithm:",
    "answers": [
      "Is a training algorithm for ANNs.",
      "Guarantees finding the optimal set of weights and biases in a finite number of iterations.",
      "Can only be applied to shallow neural networks and is not suitable for deep learning architectures.",
      "None of the above."
    ],
    "correct": "a"
  },
  {
    "question": "Select the correct statements for Cross-Entropy loss:",
    "answers": [
      "Is never used when we apply the softmax transformation to the network's output.",
      "Is used in regressions.",
      "Is the difference between two probability distributions for a provided set of occurrences or random variables.",
      "None of the above."
    ],
    "correct": "c"
  },
  {
    "question": "What are the characteristics of the back-propagation algorithm?",
    "answers": [
      "It is crossing easy plateaus in the error function landscape.",
      "Does not require the derivatives of activation functions to be known at network design time.",
      "Is guaranteed to find the global minimum of the error function, not only the local minimum.",
      "None of the above."
    ],
    "correct": "d"
  },
  {
    "question": "What is the proper encoding for an individual in ANNs?",
    "answers": [
      "A computer program that learns to classify and performs regressions.",
      "A set of weights used to propagate a signal.",
      "There are no individuals in ANN.",
      "An array of bits that encode proper information related to the solution."
    ],
    "correct": "c"
  },
  {
    "question": "On a ConvNet, the feature learning:",
    "answers": [
      "Allows a suite of tens or even hundreds of other small filters to be erased in order to detect more complex features in the image.",
      "Is performed before training the conv-layers.",
      "Will minimize the loss function by extracting the features that are most useful for classifying the images.",
      "None of the above."
    ],
    "correct": "c"
  },
  {
    "question": "The \"dying ReLU\" problem refers to:",
    "answers": [
      "The values of the derivative.",
      "The values of the function.",
      "The vanishing gradient.",
      "None of the above."
    ],
    "correct": "a"
  },
  {
    "question": "The universal approximation theorem states that:",
    "answers": [
      "Any function can be approximated with a proper neural network.",
      "There should be enough neurons on the hidden layer in order to do the approximation.",
      "The conditions to approximate a function include the continuity of that function.",
      "None of the above."
    ],
    "correct": "a"
  },
  {
    "question": "What is a tensor?",
    "answers": [
      "A generalization of scalars, vectors, and matrices to an arbitrary number of indices.",
      "A mathematical object that contains a one-dimensional array of values.",
      "A black and white image with multi-channels.",
      "None of the above."
    ],
    "correct": "a"
  },
  {
    "question": "How does a ConvNet figure out what is in an image?",
    "answers": [
      "Automatically detecting the weights for the kernels during training.",
      "By decomposing the features.",
      "There are usually three stages: several convolutions, a decomposing stage, a flatten stage.",
      "None of the above."
    ],
    "correct": "a"
  },
  {
    "question": "The softmax function:",
    "answers": [
      "Transforms in probabilities the output scores for the classes.",
      "It incorporates the cross-entropy function.",
      "Is used in regressions.",
      "None of the above."
    ],
    "correct": "a"
  },
  {
    "question": "Select the correct combination:",
    "answers": [
      "Output type: Discrete, Output Distribution: Multinoulli, Output Layer: Linear, Cost Function: Cross Entropy.",
      "Output type: Binary, Output Distribution: Bernoulli, Output Layer: Sigmoid, Cost Function: Binary Cross Entropy.",
      "Output type: Continuous, Output Distribution: Gaussian, Output Layer: Softmax, Cost Function: MSE.",
      "None of the above."
    ],
    "correct": "b"
  },
  {
    "question": "The L1 loss is:",
    "answers": [
      "It computes the average of the sum of absolute differences between actual values and predicted ones",
      "Used for classification problems",
      "Is also called the softmax loss",
      "Is never used when the distribution has outliers"
    ],
    "correct": "a"
  },
  {
    "question": "What is the difference between Particle Swarm Optimization (PSO) and Genetic Algorithms (GA)?",
    "answers": [
      "PSO runs free until it converges to the solution, while GA never reaches the solution",
      "The particles have a memory, while the individuals don't",
      "GA has particles, and PSO has individuals",
      "GA uses a fitness function, and PSO doesn't"
    ],
    "correct": "b"
  },
  {
    "question": "How does the artificial neuron process the information?",
    "answers": [
      "Based on backpropagation",
      "Based on the activation function",
      "Based on the error",
      "None of the above"
    ],
    "correct": "b"
  },
  {
    "question": "What are the main advantages of Deep Convolutional Neural Networks?",
    "answers": [
      "The architecture of a ConvNet is analogous to that of the connectivity pattern of neurons in an Artificial Cortex",
      "A ConvNet captures the feature gradient dependencies in a time series",
      "The preprocessing required in a ConvNet is much lower as compared to other classification algorithms",
      "None of the above"
    ],
    "correct": "c"
  },
  {
    "question": "What can be used when comparing two algorithms?",
    "answers": [
      "The divergence of accuracy",
      "Overconfidence intervals",
      "Performance measures",
      "None of the above"
    ],
    "correct": "c"
  },
  {
    "question": "What are the advantages of going in depth in an ANN?",
    "answers": [
      "To avoid overfitting",
      "To speed up the network's evaluation",
      "We avoid underfitting the model",
      "None of the above"
    ],
    "correct": "a"
  },
  {
    "question": "How is the objective of a machine learning algorithm typically represented?",
    "answers": [
      "A database table",
      "Numeric functions",
      "Distributions of probability",
      "A set of non-symbolic rules"
    ],
    "correct": "b"
  },
  {
    "question": "In order to overcome the perceptron's limits, we can:",
    "answers": [
      "Installing additional RAM directly enhances the neuron's processing power",
      "These limits can't be overcome",
      "Use neurons with a continuous threshold",
      "Applying the glitter property to the perceptron's activation function improves its ability to learn"
    ],
    "correct": "c"
  },
  {
    "question": "The vanishing gradients during backpropagation is:",
    "answers": [
      "An advantage in the training process that leads to faster convergence",
      "Since the derivative is zero in this case, on most of the domain, it does not affect us",
      "A problem typical when the network has too many hidden layers",
      "None of the above"
    ],
    "correct": "c"
  },
  {
    "question": "What problems can be solved with machine learning?",
    "answers": [
      "Ethical and moral considerations",
      "Planning and classifications",
      "Creative problems that require innovation",
      "None of the above"
    ],
    "correct": "b"
  },
  {
    "question": "The harmonic mean between precision and recall is:",
    "answers": [
      "A measure for distance in certain clustering algorithms.",
      "The F1 score, which combines precision and recall into a single value.",
      "A metric used to evaluate the trade-off between precision and recall in deterministic algorithms.",
      "None of the above."
    ],
    "correct": "b"
  },
  {
    "question": "The information gain ratio:",
    "answers": [
      "It aims to reduce a bias towards multivalued attributes.",
      "Is the ratio between the information gain and the split information.",
      "It enhances an attribute by integrating a new term that depends on spreading degree.",
      "None of the above."
    ],
    "correct": "ab"
  },
  {
    "question": "We can implement the infinite summation as a sum over a finite number of array elements:",
    "answers": [
      "Such implementation is impossible in practice.",
      "In practice, we have two tensors: the input and the padding.",
      "By using a convolution operation.",
      "The input, the padding, and the kernel contain random numbers everywhere in the beginning."
    ],
    "correct": "c"
  },
  {
    "question": "What are the differences and similarities between the perceptron's rule and the delta rule?",
    "answers": [
      "The perceptron rule and delta rule always converge to the global optimum and are not affected by local minima.",
      "The perceptron rule and delta rule do not require any iterative optimization process and can achieve optimal weights in a single pass.",
      "They both start with some random weights.",
      "None of the above."
    ],
    "correct": "c"
  },
  {
    "question": "For Unsupervised Learning, choose the appropriate statement:",
    "answers": [
      "The training data comes in pairs: (attributes, outputs).",
      "It finds an unknown function that groups the training data into several classes.",
      "The goal is to find a model or structure inside the data that is useful.",
      "None of those things."
    ],
    "correct": "bc"
  },
  {
    "question": "The ReLU function:",
    "answers": [
      "Provides sparsity since y = 0 when x > 0",
      "Does not correct the problems that occur at sigmoid function",
      "It is a linear activation function",
      "Does not have a vanishing gradient when x > 0"
    ],
    "correct": "d"
  },
  {
    "question": "What elements determine the new velocity of a particle in a PSO algorithm? (check all correct ones)",
    "answers": [
      "The current position of the weakest particle",
      "Inertia, social coefficient",
      "The old velocity of the best particle",
      "None of the above."
    ],
    "correct": "b"
  },
  {
    "question": "In computer vision, we apply a filter over an image:",
    "answers": [
      "By using a convolution operation with a kernel",
      "Moving the kernel and adding to the part of the image that the kernel is hovering over.",
      "In order to preprocess the input by subtracting some features from the initial image.",
      "None of the above."
    ],
    "correct": "a"
  },
  {
    "question": "Choose the correct answer.",
    "answers": [
      "Backpropagation is insensitive to the choice of activation functions and can perform equally well with any activation function.",
      "The gradient descent is based on the error associated with the entire set of train data.",
      "Adding more training data will always result in better generalization and performance for the ANN.",
      "None of the above."
    ],
    "correct": "b"
  },
  {
    "question": "What is standardization?",
    "answers": [
      "A data transformation that introduces the scale effect.",
      "The process by which raw values are transformed into z-scores.",
      "The operation that transforms continuous values into discrete ones.",
      "None of the above."
    ],
    "correct": "b"
  },
  {
    "question": "What crossover method(s) are correct for a binary representation in a GA?",
    "answers": [
      "Uniform",
      "There is no crossover for this representation",
      "Average crossover",
      "Insertion mutation"
    ],
    "correct": "a"
  },
  {
    "question": "Using a feed forward ANN we want to determine if a shape from a black-and-white image is a square or not. How is the error computed?",
    "answers": [
      "Based on the output of the hidden layer.",
      "Based on an induction formula.",
      "Based on the difference between the real output of the network and the desired output.",
      "None of the above."
    ],
    "correct": "c"
  },
  {
    "question": "Which factor is the primary consideration when selecting an appropriate learning algorithm?",
    "answers": [
      "Ability to predict cluster membership.",
      "Minimization of error through a cost function or loss function.",
      "Alignment with the desired data.",
      "Computational complexity of the target objective."
    ],
    "correct": "c"
  },
  {
    "question": "Choose the right compatibility between the output layer's activation function and error function:",
    "answers": [
      "Mean square error with the linear function.",
      "Binary cross entropy with logistic error with the sigmoid activation function.",
      "Cross entropy error with arctangent.",
      "None of the above."
    ],
    "correct": "ab"
  },
  {
    "question": "In an artificial neuron, the transfer function:",
    "answers": [
      "Represents the equation of a hyperplane.",
      "Utilizes entanglement to calculate the output.",
      "Requires the neuron to perform complex mathematical operations with imaginary numbers.",
      "Is the sigmoid function."
    ],
    "correct": "a"
  },
  {
    "question": "The Perceptron's algorithm:",
    "answers": [
      "It changes the weights based on the inverse error associated with a train data instance.",
      "Is based on maximizing the error for a given set of train data.",
      "The error is the difference between what the real output y is and what the perceptron's output o is for a given input.",
      "None of the above."
    ],
    "correct": "c"
  },
  {
    "question": "What is the relationship between the training and testing data?",
    "answers": [
      "The test data should reflect real-life experiences, while the training data can be based on theoretical experiences.",
      "They should follow the same distribution.",
      "The two sets must overlap.",
      "None of the above."
    ],
    "correct": "b"
  },
  {
    "question": "What sort of problems can a perceptron solve?",
    "answers": [
      "Linear separations of elements from the domain.",
      "It depends on the structure.",
      "XOR problem.",
      "None of the above."
    ],
    "correct": "a"
  },
  {
    "question": "The limited model capacity of ANNs is overcome by:",
    "answers": [
      "Reducing the number of artificial neurons.",
      "Adding nonlinearity to the model.",
      "Adding more layers at the output level.",
      "None of the above."
    ],
    "correct": "b"
  },
  {
    "question": "Select the correct statement for supervised learning:",
    "answers": [
      "The aim is to provide an arbitrary output for a new input.",
      "The training data comes in an unpaired format: only attributes or only output.",
      "We search for a known function that maps the input attributes to the outputs.",
      "None of the above."
    ],
    "correct": "d"
  },
  {
    "question": "How are the neurons connected into a feed forward ANN?",
    "answers": [
      "Through a backward signal.",
      "Through an output with a neuron from the same layer.",
      "They are not connected.",
      "Through weighted links."
    ],
    "correct": "d"
  },
  {
    "question": "Which of the following statements is true when we apply a max pooling transformation over a tensor:",
    "answers": [
      "We return the maximum value from the portion of the image covered by the kernel.",
      "We handle inputs of different types.",
      "We emphasize the features.",
      "We make the representation dependent on small translations of the input."
    ],
    "correct": "a"
  },


  //////////////////////////////////////////////////////
  // NEW QUESTIONS ADDED
  //////////////////////////////////////////////////////

  // EXAM-MATERIALS SUBJECT   -- Nu stiu daca sunt bune

  {
    "question": "What is a proper encoding for an individual in Genetic Programming?",
    "answers": [
      "a string of bits",
      "depends on the problem",
      "a computer program that solves the given problem",
      "a binary expression"
    ],
    "correct": "c"
  },
  {
    "question": "Which one(s) of the following problems can’t be solved by a perceptron?",
    "answers": [
      "AND logic",
      "any problem that implies finding a function",
      "XOR",
      "OR logic"
    ],
    "correct": "c"
  },
  {
    "question": "What are the main specific features of a particle in PSO optimisation?",
    "answers": [
      "Velocity and trace",
      "Fitness function",
      "Current position and velocity",
      "There is no specific feature"
    ],
    "correct": "c"
  },
  {
    "question": "Which one of the following representations is NOT proper for the N-Queen problem?",
    "answers": [
      "Binary",
      "Vectors of N integers",
      "Vectors of N real numbers",
      "Permutation of N size"
    ],
    "correct": "a"
  },
  {
    "question": "What is the fitness function for the N-Queen problem?",
    "answers": [
      "The number of queens placed on the same line",
      "The number of queens placed on the same column",
      "The number of queens that attack each other",
      "The difference in absolute value between the number of queens that attack each other on line and the number of queens that attack each other on columns"
    ],
    "correct": "c"
  },
  {
    "question": "On what is based the ant colony system?",
    "answers": [
      "On an evolutionary schema",
      "The pheromone trace left by ants",
      "Inertia and speed",
      "Identical with PSO"
    ],
    "correct": "b"
  },
  {
    "question": "How is propagated the error into an artificial neural network that uses back-propagation?",
    "answers": [
      "In the same direction as the input signal",
      "You don’t compute the error for this algorithm",
      "In both directions",
      "It propagates backwards through the network"
    ],
    "correct": "d"
  },
  {
    "question": "Using an ANN to decide if a 15×10-pixel black-and-white image contains a circle (structure 150:15:20:2, sigmoid activation), what type of problem is this?",
    "answers": [
      "Regression",
      "Clustering",
      "Classification",
      "Dimensionality reduction"
    ],
    "correct": "c"
  },
  {
    "question": "In the same ANN (150:15:20:2), how many weights does each neuron in the last layer have (not counting its bias)?",
    "answers": [
      "15",
      "20",
      "2",
      "150"
    ],
    "correct": "b"
  },
  {
    "question": "On what does the adjustment value of the weights depend when training with back-propagation?",
    "answers": [
      "The learning rate and the gradient of the error",
      "The total number of training epochs",
      "The random seed used to initialize weights",
      "The number of hidden layers"
    ],
    "correct": "a"
  },
  {
    "question": "Specify the correct statement(s) in a ruled based system in certain environments inference engine with forward-chaining:",
    "answers": [
      "The inference engine can draw new conclusions",
      "Facts are represented in a working memory which is continually updated",
      "The actions usually involve adding or deleting items from working memory",
      "Rules are written as left-hand side (LHS) ⇒ right-hand side (RHS)"
    ],
    "correct": "abcd"
  },
  {
    "question": "For a Genetic Programming algorithm identify the correct statement(s):",
    "answers": [
      "Convergence (complete, optimal) through global optima is slow",
      "Easy to implement",
      "The solution’s quality depends on the precision of variables involved in the algorithm",
      "The main disadvantage is that it does depend on parameters"
    ],
    "correct": "cd"
  },
  {
    "question": "Which of the following selection methods are commonly used in evolutionary algorithms? (choose all that apply)",
    "answers": [
      "Roulette‐wheel selection",
      "Tournament selection",
      "Rank‐based selection",
      "Elitism (truncation) selection",
      "Random selection",
      "Gradient‐descent selection"
    ],
    "correct": "abcd"
  },
  {
    "question": "In applying a genetic algorithm to select a subset of integer‐engraved balls whose sum is as close as possible to S, which design choices are appropriate? (choose all that apply)",
    "answers": [
      "Binary string representation (1 = include, 0 = exclude)",
      "One‐point crossover and bit‐flip mutation operators",
      "Fitness = –|(sum of selected balls) – S| (maximize)",
      "Tournament selection",
      "Gradient‐descent operator"
    ],
    "correct": "abcd"
  },
  {
    "question": "For a person of 45 years old, consider the following fuzzy sets:\n- young: 1.0 up to 20, ramps down to 0.0 at 30\n- adult: ramps up from 20 to 30, flat at 1.0 from 30 to 50, then drops to 0.0\n- middle-age: ramps up from 40 to 55, then ramps down to 60 (value at 45 is 0.4)\n- old: 0.0 up to 50, ramps up to 60\nWhat are the membership values (μ) for each fuzzy set?",
    "answers": [
      "μ_young = 0.0, μ_adult = 1.0, μ_middle‐age = 0.4, μ_old = 0.0",
      "μ_young = 0.0, μ_adult = 0.8, μ_middle‐age = 0.2, μ_old = 0.0",
      "μ_young = 0.0, μ_adult = 0.7, μ_middle‐age = 0.3, μ_old = 0.0",
      "μ_young = 0.0, μ_adult = 1.0, μ_middle‐age = 0.3, μ_old = 0.0"
    ],
    "correct": "a"
  },
  {
    "question": "Which element(s) determine the probability for a new possible element to be added to the solution in an ant colony system? (choose all that apply)",
    "answers": [
      "Pheromone matrix values (τ)",
      "Visibility of nodes (η)",
      "Coefficient of pheromone importance (α)",
      "Coefficient of visibility importance (β)",
      "Genetic crossover operator"
    ],
    "correct": "abcd"
  },

  // 2024 SUBJECT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 

  {
    "question": "Consider fuzzy classes for a person’s age defined as follows:\n- young: 1.0 up to 20, ramps down to 0.0 at 30\n- adult: ramps up from 20 to 30, flat at 1.0 from 30 to 40, ramps down to 0.0 at 50\n- middle-age: ramps up from 40 to 50, ramps down to 60\n- old: ramps up from 50 to 60, flat at 1.0 from 60 onwards\nAfter fuzzifying the raw input data for a 35-year-old, we obtain the value:",
    "answers": [
      "μ_young(35) = 0.6; μ_adult(35) = 1; μ_middle_age(35) = 0.3; μ_old(35) = 0",
      "μ_young(35) = 0; μ_adult(35) = 1; μ_middle_age(35) = 0; μ_old(35) = 0",
      "μ_young(35) = 0.6; μ_adult(35) = 0.1; μ_middle_age(35) = 0.3; μ_old(35) = 0",
      "None of the above"
    ],
    "correct": "b"
  },

  // 2020 SUBJECT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  -- Astea sunt corecte !!
  {
    "question": "You have a problem that is NP-hard and you decide to attempt to solve it with Ant Colony Optimisation. In what sort of problem do you need to transform it?",
    "answers": [
      "Into a classification problem.",
      "You don't need to transform it, just let the algorithm do it for you.",
      "In a problem of identifying the optimal path in an oriented graph.",
      "Into the knapsack problem."
    ],
    "correct": "c"
  },
  {
    "question": "Consider two individuals (represented as permutations) of size 9: Parents are P1 = [1, 4, 6, 2, 3, 8, 5, 7, 9] and P2 = [2, 1, 9, 6, 5, 4, 7, 8, 3]. Apply an order crossover to them (copying the middle section and filling from the beginning of the other parent). What is the proper result if the cut points are after the 3rd and 6th position? (Select one or more)",
    "answers": [
      "[1, 9, 6, 8, 2, 3, 5, 4, 7] and [1, 2, 3, 5, 4, 6, 8, 7, 9]",
      "[1, 9, 8, 2, 3, 5, 6, 4, 7] and [1, 2, 6, 5, 4, 3, 8, 7, 9]",
      "[2, 1, 9, 2, 3, 8, 7, 8, 3] and [1, 4, 6, 6, 5, 4, 5, 7, 9]",
      "[1, 9, 6, 2, 3, 8, 5, 4, 7] and [1, 2, 3, 6, 5, 4, 8, 7, 9]"
    ],
    "correct": "d"
  },
  {
    "question": "Many AI methods are based on examples from nature. Particle Swarm Optimisation is based on:",
    "answers": [
      "In the theory of evolution.",
      "The behaviour of birds or murmuration of fish.",
      "This method is not inspired from nature as other AI methods.",
      "The random movements of particles."
    ],
    "correct": "b"
  },
  {
    "question": "You design an Evolutionary Algorithm for a given problem using a Generationist model. Select the correct properties of such a model that must be reflected within your application:",
    "answers": [
      "Each individual survives a generation only.",
      "A set of parents is totally replaced by the set of offsprings.",
      "At each generation it creates μ offsprings.",
      "A bad offspring is replaced by its parent."
    ],
    "correct": "abc"
  },
  {
    "question": "In a Binary Search Tree with root 50, left child 17 (which has children 12 and 23), right child 72 (which has children 54 and 76), where 12 has children 9 and 14, 23 has child 19, and 54 has child 67, in what order during a BFS search will the nodes be visited?",
    "answers": [
      "50, 17, 72, 12, 23, 54, 76, 9, 14, 19, 67",
      "50, 72, 17, 76, 54, 23, 12, 64, 19, 14, 9",
      "50, 17, 72, 54, 76, 12, 23, 9, 14, 19, 67",
      "None of the above"
    ],
    "correct": "ab"
  },
  {
    "question": "Choose the correct characteristics for the binary representation, primarily used in Evolutionary Computation:",
    "answers": [
      "There is usually an encoder and a decoder that allow the user to understand the stored information.",
      "Other values can appear within a binary representation but through survival selection and adjustments they are removed.",
      "These representations are lists of zeros and ones.",
      "Once a bit reaches a certain value (0 or 1) a cut is performed to preserve the genotype of the individual represented binary."
    ],
    "correct": "ac"
  },
  {
    "question": "When computing a velocity for a particle using a PSO method, you have a parameter inertia. Specify the correct properties of this parameter:",
    "answers": [
      "Can be constant or descending.",
      "Forces the particle to move in the same direction until now.",
      "Forces the particle to move towards its best position.",
      "Balances the search between global exploration and local exploration."
    ],
    "correct": "abd"
  },
  {
    "question": "How do you initialise an Artificial Neural Network?",
    "answers": [
      "There is no initialization; the network will learn from the dataset the initial values.",
      "The inputs will be zero.",
      "Randomly assign values to the weights.",
      "Randomly assign values to the outputs."
    ],
    "correct": "c"
  },

  {
    "question": "You want to train an Artificial Neural Network for a complex classification problem. The information from the dataset is labeled in four classes. Each entry is composed from an array of five attributes and a label. What is a possible structure for this problem?",
    "answers": [
      "5 : 6 : 4",
      "7 : 6 : 4",
      "5 : 6 : 2",
      "6 : 4"
    ],
    "correct": "a"
  },
  {
    "question": "Check the correct affirmations regarding a population of individuals in an Evolutionary algorithm.",
    "answers": [
      "The candidates to solutions should be uniformly distributed in the search space (if it is possible).",
      "The population doesn’t change its contents during the entire run of the algorithm.",
      "The population is randomly assigned in the beginning of the algorithm.",
      "The reproduction pool is selected from the current population."
    ],
    "correct": "acd"
  },
  {
    "question": "Consider a permutation of n elements as representation for the \"n-Queen\" problem. Please check all the categories where this representation belongs:",
    "answers": [
      "non-binary, discrete",
      "continuous",
      "tree based",
      "class-based",
      "binary"
    ],
    "correct": "a"
  },
  {
    "question": "Consider the following formula:\n\nv_id = w * v_id + c1 * rand() * (P_bestd – x_id) + c2 * rand() * (G_bestd – x_id)\n\nCheck the correct statements related to this formula:",
    "answers": [
      "c1 and c2 will be determined by the algorithm while running.",
      "v_id is the velocity of a particle.",
      "You can find in this formula the current position and also the best position of a particle.",
      "It updates the position of the particle."
    ],
    "correct": "bc"
  },
  {
    "question": "Consider two fuzzy classes: a red class described as triangular from 2 to 14 peaking at 8, and a green class described as triangular from 8 to 22 peaking at 15. If we evaluate at input x = 0 (which lies completely outside both supports), what is the membership degree to both classes (red and green)?",
    "answers": [
      "μ_red(10) = 0.66 and μ_green(10) = 2.85",
      "μ_red(10) = 0.25 and μ_green(10) = 0.75",
      "μ_red(10) = 2 and μ_green(10) = 0.5",
      "μ_red(10) = 0 and μ_green(10) = 0"
    ],
    "correct": "d"
  },
  {
    "question": "In a feed forward Artificial Neural Network there are connections between nodes from the same layer.",
    "answers": [
      "True",
      "False"
    ],
    "correct": "b"
  },
  {
    "question": "Check some of the possible activation functions from an Artificial Neural Network.",
    "answers": [
      "Gaussian function",
      "Linear function",
      "Sigmoid function",
      "Error function",
      "Constant function"
    ],
    "correct": "abce"
  },
  {
    "question": "You attempt to solve a problem that fits a binary representation with a PSO. What will you change in order to conserve the representation while you adapt the particles’ positions using the velocity?",
    "answers": [
      "The process of updating the particle's position.",
      "Reset the particle position every time you get out of the domain.",
      "Reduce the inertia so the new update position will not exceed the domain.",
      "The evaluation of the best particle."
    ],
    "correct": "a"
  },
  {
    "question": "The Ant Colony Optimisation (based on the social behaviour of ants) has some particularities. Check the correct statements from the following list:",
    "answers": [
      "The worst individuals are replaced with the best ones.",
      "The search is guided by the variation operators towards the ant queen.",
      "The search operators are constructive ones, adding elements in solution.",
      "The search is cooperative, guided by the relative quality of individuals."
    ],
    "correct": "cd"
  },
  {
    "question": "When adding a new element to the partial solution within an Ant Colony Optimisation Algorithm the following elements can be considered (check all correct ones):",
    "answers": [
      "Probability of crossover",
      "Pheromone matrix",
      "Coefficient of the trail importance",
      "Coefficient of visibility importance",
      "Visibility of the nodes"
    ],
    "correct": "bcde"
  },
  {
    "question": "During the fire process within an artificial neuron the following processes take place (order is unimportant):",
    "answers": [
      "Performs a simple computation through an activation function",
      "Compute the weighted sum of inputs",
      "Compute the difference between the real output and the computed output",
      "Modify the weights such to obtain better results"
    ],
    "correct": "ab"
  },
  {
    "question": "You design an Ant Colony Optimisation algorithm. What are the aspects related to each ant that must be considered?",
    "answers": [
      "The ant has a memory",
      "While constructing the path avoids nodes that already have an ant in them",
      "Cooperates with other ants through the pheromone trail",
      "Moves (in the search space) and puts some pheromones on its path"
    ],
    "correct": "acd"
  },
  {
    "question": "A solution for a problem that you have is represented as a binary array of 8 elements. After a mutation you get the following mutated offspring: (1,1,1,0,1,0,0,1). Considering that you used a weak mutation, check the possible parent(s).",
    "answers": [
      "(1,1,1,0,1,0,0,1)",
      "(0,0,0,1,0,1,1,0)",
      "(0,0,1,0,1,0,0,1)",
      "(1,1,1,0,1,0,1,1)"
    ],
    "correct": "ad"
  },
  {
    "question": "A fitness function for a given problem aims to:",
    "answers": [
      "Associate a value to each candidate solution.",
      "Determine if the problem is properly defined.",
      "Combine individuals with similar characteristics.",
      "Reflect the adaptation to the environment."
    ],
    "correct": "ad"
  },
  {
    "question": "The knowledge base of a RBS in uncertain environments contains:",
    "answers": [
      "Representations of the optimum solutions",
      "Rules",
      "Facts",
      "Positions"
    ],
    "correct": "bc"
  },
  {
    "question": "The Defuzzification is the transformation each fuzzy region into a crisp value.",
    "answers": [
      "True",
      "False"
    ],
    "correct": "a"
  },
  {
    "question": "Consider a complete Artificial Neural Network with the structure 4:6:2. How many weights will have the fourth artificial neuron from the hidden layer?",
    "answers": [
      "4",
      "6",
      "2",
      "12"
    ],
    "correct": "a"
  },
  {
    "question": "The coding type of a possible solution influences the following aspects from the Evolutionary Algorithm’s design:",
    "answers": [
      "It forces the use of a binary crossover",
      "The type of variation operators",
      "The expression of the fitness function",
      "The number of individuals in the population pool"
    ],
    "correct": "bc"
  },
  {
    "question": "You have to choose a stop condition for your PSO algorithm. Check the correct possibilities:",
    "answers": [
      "You never stop; this sort of algorithm runs forever adapting itself.",
      "When you found the parameters c₁ and c₂.",
      "When you reach a predefined number of iterations.",
      "After you evaluate the fitness function a predefined number of times."
    ],
    "correct": "cd"
  },
  {
    "question": "Check the specific elements for the Particle Swarm Optimisation method:",
    "answers": [
      "Inertia",
      "Memory",
      "Velocity",
      "Position"
    ],
    "correct": "abcd"
  },
  {
    "question": "In each iteration of an Ant Colony Optimisation Algorithm we have the following steps (order does not matter):",
    "answers": [
      "Increase the partial solution by an element.",
      "Change the pheromone trail on the paths traversed.",
      "We perform a mutation to the ant’s partial solution.",
      "Initialisation."
    ],
    "correct": "abd"
  },
  {
    "question": "Is cooperation part of a Particle Swarm Optimisation algorithm?",
    "answers": [
      "True",
      "False"
    ],
    "correct": "a"
  },
  {
    "question": "How do ants indirectly communicate in an Ant Colony Optimisation algorithm?",
    "answers": [
      "They do not communicate indirectly.",
      "By changing the chemical repository.",
      "The ants send signals to other ants not to follow them within the partial path.",
      "Accessing the pheromone matrix."
    ],
    "correct": "bd"
  },
  {
    "question": "What is the correspondence of an individual in evolutionary computation?",
    "answers": [
      "A metaphor for an animal from a herd of solutions.",
      "A possible candidate to be a solution for our problem.",
      "The problem solution evolved by random natural processes.",
      "A simple artificial lifeform that exists inside the computer, with its aim to solve our problems."
    ],
    "correct": "b"
  },
  {
    "question": "Which of the following problems can be solved with a perceptron? (Select one or more)",
    "answers": [
      "Facial recognition",
      "Logic \"AND\"",
      "Any problem that implies a linear separation of the space",
      "XOR"
    ],
    "correct": "bc"
  },
  {
    "question": "Consider an Artificial Neural Network that must be trained with the Backpropagation algorithm. Check the correct statements for this algorithm:",
    "answers": [
      "Modify the structure by adding or subtracting nodes from the hidden layer.",
      "Distribute the errors on all connections proportional to the weights and modify the weights.",
      "Forward propagate the information and determine the output of each neuron.",
      "Establish and backward propagate the error."
    ],
    "correct": "bcd"
  },
  {
    "question": "The ReLu function:",
    "answers": [
      "Provides sparsity since y=0 when x>0.",
      "Has a vanishing gradient when x>0.",
      "Corrects the problems that occur at sigmoid function.",
      "It is a linear activation function."
    ],
    "correct": "c"
  },
  {
    "question": "Consider fuzzy classes for a person’s age defined as follows: young (1.0 up to 20, ramps down to 0.0 at 30), adult (ramps up from 20 to 30, flat from 30 to 40, ramps down to 50), middle-age (ramps up from 40 to 50, ramps down to 60), and old (ramps up from 50 to 60). After fuzzifying the raw input data for a 45 years old person, we obtain the value:",
    "answers": [
      "μ_young(45) = 0.6; μ_adult(45) = 1; μ_middle_age(45) = 0.3; μ_old(45) = 0.",
      "μ_young(45) = 0; μ_adult(45) = 1; μ_middle_age(45) = 0.5; μ_old(45) = 0.",
      "μ_young(45) = 0; μ_adult(45) = 0.5; μ_middle_age(45) = 0.5; μ_old(45) = 0.",
      "None of the above."
    ],
    "correct": "c"
  },
  {
    "question": "In a Search Strategies algorithm with a tree-based structure, the evaluation function:",
    "answers": [
      "Is used for estimating the cost of a solution through a node (state).",
      "It guides the search.",
      "It is the sum between the cost of a solution path from the initial node (state) to node (state) and the cost of a solution path from node (state) to the final node (state).",
      "None of the above."
    ],
    "correct": "c"
  },
  {
    "question": "For clustering, is it true that:",
    "answers": [
      "It uses a labeled database.",
      "It is another name for unsupervised learning.",
      "It is a one-step process - testing.",
      "None of the above applies."
    ],
    "correct": "d"
  },
  {
    "question": "Which statement accurately describes the database used in training with indirect experience?",
    "answers": [
      "It involves paired input/output data.",
      "It is based on useful feedback for some objective function.",
      "It relies on independent data with annotated content.",
      "None of the above."
    ],
    "correct": "b"
  },
];


// Total questions for reference
const TOTAL_QUESTIONS = questions.length;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { questions, TOTAL_QUESTIONS };
}

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.questions = questions;
  window.TOTAL_QUESTIONS = TOTAL_QUESTIONS;
} 