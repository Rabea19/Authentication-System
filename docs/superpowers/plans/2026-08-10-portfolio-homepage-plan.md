# Portfolio Homepage Redesign Implementation Plan

## الهدف

هنحوّل الصفحة الرئيسية الحالية من صفحة Authentication عادية إلى Portfolio Project احترافي خاص بـ Rabea Saad، مع الحفاظ على كل وظائف الـ Login و Sign Up الحالية بدون ما نكسر أي حاجة.

## بيانات المطور

- الاسم: Rabea Saad
- المسمى: Full-Stack JavaScript Developer
- GitHub: https://github.com/Rabea19
- LinkedIn: https://www.linkedin.com/in/rabea-saad-3a893a2b1
- Email: rabeasaadrabea199555@gmail.com

## الفكرة العامة

هنفضل مستخدمين نفس React Architecture الموجودة حاليًا.

مش هنغير أي حاجة في الـ Backend أو طريقة الـ Authentication.

التعديل هيكون بشكل أساسي في:

- شكل الصفحة الرئيسية
- المحتوى المكتوب
- Portfolio Identity
- Project Features
- Contact Links
- Animations
- تحسين شكل Login / Sign Up
- Responsive Design

الـ Login و Sign Up هيفضلوا شغالين في نفس الصفحة زي دلوقتي.

## التقنيات الحالية

- React 19
- React Router
- Tailwind CSS 4
- Vite 8
- Vitest
- Testing Library

## قواعد مهمة أثناء التنفيذ

- ممنوع تغيير طريقة عمل الـ Backend.
- ممنوع تغيير API payloads الخاصة بالـ Login أو Register.
- ممنوع تغيير Routes الحالية.
- ممنوع إضافة Animation Library بدون داعي.
- هنستخدم CSS و Tailwind في الـ Animations.
- لازم التصميم يشتغل كويس على Mobile و Tablet و Desktop.
- لازم نحافظ على Accessibility.
- لازم نحافظ على Labels الخاصة بالـ Inputs.
- لازم يبقى فيه Focus واضح للأزرار والروابط.
- لازم نحترم prefers-reduced-motion.
- كل الاختبارات القديمة لازم تفضل ناجحة.
- الـ Production Build لازم ينجح.
- GitHub Actions CI لازم يفضل أخضر.

---

# الملفات اللي هنشتغل عليها

## هنعدل

### client/src/pages/Home.jsx

مسؤول عن:

- Portfolio Hero
- بيانات Rabea Saad
- Project Overview
- Technologies
- Feature Cards
- GitHub / LinkedIn / Email
- Live Authentication Demo
- Login / Sign Up

### client/src/index.css

مسؤول عن:

- Animations
- Background Effects
- Floating Shapes
- Fade / Slide Effects
- Reduced Motion Support

## هنعمل ملف جديد

### client/src/pages/Home.test.jsx

هيختبر:

- اسم Rabea Saad
- Full-Stack JavaScript Developer
- روابط GitHub و LinkedIn و Email
- Project Features
- Live Authentication Demo
- Login / Sign Up

## ملفات مش هنلمسها

- server/**
- client/src/api/**
- client/src/context/AuthContext.jsx

---

# المرحلة 1 — Tests الأول

هنعمل Tests تحدد الشكل الجديد المطلوب قبل ما نعدل الصفحة.

هنختبر إن الصفحة الجديدة فيها:

- Rabea Saad
- Full-Stack JavaScript Developer
- About This Project
- Try the Live Authentication Demo
- GitHub
- LinkedIn
- Email

وكمان هنختبر وجود المميزات:

1. Secure Authentication
2. Email Verification
3. Password Recovery
4. Protected Routes
5. Security Middleware
6. Automated Testing & CI

وفي نفس الوقت هنتأكد إن:

- Login موجود
- Sign Up موجود
- Forgot Password موجود
- Sign Up بيظهر Full Name
- Sign Up بيظهر Confirm Password

## ملف الاختبار

هنعمل:

```text
client/src/pages/Home.test.jsx