# Pet Care Platform 🐾
# پلتفرم مراقبت از حیوانات خانگی 🐾

[English](#english) | [فارسی](#persian)

## English

### Overview
Pet Care Platform is a comprehensive solution for pet owners and service providers, offering a seamless booking system for pet care services. This platform connects pet owners with professional pet care providers, making it easier to schedule and manage pet care services.

### Features
- 🔐 Secure authentication system
- 📅 Easy booking management
- 🐕 Support for multiple pet types
- 📱 Responsive design
- 🔍 Advanced search and filtering
- 📸 Image upload capabilities
- 🌐 Multi-language support

### Tech Stack
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **File Storage**: AWS S3
- **Authentication**: JWT
- **Validation**: Class Validator, Zod
- **Testing**: Jest

### Getting Started

#### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- AWS Account (for S3 storage)

#### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/VersatileFusion/Pet-Care-Platform.git
   ```

2. Install dependencies:
   ```bash
   cd Pet-Care-Platform
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

4. Create the database:
   ```bash
   createdb petcare_booking
   ```

5. Run migrations:
   ```bash
   npm run migration:run
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

### Contributing
We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Persian

### معرفی
پلتفرم مراقبت از حیوانات خانگی یک راه‌حل جامع برای صاحبان حیوانات خانگی و ارائه‌دهندگان خدمات است که سیستم رزرو آسان برای خدمات مراقبت از حیوانات خانگی را ارائه می‌دهد. این پلتفرم صاحبان حیوانات خانگی را با ارائه‌دهندگان حرفه‌ای خدمات مراقبت از حیوانات خانگی متصل می‌کند و برنامه‌ریزی و مدیریت خدمات مراقبت از حیوانات خانگی را آسان‌تر می‌کند.

### ویژگی‌ها
- 🔐 سیستم احراز هویت امن
- 📅 مدیریت آسان رزرو
- 🐕 پشتیبانی از انواع مختلف حیوانات خانگی
- 📱 طراحی واکنش‌گرا
- 🔍 جستجو و فیلتر پیشرفته
- 📸 قابلیت آپلود تصویر
- 🌐 پشتیبانی چند زبانه

### تکنولوژی‌های استفاده شده
- **بک‌اند**: Node.js، Express.js، TypeScript
- **پایگاه داده**: PostgreSQL
- **ORM**: TypeORM
- **ذخیره‌سازی فایل**: AWS S3
- **احراز هویت**: JWT
- **اعتبارسنجی**: Class Validator، Zod
- **تست**: Jest

### شروع کار

#### پیش‌نیازها
- Node.js (نسخه ۱۴ یا بالاتر)
- PostgreSQL
- حساب AWS (برای ذخیره‌سازی S3)

#### نصب
۱. کلون کردن مخزن:
   ```bash
   git clone https://github.com/VersatileFusion/Pet-Care-Platform.git
   ```

۲. نصب وابستگی‌ها:
   ```bash
   cd Pet-Care-Platform
   npm install
   ```

۳. تنظیم متغیرهای محیطی:
   ```bash
   cp .env.example .env
   ```
   فایل `.env` را با تنظیمات خود به‌روزرسانی کنید.

۴. ایجاد پایگاه داده:
   ```bash
   createdb petcare_booking
   ```

۵. اجرای مایگریشن‌ها:
   ```bash
   npm run migration:run
   ```

۶. راه‌اندازی سرور توسعه:
   ```bash
   npm run dev
   ```

### مشارکت
ما از مشارکت‌های شما استقبال می‌کنیم! لطفاً [راهنمای مشارکت](CONTRIBUTING.md) ما را برای جزئیات کد رفتار و فرآیند ارسال درخواست‌های pull مطالعه کنید.

### مجوز
این پروژه تحت مجوز MIT منتشر شده است - برای جزئیات به فایل [LICENSE](LICENSE) مراجعه کنید. 