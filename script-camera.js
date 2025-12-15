/* ========== 1) تهيئة المتغيّرات ========== */
const TM_URL = "https://teachablemachine.withgoogle.com/models/DzfADOEnT/"; 
let model, maxPredictions;

const video  = document.getElementById('video');
const output = document.getElementById('output');

let lastWord = "";
let lastSpoken = "";
let canSpeak = true;
const speakDelay = 800;

/* ========== 2) النطق ========== */
function speak(text) {
  if (!text || text === "✋ في انتظار الإشارة..." || text === lastSpoken) return;
  if (speechSynthesis.speaking) speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ar-SA';
  utter.rate = 1.1;
  speechSynthesis.speak(utter);
  lastSpoken = text;
  canSpeak = false;
  setTimeout(() => canSpeak = true, speakDelay);
}

function recognizeSign(lm) {
  if (!lm) return "✋ في انتظار الإشارة...";

  /* نقاط أساسية */
  const wrist   = lm[0];
  const thumb4  = lm[4],  thumb3 = lm[3],  thumb2 = lm[2];   // إبهام
  const index8  = lm[8],  index6 = lm[6],  index5 = lm[5];   // سبابة
  const mid12   = lm[12], mid10 = lm[10], mid9  = lm[9];    // وسطى
  const ring16  = lm[16], ring14= lm[14], ring13= lm[13];   // بنصر
  const pinky20 = lm[20], pinky18=lm[18], pinky17=lm[17];   // خنصر

  /* دالة حساب الزاوية بين 3 نقاط (بالراديان) */
  const angle = (a, b, c) => {
    const ab = {x: b.x - a.x, y: b.y - a.y};
    const cb = {x: b.x - c.x, y: b.y - c.y};
    const dot = ab.x * cb.x + ab.y * cb.y;
    const mag = Math.sqrt((ab.x * ab.x + ab.y * ab.y) * (cb.x * cb.x + cb.y * cb.y)) + 1e-5;
    return Math.acos(dot / mag);
  };

  /* دالة المسافة بين نقطتين */
  const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  /* دالة بسيطة: هل الإصبع منثني (< 130°)؟ */
  const isBent = (tip, mid, base) => angle(tip, mid, base) < 2.25;

  /* عدّاد الأصابع المنثنية (0-4) */
  const bentCount = [
    isBent(index8, index6, index5),
    isBent(mid12, mid10, mid9),
    isBent(ring16, ring14, ring13),
    isBent(pinky20, pinky18, pinky17)
  ].filter(Boolean).length;

  
  if (bentCount === 3 && !isBent(index8, index6, index5)) return "واحد";
  if (bentCount === 2 && !isBent(index8, index6, index5) && !isBent(mid12, mid10, mid9)) return "اثنان";
  if (bentCount === 1 && !isBent(index8, index6, index5) && !isBent(mid12, mid10, mid9) && !isBent(ring16, ring14, ring13)) return "ثلاثة";
  if (bentCount === 0 && thumb4.y < wrist.y - 0.1 && distance(index8, mid12) > 0.02 && distance(index8, mid12) < 0.04) return "مرحبا";
  if (bentCount === 0 && Math.abs(index8.y - pinky20.y) < 0.05) return "من فضلك";
  if (bentCount === 4 && thumb4.y > wrist.y) return "سيىء"; // قبضة للأسفل
  if (bentCount === 4 && thumb4.x > wrist.x + 0.08) return "انا";
  if (bentCount === 4 && thumb4.y < wrist.y - 0.15) return "جيد"; // إبهام مرفوع عالياً
  if (bentCount === 2 && !isBent(pinky20, pinky18, pinky17) && thumb4.y < wrist.y) return "أب";  // "أب" - إبهام وخنصر ممدودين
  if (distance(thumb4, index8) < 0.08 && bentCount >= 2) return "اُم"; // "أم" - إبهام وسبابة يشكلان دائرة
  if (bentCount === 2 && !isBent(index8, index6, index5) && !isBent(ring16, ring14, ring13)) return "د"; // حرف د – السبابة والبنصر ممدودتان، الوسطى والخنصر منثنيتان
  return "✋ في انتظار الإشارة...";
}

/* ========== 4) Mediapipe Hands ========== */
const hands = new Hands({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.8, minTrackingConfidence: 0.8 });

hands.onResults(results => {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const txt = recognizeSign(results.multiHandLandmarks[0]);
    if (txt !== lastWord) { output.textContent = txt; lastWord = txt; }
    if (canSpeak) speak(txt);
  } else output.textContent = "✋ في انتظار الإشارة...";
});

/* ========== 5) Teachable Machine (اختياري) ========== */
async function predictTM() {
  if (!model) return;
  const prediction = await model.predict(video);
  let best = "", prob = 0;
  for (const p of prediction) { if (p.probability > prob) { prob = p.probability; best = p.className; } }
  if (prob > 0.80 && best !== lastWord) { output.textContent = best; lastWord = best; if (canSpeak) speak(best); }
}

/* ========== 6) الكاميرا ========== */
const cameraMP = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
    await predictTM();
  },
  width: 640, height: 480
});

/* ========== 7) نبدأ بعد تحميل كل المكتبات ========== */
window.onload = async () => {
  // إذا أردتِ Teachable Machine فعلاً
  if (typeof tmImage !== "undefined") {
    try {
      const modelURL = TM_URL + "model.json";
      const metaURL  = TM_URL + "metadata.json";
      model = await tmImage.load(modelURL, metaURL);
      maxPredictions = model.getTotalClasses();
      console.log("TM model loaded");
    } catch (e) { console.warn("لم يُحمل نموذج TM:", e); }
  } else console.warn("tmImage غير محمّل - سيتم الاعتماد على التعرف اليدوي فقط");

  // نبدأ الكاميرا الآن
  await cameraMP.start();
};