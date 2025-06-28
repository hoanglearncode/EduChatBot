from flask import Flask, request, jsonify, render_template_string

from chatModule import getMessage
# Tạo Flask app
app = Flask(__name__)

# Template HTML đơn giản
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flask Server Đơn Giản</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .endpoint {
            background-color: #f8f9fa;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #007bff;
            border-radius: 5px;
        }
        .method {
            font-weight: bold;
            color: #007bff;
        }
        form {
            margin: 20px 0;
            padding: 20px;
            background-color: #e9ecef;
            border-radius: 5px;
        }
        input, textarea {
            width: 100%;
            padding: 8px;
            margin: 5px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Flask Server Đang Chạy!</h1>

        <h2>Các API Endpoints:</h2>

        <div class="endpoint">
            <span class="method">GET</span> <code>/</code> - Trang chủ
        </div>

        <div class="endpoint">
            <span class="method">GET</span> <code>/api/hello</code> - Trả về thông điệp chào
        </div>

        <div class="endpoint">
            <span class="method">GET</span> <code>/api/hello/&lt;name&gt;</code> - Chào với tên cụ thể
        </div>

        <div class="endpoint">
            <span class="method">POST</span> <code>/api/data</code> - Gửi dữ liệu JSON
        </div>

        <div class="endpoint">
            <span class="method">GET</span> <code>/api/info</code> - Thông tin server
        </div>

        <h2>Test API:</h2>
        <form id="testForm">
            <h3>Gửi dữ liệu POST:</h3>
            <input type="text" id="name" placeholder="Tên của bạn" required>
            <textarea id="message" placeholder="Tin nhắn" rows="3" required></textarea>
            <button type="submit">Gửi</button>
        </form>

        <div id="result"></div>
    </div>

    <script>
        document.getElementById('testForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const message = document.getElementById('message').value;

            try {
                const response = await fetch('/api/data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        message: message
                    })
                });

                const result = await response.json();
                document.getElementById('result').innerHTML = 
                    '<h3>Kết quả:</h3><pre>' + JSON.stringify(result, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    '<h3>Lỗi:</h3><p>' + error.message + '</p>';
            }
        });
    </script>
</body>
</html>
"""


# Route chính
@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE)



# API nhận dữ liệu POST
@app.route('/api/data', methods=['POST'])
@app.route('/api/data', methods=['POST'])
def receive_data():
    try:
        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({
                'error': 'Không có tin nhắn được gửi',
                'status': 'error'
            }), 400

        # Xử lý bằng NLP module
        nlp_result = getMessage(data['message'])

        # Trả kết quả cho client
        response_data = {
            'message': 'Xử lý thành công!',
            'input': data['message'],
            'intent': nlp_result['intent'],
            'response': nlp_result['response'],
            'status': 'success'
        }
        return jsonify(response_data)

    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

# Xử lý lỗi 404
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint không tồn tại',
        'status': 'error'
    }), 404


# Xử lý lỗi 500
@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Lỗi server nội bộ',
        'status': 'error'
    }), 500


if __name__ == '__main__':
    print("🚀 Khởi động Flask server...")
    print("📍 Server sẽ chạy tại: http://localhost:5000")
    print("📖 Truy cập http://localhost:5000 để xem giao diện web")
    print("🔧 Sử dụng Ctrl+C để dừng server")

    app.run(
        host='0.0.0.0',  # Cho phép truy cập từ mọi IP
        port=5000,  # Cổng 5000
        debug=True  # Bật chế độ debug
    )