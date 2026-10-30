<div align="center">

# دليل التثبيت - TeamX - AdBlock

[![Version](https://img.shields.io/badge/version-1.3.0-2563eb?style=flat-square&logo=semver)](../CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-dc2626?style=flat-square)](../LICENSE)
![Manifest](https://img.shields.io/badge/manifest-v3-16a34a?style=flat-square&logo=googlechrome)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Firefox%20%7C%20Brave%20%7C%20Edge-9333ea?style=flat-square&logo=googlechrome)

</div>

---

## اللغة

<a href="INSTALLATION.md">🇬🇧 English</a> · <a href="INSTALLATION_AR.md">🇸🇦 العربية</a>

---

## جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [فيديو الشرح](#فيديو-الشرح)
- [متصفحات كروميوم (كروم، بريف، إيدج، أوبرا)](#متصفحات-كروميوم)
- [هواتف أندرويد (متصفح Kiwi)](#هواتف-أندرويد)
- [متصفح موزيلا فايرفوكس (Mozilla Firefox)](#موزيلا-فايرفوكس)
- [تحميل الكود المصدري](#تحميل-المصدر)
- [مصفوفة توافق المتصفحات](#توافق-المتصفحات)

---

<a id="نظرة-عامة"></a>
## نظرة عامة

يمكنك تثبيت **TeamX - AdBlock** بسهولة على كافة المتصفحات الحديثة المبنية على محرك كروميوم أو محرك جيكو (فايرفوكس) سواء عبر ملفات التثبيت الجاهزة أو عبر الكود المصدري.

---

<a id="فيديو-الشرح"></a>
## فيديو الشرح

<video src="../assets/videos/TeamX_AdBlock_Tutorial_AR.mp4" controls="controls" width="100%">
  <p>متصفحك لا يدعم تشغيل الفيديو المباشر. يمكنك <a href="../assets/videos/TeamX_AdBlock_Tutorial_AR.mp4">مشاهدة أو تحميل الفيديو مباشرة</a>.</p>
</video>

---

<a id="متصفحات-كروميوم"></a>
## متصفحات كروميوم (كروم، بريف، إيدج، أوبرا)

1. حمّل ملف [`TeamX-AdBlock.crx`](https://github.com/shadow-x78/teamx-adblock/releases/latest/download/TeamX-AdBlock.crx) من صفحة [الإصدارات](https://github.com/shadow-x78/teamx-adblock/releases).
2. افتح صفحة الإضافات في متصفحك:
   ```text
   chrome://extensions/
   ```
3. فعّل **وضع المطور (Developer mode)** في أعلى الصفحة.
4. اسحب ملف `TeamX-AdBlock.crx` وأفلته داخل الصفحة، ثم اضغط على **Add extension**.

> [!NOTE]
> النسخ المثبتة عبر ملف `.crx` تتلقى التحديثات الصامتة تلقائياً في الخلفية.

---

<a id="هواتف-أندرويد"></a>
## هواتف أندرويد (متصفح Kiwi)

لتثبيت الإضافة وحجب إعلانات أوليمبوس على هواتف أندرويد:

1. حمّل وثبّت **متصفح Kiwi** من [متجر Google Play](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser).
2. حمّل ملف [`TeamX-AdBlock.crx`](https://github.com/shadow-x78/teamx-adblock/releases/latest/download/TeamX-AdBlock.crx) إلى هاتفك.
3. افتح متصفح Kiwi واكتب في شريط العناوين:
   ```text
   kiwi://extensions
   ```
4. فعّل مفتاح **وضع المطور**.
5. اضغط على الزر **+(from .zip/.crx/.user.js)**.
6. اختر ملف `TeamX-AdBlock.crx` من مجلد التنزيلات ليتم تفعيل الإضافة وحجب النوافذ فوراً.

---

<a id="موزيلا-فايرفوكس"></a>
## متصفح موزيلا فايرفوكس (Mozilla Firefox)

### الخيار الأول: التثبيت السريع كإضافة مؤقتة (لأي إصدار فايرفوكس)
1. حمّل ملف [`TeamX-AdBlock.xpi`](https://github.com/shadow-x78/teamx-adblock/releases/latest/download/TeamX-AdBlock.xpi) أو انسخ المستودع.
2. في شريط عنوان فايرفوكس، اكتب الرابط التالي:
   ```text
   about:debugging#/runtime/this-firefox
   ```
3. اضغط على زر **Load Temporary Add-on...** (تحميل إضافة مؤقتة).
4. حدد ملف `manifest.json` من مجلد الإضافة (أو حدد ملف `.xpi` المحمّل).
5. ستعمل الإضافة فوراً وتبدأ بحجب الإعلانات على الموقع.

### الخيار الثاني: التثبيت الدائم (Firefox Developer Edition / Nightly)
1. افتح صفحة `about:config` وعطّل قيد التوقيع بجعل `xpinstall.signatures.required` بقيمة `false`.
2. اسحب ملف `TeamX-AdBlock.xpi` وأفلته داخل المتصفح واضغط **Add**.

---

<a id="تحميل-المصدر"></a>
## تحميل الكود المصدري (للمطورين)

```bash
git clone https://github.com/shadow-x78/teamx-adblock.git
```
- **على كروم / بريف / إيدج:** من صفحة `chrome://extensions/` اضغط **Load unpacked** واختر مجلد `teamx-adblock`.
- **على فايرفوكس:** من صفحة `about:debugging#/runtime/this-firefox` اضغط **Load Temporary Add-on** واختر `teamx-adblock/manifest.json`.

---

<a id="توافق-المتصفحات"></a>
## مصفوفة توافق المتصفحات

| المتصفح | المحرك المدعوم | التحديث التلقائي | صيغة الحزمة |
| :--- | :---: | :---: | :---: |
| **Google Chrome** | Chromium 111+ | ✅ بروتوكول Omaha | `.crx` |
| **Mozilla Firefox** | Gecko 109+ | ✅ مدعوم | `.xpi` |
| **Brave Browser** | Chromium 111+ | ✅ مدعوم | `.crx` |
| **Microsoft Edge** | Chromium 111+ | ✅ مدعوم | `.crx` |
| **Opera / Vivaldi** | Chromium 111+ | ✅ مدعوم | `.crx` |

---

<div align="center">

صُنعت بواسطة <a href="https://github.com/shadow-x78">shadow-x78</a> ·
[سجل التغييرات](../CHANGELOG.md) ·
[الأمان](../SECURITY.md)

<sub>&copy; 2026 TeamX - AdBlock</sub>

</div>
