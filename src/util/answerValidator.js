/**
 * Answer Validation Utility
 * Handles intelligent answer comparison with support for:
 * - Numeric answers (integers and decimals)
 * - Whitespace trimming
 * - Floating-point precision
 * - Multiple answer formats
 */

export const validateAnswer = (userInput, correctAnswer) => {
  if (!userInput || !correctAnswer) {
    return false;
  }

  // Trim whitespace
  const trimmedInput = userInput.trim();
  
  // Try exact string match first (for non-numeric answers)
  if (trimmedInput === correctAnswer.toString().trim()) {
    return true;
  }

  // Try numeric comparison
  const userNum = parseFloat(trimmedInput);
  const correctNum = parseFloat(correctAnswer);

  // Check if both are valid numbers
  if (!isNaN(userNum) && !isNaN(correctNum)) {
    // Use epsilon comparison for floating-point precision
    const epsilon = 0.0001;
    return Math.abs(userNum - correctNum) < epsilon;
  }

  // Case-insensitive string comparison for text answers
  return trimmedInput.toLowerCase() === correctAnswer.toString().toLowerCase();
};

/**
 * Get feedback message based on answer type
 */
export const getAnswerFeedback = (userInput, correctAnswer) => {
  const isCorrect = validateAnswer(userInput, correctAnswer);
  
  if (isCorrect) {
    return {
      isCorrect: true,
      message: 'Correct! Great job! 🎉',
      type: 'success'
    };
  }

  // Provide helpful feedback for wrong answers
  const userNum = parseFloat(userInput);
  const correctNum = parseFloat(correctAnswer);

  if (!isNaN(userNum) && !isNaN(correctNum)) {
    if (userNum > correctNum) {
      return {
        isCorrect: false,
        message: 'Not quite. Your answer is too high. Try again.',
        type: 'error'
      };
    } else if (userNum < correctNum) {
      return {
        isCorrect: false,
        message: 'Not quite. Your answer is too low. Try again.',
        type: 'error'
      };
    }
  }

  return {
    isCorrect: false,
    message: 'Wrong answer. Try again.',
    type: 'error'
  };
};
