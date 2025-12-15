@echo- off
REM فتح المتصفح على المشروع
start http://127.0.0.1:8000
REM تشغيل خادم محلي على البورت 8000
python -m http.server 8000
pause