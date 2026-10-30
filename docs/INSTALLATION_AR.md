<div align="center">

# دليل التثبيت - TeamX - AdBlock

[![Version](https://img.shields.io/badge/version-1.2.0-2563eb?style=flat-square&logo=semver)](../CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-dc2626?style=flat-square)](../LICENSE)
![Manifest](https://img.shields.io/badge/manifest-v3-16a34a?style=flat-square&logo=googlechrome)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Chromium-9333ea?style=flat-square&logo=googlechrome)

</div>

---

## اللغة

<a href="INSTALLATION.md">🇬🇧 English</a> · <a href="INSTALLATION_AR.md">🇸🇦 العربية</a>

---

## جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [الطريقة الأولى: التثبيت عبر ملف CRX](#طريقة-crx)
- [الطريقة الثانية: تحميل الكود المصدري](#طريقة-المصدر)
- [توافق المتصفحات](#توافق-المتصفحات)

---

<a id="نظرة-عامة"></a>
## نظرة عامة

يمكنك تثبيت **TeamX - AdBlock** إما باستخدام ملف CRX الجاهز (وهو الخيار الموصى به لدعم التحديثات التلقائية في الخلفية) أو كإضافة غير مجهزة للمطورين.

---

<a id="طريقة-crx"></a>
## الطريقة الأولى: التثبيت عبر ملف CRX (موصى بها للمستخدمين)

التثبيت بواسطة ملف `.crx` يربط الإضافة بقناة التحديثات التلقائية:

1. حمّل أحدث إصدار من ملف [`TeamX-AdBlock.crx`](https://github.com/shadow-x78/teamx-adblock/releases/latest/download/TeamX-AdBlock.crx) من صفحة [الإصدارات](https://github.com/shadow-x78/teamx-adblock/releases).
2. افتح متصفح كروم (أو بريف، إيدج، كروميوم) وانتقل إلى:
   ```text
   chrome://extensions/
   ```
3. فعّل **وضع المطور (Developer mode)** من الزر في أعلى يمين الصفحة.
4. اسحب ملف `TeamX-AdBlock.crx` وأفلته داخل الصفحة.
5. اضغط على **Add extension** عند ظهور نافذة التأكيد.

> [!NOTE]
> بمجرد تثبيتها بهذه الطريقة، سيفحص المتصفح دورياً ويثبت أي إصدارات جديدة تصدرها لاحقاً بشكل تلقائي وصامت!

---

<a id="طريقة-المصدر"></a>
## الطريقة الثانية: تحميل الكود المصدري (للمطورين)

1. انسخ المستودع عبر الطرفية:
   ```bash
   git clone https://github.com/shadow-x78/teamx-adblock.git
   ```
2. افتح `chrome://extensions/` وتأكد من تفعيل **وضع المطور**.
3. اضغط على زر **Load unpacked**.
4. حدد مجلد `teamx-adblock` الذي نسخته.
5. الإضافة أصبحت نشطة وتعمل الآن.

---

<a id="توافق-المتصفحات"></a>
## توافق المتصفحات

| المتصفح | مدعوم | التحديث التلقائي |
| :--- | :---: | :---: |
| **Google Chrome** | ✅ | ✅ مدعوم عبر بروتوكول Omaha |
| **Brave Browser** | ✅ | ✅ مدعوم |
| **Microsoft Edge** | ✅ | ✅ مدعوم |
| **Chromium** | ✅ | ✅ مدعوم |
| **Vivaldi** | ✅ | ✅ مدعوم |

---

<div align="center">

صُنعت بواسطة <a href="https://github.com/shadow-x78">shadow-x78</a> ·
[سجل التغييرات](../CHANGELOG.md) ·
[الأمان](../SECURITY.md)

<sub>&copy; 2026 TeamX - AdBlock</sub>

</div>
