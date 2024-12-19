from flask import Flask, request, jsonify, render_template
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
import os

# Flask 配置
app = Flask(__name__, static_folder='static', template_folder='templates')

#Vercel 配置
from werkzeug.middleware.dispatcher import DispatcherMiddleware
app.wsgi_app = DispatcherMiddleware(app.wsgi_app)

# Google Sheets 配置
SERVICE_ACCOUNT_FILE = os.path.join(os.getcwd(), 'ayuvedatest-9e2194434421.json')  # 修正文件路径为适配 Vercel
SPREADSHEET_ID = '1sOit_I5vOfDXDdhG7p5cJAmYse_McUbHZOlGc_n5Sts'  # 替换为您的 Google Sheets ID
RANGE_NAME = 'Sheet1!A1'  # 数据写入范围

# 初始化 Google Sheets 客户端
try:
    credentials = Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=["https://www.googleapis.com/auth/spreadsheets"]
    )
    sheet_service = build('sheets', 'v4', credentials=credentials)
except Exception as e:
    print("Google Sheets 初始化失败:", str(e))
    sheet_service = None  # 确保即使出错程序仍能运行

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/form')
def form():
    return render_template('form.html')

@app.route('/submit', methods=['POST'])
def submit_data():
    try:
        if not sheet_service:
            raise Exception("Google Sheets 客户端未正确初始化！")

        # 接收 JSON 数据
        data = request.get_json()
        print("收到的数据:", data)

        # 如果 data 是空的，返回错误信息
        if not data:
            print("未接收到数据！")
            return jsonify({'status': 'error', 'message': '未接收到数据'}), 400

        # 按照问题编号收集字段数据
        answers = [data.get(f'q{i}', '未回答') for i in range(1, 33)]  # 默认值为 "未回答"
        print("问题答案:", answers)

        # 写入 Google Sheets
        body = {'values': [answers]}
        result = sheet_service.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range=RANGE_NAME,
            valueInputOption="RAW",
            body=body
        ).execute()

        print("写入成功:", result)
        return jsonify({'status': 'success', 'message': '数据提交成功！'})
    except Exception as e:
        print("写入失败:", str(e))
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/test_write')
def test_write():
    try:
        if not sheet_service:
            raise Exception("Google Sheets 客户端未正确初始化！")

        # 测试写入 Google Sheets 的功能
        test_values = ['测试数据1', '测试数据2', '测试数据3']
        body = {'values': [test_values]}
        result = sheet_service.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range=RANGE_NAME,
            valueInputOption="RAW",
            body=body
        ).execute()
        print("测试写入成功:", result)
        return "测试写入成功"
    except Exception as e:
        print("测试写入失败:", str(e))
        return f"测试写入失败: {str(e)}"

# Vercel 入口点
def vercel_app(environ, start_response):
    return app(environ, start_response)

@app.route("/")
def hello():
    print("Received request at /")
    return "Hello, Vercel!"


if __name__ == '__main__':
    app.run(debug=True)
