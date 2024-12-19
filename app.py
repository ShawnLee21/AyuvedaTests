
from flask import Flask, request, jsonify, render_template
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
import os
import json
from urllib.parse import quote  # 用 urllib.parse.quote 替换 werkzeug.urls.url_quote
from dotenv import load_dotenv

# 加载 .env 文件中的环境变量
load_dotenv(dotenv_path='GOOGLE_SERVICE.env')

# Flask 配置
app = Flask(__name__, static_folder='static', template_folder='templates')

# 从环境变量获取 Google 服务账户文件的内容
service_account_info = json.loads(os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON"))

# 使用服务账户信息进行认证
credentials = Credentials.from_service_account_info(service_account_info)

# Google Sheets 配置
SPREADSHEET_ID = '1sOit_I5vOfDXDdhG7p5cJAmYse_McUbHZOlGc_n5Sts'  # 替换为您的 Google Sheets ID
RANGE_NAME = 'Sheet1!A1'  # 数据写入范围

# 初始化 Google Sheets 客户端
try:
    sheet_service = build('sheets', 'v4', credentials=credentials)
except Exception as e:
    print("Google Sheets 初始化失败:", str(e))
    sheet_service = None  # 确保即使出错程序仍能运行

@app.route('/')
def index():
    # 示例：使用 quote 来进行 URL 编码
    example_url = quote('Hello World!')
    return f"Encoded URL: {example_url}"

# 其他路由和逻辑
