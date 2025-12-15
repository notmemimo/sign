let model = null;
if (!MODEL_URL) return null;
model = await tf.loadLayersModel(MODEL_URL);
return model;



async function startRecognition(videoEl, resultEl) {
if (!model) await loadModel();
if (!model) {
alert('لم يتم وضع رابط نموذج ML في assets/js/sign_recognizer.js — التدريب مطلوب');
return;
}
runInterval = setInterval(async () => {
// التقاط إطار من الكاميرا وتحويله إلى مدخل للنموذج
const tensor = tf.browser.fromPixels(videoEl).resizeNearestNeighbor([224,224]).toFloat().expandDims(0).div(255);
const preds = await model.predict(tensor).data();
// اختيار أعلى احتمالية
const maxIdx = preds.indexOf(Math.max(...preds));
// هنا تحتاج قائمة التسميات (labels) المتطابقة مع ترتيب النموذج
const labels = [];
resultEl.textContent = labels[maxIdx] || '؟';
tensor.dispose();
}, 500);
}


function stopRecognition() {
if (runInterval) clearInterval(runInterval);
runInterval = null;
}


// واجهات بسيطة للتسجيل
window.addEventListener('DOMContentLoaded', async () => {
const video = document.getElementById('webcam');
const result = document.getElementById('recog-text');
const startBtn = document.getElementById('start-recog');
const stopBtn = document.getElementById('stop-recog');


await setupCamera(video);


startBtn.addEventListener('click', async () => {
await loadModel();
startRecognition(video, result);
});
stopBtn.addEventListener('click', () => stopRecognition());
});
// كود JavaScript للواجهة
document.addEventListener('DOMContentLoaded', function() {
    // عناصر DOM
    const inputBox = document.querySelector('.input-box');
    const outputBox = document.querySelector('.output-box');
    const translateBtn = document.querySelector('.translate-btn');
    
    // وظيفة الترجمة (محاكاة)
    function translateText() {
        const inputText = inputBox.textContent.trim();
        
        if (inputText === '' || inputText === 'اكتب النص هنا للترجمة إلى لغة الإشارة...') {
            outputBox.textContent = 'يرجى إدخال نص للترجمة';
            outputBox.style.color = '#999';
            return;
        }
        
        // محاكاة عملية الترجمة
        outputBox.style.color = '#333';
        outputBox.textContent = 'جاري الترجمة...';
        
        // إضافة تأثير الزر
        translateBtn.textContent = 'جاري الترجمة...';
        translateBtn.disabled = true;
        
        setTimeout(() => {
            // في التطبيق الحقيقي، هنا سيتم استدعاء API الترجمة
            const translatedText = `تمت ترجمة النص إلى لغة الإشارة:\n"${inputText}"\n\n(هذه محاكاة - في التطبيق الحقيقي ستظهر رسوم متحركة للإشارات)`;
            outputBox.textContent = translatedText;
            
            // إعادة الزر إلى حالته الأصلية
            translateBtn.textContent = 'ترجم';
            translateBtn.disabled = false;
        }, 2000);
    }
    
    // أحداث
    translateBtn.addEventListener('click', translateText);
    
    // إضافة تأثيرات تفاعلية
    inputBox.addEventListener('focus', function() {
        this.style.borderColor = '#aaaeee';
        this.style.backgroundColor = '#f8f9ff';
    });
    
    inputBox.addEventListener('blur', function() {
        this.style.borderColor = '#ddd';
        this.style.backgroundColor = 'white';
    });
    
    // إمكانية استخدام زر Enter للترجمة
    inputBox.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            translateText();
        }
    });
    
    // رسالة ترحيبية في مربع الإدخال
    inputBox.textContent = 'اكتب النص هنا للترجمة إلى لغة الإشارة...';
    inputBox.style.color = '#999';
    
    inputBox.addEventListener('focus', function() {
        if (this.textContent === 'اكتب النص هنا للترجمة إلى لغة الإشارة...') {
            this.textContent = '';
            this.style.color = '#333';
        }
    });
    
    inputBox.addEventListener('blur', function() {
        if (this.textContent.trim() === '') {
            this.textContent = 'اكتب النص هنا للترجمة إلى لغة الإشارة...';
            this.style.color = '#999';
        }
    });
    
    // تأثيرات إضافية
    const contentBoxes = document.querySelectorAll('.content-box');
    contentBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
