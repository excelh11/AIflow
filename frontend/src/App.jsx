import React, { useState } from 'react';
import './App.css';
import AnswerService from './services/AnswerService';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const exampleQuestions = [
    "인공지능의 미래는 어떻게 될까요?",
    "스프링 부트와 리액트를 함께 사용하는 방법은?",
    "머신러닝 모델을 프로덕션에 배포하는 최선의 방법은?",
    "마이크로서비스 아키텍처의 장단점은 무엇인가요?"
  ];

  const handleQuestionClick = (exampleQuestion) => {
    setQuestion(exampleQuestion);
    setAnswer('');
    setError('');
  };

  const handleGenerateAnswer = async () => {
    if (!question.trim()) {
      setError('질문을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await AnswerService.generateAnswer(question);
      setAnswer(response.answer);
    } catch (err) {
      setError(err.response?.data?.message || '답변 생성 중 오류가 발생했습니다.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>AIflow</h1>
          <p>AI 기반 질문 답변 서비스</p>
        </header>

        <div className="content">
          <div className="question-section">
            <h2>질문 입력</h2>
            <textarea
              className="question-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="질문을 입력하세요..."
              rows="4"
            />

            <div className="example-questions">
              <h3>예시 질문:</h3>
              <div className="example-buttons">
                {exampleQuestions.map((q, index) => (
                  <button
                    key={index}
                    className="example-btn"
                    onClick={() => handleQuestionClick(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="generate-btn"
              onClick={handleGenerateAnswer}
              disabled={loading || !question.trim()}
            >
              {loading ? '답변 생성 중...' : '답변 생성'}
            </button>
          </div>

          <div className="answer-section">
            <h2>AI 답변</h2>
            {error && <div className="error-message">{error}</div>}
            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>답변을 생성하고 있습니다...</p>
              </div>
            )}
            {answer && (
              <div className="answer-content">
                <p>{answer}</p>
              </div>
            )}
            {!answer && !loading && !error && (
              <div className="placeholder">
                질문을 입력하고 "답변 생성" 버튼을 클릭하세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
