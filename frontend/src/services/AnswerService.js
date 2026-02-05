import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class AnswerService {
  async generateAnswer(question) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate-answer`, {
        question: question
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60초 타임아웃
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AnswerService();
