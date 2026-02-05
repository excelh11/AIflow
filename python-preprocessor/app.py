from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import re

app = Flask(__name__)
CORS(app)

# Spring Boot 서버 URL
SPRING_BOOT_URL = 'http://localhost:8080/api/ai/generate'

def preprocess_question(question):
    """
    질문을 전처리하는 함수
    - 불필요한 공백 제거
    - 특수문자 정리
    - 질문 형식 검증 및 개선
    """
    # 앞뒤 공백 제거
    processed = question.strip()
    
    # 연속된 공백을 하나로 변경
    processed = re.sub(r'\s+', ' ', processed)
    
    # 질문이 물음표로 끝나지 않으면 추가
    if not processed.endswith(('?', '!', '.')):
        processed += '?'
    
    # 질문이 너무 짧으면 경고
    if len(processed) < 5:
        return {
            'processed': processed,
            'warning': '질문이 너무 짧습니다.'
        }
    
    # 질문이 너무 길면 요약
    if len(processed) > 500:
        processed = processed[:500] + '...'
        return {
            'processed': processed,
            'warning': '질문이 너무 길어서 일부가 잘렸습니다.'
        }
    
    return {
        'processed': processed,
        'original_length': len(question),
        'processed_length': len(processed)
    }

@app.route('/api/generate-answer', methods=['POST'])
def generate_answer():
    try:
        data = request.get_json()
        question = data.get('question', '')
        
        if not question:
            return jsonify({
                'error': '질문이 제공되지 않았습니다.'
            }), 400
        
        # Python에서 전처리 수행
        preprocessing_result = preprocess_question(question)
        processed_question = preprocessing_result['processed']
        
        # Spring Boot 서버로 전처리된 질문 전송
        try:
            spring_response = requests.post(
                SPRING_BOOT_URL,
                json={'question': processed_question},
                headers={'Content-Type': 'application/json'},
                timeout=60
            )
            
            if spring_response.status_code == 200:
                spring_data = spring_response.json()
                return jsonify({
                    'answer': spring_data.get('answer', '답변을 생성할 수 없습니다.'),
                    'preprocessing': preprocessing_result
                })
            else:
                return jsonify({
                    'error': f'Spring Boot 서버 오류: {spring_response.status_code}',
                    'message': spring_response.text
                }), 500
                
        except requests.exceptions.RequestException as e:
            return jsonify({
                'error': 'Spring Boot 서버에 연결할 수 없습니다.',
                'message': str(e)
            }), 503
            
    except Exception as e:
        return jsonify({
            'error': '서버 오류가 발생했습니다.',
            'message': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'python-preprocessor'})

if __name__ == '__main__':
    print('Python 전처리 서버 시작...')
    print(f'Spring Boot 서버 URL: {SPRING_BOOT_URL}')
    app.run(host='0.0.0.0', port=5000, debug=True)
