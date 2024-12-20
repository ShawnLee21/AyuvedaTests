from flask import Flask, request, jsonify, render_template

# Flask 配置
app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/form')
def form():
    return render_template('form.html')

@app.route('/submit', methods=['POST'])
def submit_data():
    try:
        # 获取表单数据
        data = request.form
        # 打印表单数据（调试用）
        print("收到的表单数据：", data)

        # 返回成功响应
        return jsonify({"status": "success", "message": "数据已成功提交！"})
    except Exception as e:
        # 处理异常并返回错误信息
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
