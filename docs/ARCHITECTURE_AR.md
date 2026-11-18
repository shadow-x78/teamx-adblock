<div align="center">

# البنية البرمجية والمعمارية - TeamX - AdBlock

[![Version](https://img.shields.io/badge/version-1.6.2-2563eb?style=for-the-badge&logo=semver)](../CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-dc2626?style=for-the-badge)](../LICENSE)
![Manifest](https://img.shields.io/badge/manifest-v3-16a34a?style=for-the-badge&logo=googlechrome)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Chromium-9333ea?style=for-the-badge&logo=googlechrome)

</div>

---

## اللغة

<a href="ARCHITECTURE.md">🇬🇧 English</a> · <a href="ARCHITECTURE_AR.md">🇸🇦 العربية</a>

---

## جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [سياق التنفيذ في Manifest V3](#سياق-التنفيذ)
- [آلية اعتراض النوافذ المنبثقة](#آلية-الاعتراض)
- [قائمة شريط الأدوات](#القائمة)
- [الأداء والأمان](#الأداء-والأمان)

---

<a id="نظرة-عامة"></a>
## نظرة عامة

تعتمد **TeamX - AdBlock** معمارية دفاعية متعددة الطبقات مخصصة لموقع `olympustaff.com` لإبادة كافة أشكال الإعلانات، البانرات، النوافذ المنبثقة، وتخطي رسائل حظر مانع الإعلانات:

```mermaid
flowchart TD
    A[المتصفح يتوجه لموقع olympustaff.com] --> B[declarativeNetRequest يحظر طلبات شبكات الإعلانات]
    A --> C[rules.css يخفي عناصر وبانرات الإعلانات فوراً]
    A --> D[bridge.js يقرأ حالة التشغيل المحفوظة]
    D --> D2[ينشر data-teamx-enabled على عنصر html]
    A --> E[content.js يعمل عند document_start في MAIN world]
    D2 --> E
    E --> F[تعطيل window.aclib عبر بروكسي مسبق]
    E --> G[اعتراض دالة window.open لمنع أي نافذة إعلانية]
    E --> H[اعتراض addEventListener لمنع مستمعي النقر الخاطف]
    E --> I[تخطي كاشف مانع الإعلانات في eval وفحوصات الصور]
    E --> J[الإبلاغ عن حجم سليم لصندوق الفحص 468x60]
    E --> K[رفض أي مسح لـ document.body]
    E --> L[مراقب MutationObserver لتطهير أي عناصر عائمة جديدة]
    L --> M[كل إعلان يُزال يرفع العدّاد]
    L --> M[كل إعلان يُزال يزيد عدّاد الصفحة على html]
    A --> P[background.js يفعّل الأيقونة على الموقع ويعطّلها في غيره]
    M --> O[popup.html يقرأ التبويب النشط ويعرض المفتاح والعداد والمستودع والحقوق والإصدار]
    P --> O
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
    const host = new URL(String(url), window.location.href).hostname;
    const trusted = host === "olympustaff.com" || host.endsWith(".olympustaff.com");
    if (!trusted) {
      return null;
    }
    return originalOpen.apply(this, arguments);
  };
})();
```

- **تمرير طبيعي:** يتم الحفاظ على سياق `this` وجميع المعاملات `arguments` للنوافذ العادية.
- **إخماد صارم:** أي وجهة خارج `olympustaff.com` تُمنع فوراً وإرجاع `null` لإيقاف دورة حياة النافذة المنبثقة.
- **ثقة بحدود النطاق:** يُرفض المضيف `fakeolympustaff.com` فلا تتجاوز النطاقات المشابهة قائمة الثقة.

---

<a id="القائمة"></a>
## قائمة شريط الأدوات

`popup.html` لوحة بعرض 316 بكسل تُفتح من أيقونة شريط الأدوات، ولا تحمل منطقاً
خاصاً بها سوى قراءة التخزين:

| العنصر | المصدر |
| --- | --- |
| مفتاح الحماية | `chrome.storage.local.enabled` |
| الإعلانات المحجوبة | `<html data-teamx-blocked>` في التبويب النشط |
| اللغة | `chrome.storage.local.lang` (العربية افتراضياً، والإنجليزية اختيارياً) |
| رابط المستودع | `manifest.homepage_url` |
| الإصدار | `chrome.runtime.getManifest().version` |
| الحقوق | `manifest.author` + السنة الحالية |

عند تبديل المفتاح تُحفظ الحالة الجديدة، ويُفعَّل أو يُعطَّل مجموعة قواعد
`ruleset_1`، ثم تُعاد تحميل أي تبويب مفتوح للموقع حتى تُثبَّت دفاعات سياق
الصفحة أوتُزال على مستند نظيف.

اللوحة عمود واحد ممركز: كل كتلة بنفس العرض وكل سطر نص ممركز، فتتقاسم جميع
العناصر محوراً واحداً في الاتجاهين. تُحلّ اللغة من قاموس صغير داخل الملف
(`ar` و`en`)؛ وتبديلها يضبط `documentElement.lang` و`dir`، ويحدّث كل النصوص،
ويحرّك مقبض المفتاح وفق اتجاه الكتابة الجديد، ويحفظ `lang` ليبقى الاختيار عند
الفتح التالي. وتُحفظ حالة الحماية بالطريقة نفسها، فيبقى الخياران محفوظين بعد
إعادة تشغيل المتصفح.

العدّاد يخصّ الصفحة التي أنتجته: يحتفظ `content.js` به على
`<html data-teamx-blocked>`، فكل تحميل يبدأ من صفر ولا يتراكم عند إعادة التحميل.
تقرأ اللوحة هذه السمة من التبويب النشط، وفقط عندما يكون ذلك التبويب هو الموقع.

`background.js` هو عامل الخدمة: يفعّل أيقونة شريط الأدوات على
`olympustaff.com` ويعطّلها في كل تبويب آخر، فتبقى الأيقونة باهتة ولا يمكن
الضغط عليها خارج الموقع، ويعيد المزامنة عند تنشيط التبويب والتنقل وتركيز النافذة.

---

<a id="الأداء-والأمان"></a>
## الأداء والأمان

- استهلاك المعالج والذاكرة شبه معدوم (< 1 ميجابايت).
- لا ترسل أي بيانات أو تحليلات عبر الشبكة (Zero Telemetry).
- تعمل ضمن ضوابط الأمان الصارمة لمتصفحات كروميوم.
- تُدمج نداءات المراقب في إطار رسم واحد، فلا تتسبب الصفحة النشطة في مسح كامل للمستند عند كل تغيير.
- اضبط `window.__TEAMX_DEBUG__ = true` لإظهار الأعطال التي كان يتم ابتلاعها في وحدة التحكم.

---

<div align="center">

صُنعت بواسطة <a href="https://github.com/shadow-x78">shadow-x78</a> ·
[سجل التغييرات](../CHANGELOG.md) ·
[الأمان](../SECURITY.md)

<sub>&copy; 2026 TeamX - AdBlock</sub>

</div>

