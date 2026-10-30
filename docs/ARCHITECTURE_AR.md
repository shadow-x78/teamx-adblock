<div align="center">

# البنية البرمجية والمعمارية - TeamX - AdBlock

[![Version](https://img.shields.io/badge/version-1.2.0-2563eb?style=flat-square&logo=semver)](../CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-dc2626?style=flat-square)](../LICENSE)
![Manifest](https://img.shields.io/badge/manifest-v3-16a34a?style=flat-square&logo=googlechrome)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Chromium-9333ea?style=flat-square&logo=googlechrome)

</div>

---

## اللغة

<a href="ARCHITECTURE.md">🇬🇧 English</a> · <a href="ARCHITECTURE_AR.md">🇸🇦 العربية</a>

---

## جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [سياق التنفيذ في Manifest V3](#سياق-التنفيذ)
- [آلية اعتراض النوافذ المنبثقة](#آلية-الاعتراض)
- [الأداء والأمان](#الأداء-والأمان)

---

<a id="نظرة-عامة"></a>
## نظرة عامة

**TeamX - AdBlock** هي إضافة كروم فائقة الخفة مبنية بمعمارية Manifest V3 صُممت خصيصاً لاعتراض واستئصال النوافذ الإعلانية المنبثقة الخبيثة على موقع `olympustaff.com` دون التأثير على تصفح المانجا الطبيعي أو أدوات القراءة المشروعة.

```mermaid
flowchart TD
    A[المتصفح يتوجه لموقع olympustaff.com] --> B[كروم يحقن content.js عند document_start]
    B --> C[سياق التنفيذ: MAIN world]
    C --> D[تغليف واعتراض دالة window.open]
    D --> E{السكربت يطلب فتح نافذة}
    E -->|الرابط يحتوي goodpics.net أو /go/3343952| F[حجب النافذة بالكامل وإرجاع null]
    E -->|رابط طبيعي ومشروع| G[تمرير الأمر للنافذة الأصلية window.open]
```

---

<a id="سياق-التنفيذ"></a>
## سياق التنفيذ في Manifest V3

تقوم معظم أدوات حظر الإعلانات بحقن السكربتات في بيئة معزولة تسمى **Isolated World** (البيئة الافتراضية لسكربتات الإضافات). لكن في هذه البيئة المعزولة، لا يمكن اعتراض السكربتات المضمنة مباشرة داخل كود الصفحة (`MAIN` world) إذا تم تنفيذها قبل تهيئة البيئة المعزولة.

من خلال الإعلان الصريح في `manifest.json`:
```json
"world": "MAIN",
"run_at": "document_start"
```
تضمن الإضافة تنفيذ كود الاعتراض في نفس السياق البرمجي للصفحة فور لحظة البدء، وقبل أن تتمكن أي سكربتات تتبع أو إعلانات من العمل أو حفظ مراجع للدوال الأصلية.

---

<a id="آلية-الاعتراض"></a>
## آلية اعتراض النوافذ المنبثقة

```javascript
// TeamX - AdBlock (MIT)
// https://github.com/shadow-x78/teamx-adblock

(() => {
  const originalOpen = window.open;

  window.open = function (url) {
    if (url && (String(url).includes("goodpics.net") || String(url).includes("/go/3343952"))) {
      return null;
    }
    return originalOpen.apply(this, arguments);
  };
})();
```

- **تمرير طبيعي:** يتم الحفاظ على سياق `this` وجميع المعاملات `arguments` للنوافذ العادية.
- **إخماد صارم:** يتم منع الروابط المحظورة فوراً وإرجاع `null` لإيقاف دورة حياة النافذة المنبثقة.

---

<a id="الأداء-والأمان"></a>
## الأداء والأمان

- استهلاك المعالج والذاكرة شبه معدوم (< 1 ميجابايت).
- لا ترسل أي بيانات أو تحليلات عبر الشبكة (Zero Telemetry).
- تعمل ضمن ضوابط الأمان الصارمة لمتصفحات كروميوم.

---

<div align="center">

صُنعت بواسطة <a href="https://github.com/shadow-x78">shadow-x78</a> ·
[سجل التغييرات](../CHANGELOG.md) ·
[الأمان](../SECURITY.md)

<sub>&copy; 2026 TeamX - AdBlock</sub>

</div>
