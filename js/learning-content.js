// Enhanced Learning Content for AI Concepts
const learningTopics = {
    'neural-networks': {
        title: 'Neural Networks & Perceptrons',
        content: 'Neural networks content'
    },
    'machine-learning': {
        title: 'Machine Learning Fundamentals', 
        content: 'ML content'
    }
};

function getTopicKeys() {
    return Object.keys(learningTopics);
}

function getTopicContent(topicKey) {
    return learningTopics[topicKey] || null;
} 