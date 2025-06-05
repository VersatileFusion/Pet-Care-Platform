# Pet Care Platform 🐾

# پلتفرم مراقبت از حیوانات خانگی 🐾

[English](#english) | [فارسی](#persian)

## English

### Overview

Pet Care Platform is a comprehensive solution for pet owners and service providers, offering a seamless booking system for pet care services. This platform connects pet owners with professional pet care providers, making it easier to schedule and manage pet care services.

### Features

- 🔐 Secure authentication system with JWT
- 📅 Easy booking management with real-time availability
- 🐕 Support for multiple pet types and breeds
- 📱 Responsive design for all devices
- 🔍 Advanced search and filtering capabilities
- 📸 Image upload with AWS S3 integration
- 🌐 Multi-language support (English & Persian)
- 💳 Secure payment processing
- 📊 Admin dashboard for service providers
- 📱 Push notifications for booking updates
- ⭐ Rating and review system
- 📍 Location-based service provider search

### Project Structure
```
pet-care-platform/
├── booking-service/        # سرویس مدیریت رزرو
│   ├── src/
│   │   ├── controllers/   # کنترلرهای درخواست
│   │   ├── services/      # منطق کسب و کار
│   │   ├── models/        # مدل‌های پایگاه داده
│   │   ├── routes/        # مسیرهای API
│   │   ├── middleware/    # میدلورهای سفارشی
│   │   └── utils/         # توابع کمکی
│   └── tests/             # تست‌های واحد و یکپارچه
├── auth-service/          # سرویس احراز هویت
├── payment-service/       # سرویس پردازش پرداخت
├── user-service/         # سرویس مدیریت کاربران
└── admin-service/        # سرویس داشبورد مدیریت
```

### Tech Stack

- **Backend Services**:
  - **Express.js Services**:
    - Node.js & Express.js
    - TypeScript
    - TypeORM for database operations
    - JWT for authentication
    - Class Validator & Zod for validation
    - Jest for testing
    - Swagger for API documentation
  - **ASP.NET Core Services**:
    - .NET 7
    - Entity Framework Core with PostgreSQL provider
    - AutoMapper for object mapping
    - FluentValidation for request validation
    - MediatR for CQRS pattern
    - Serilog for structured logging
    - xUnit and Moq for testing
    - Swagger/OpenAPI for API documentation
    - Identity Server for authentication
    - SignalR for real-time features
    - Background Services for scheduled tasks
    - Health Checks for monitoring
    - Polly for resilience and transient fault handling

- **Database**: 
  - PostgreSQL
  - Redis for caching
  - Entity Framework Core migrations
  - Dapper for high-performance queries

- **Infrastructure**:
  - AWS S3 for file storage
  - Docker for containerization
  - GitHub Actions for CI/CD
  - Nginx as reverse proxy
  - Azure DevOps for deployment
  - Application Insights for monitoring
  - Azure Key Vault for secrets management

### API Documentation
The API documentation is available at `/api-docs` when running the server. It includes:
- Authentication endpoints
- Booking management
- User profile management
- Payment processing
- Admin operations

### Getting Started

#### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Redis (v6 or higher)
- AWS Account (for S3 storage)
- Docker (optional)

#### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/VersatileFusion/Pet-Care-Platform.git
   cd Pet-Care-Platform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=petcare_booking

   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=24h

   # AWS
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=your_region
   AWS_S3_BUCKET=your_bucket_name

   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

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

### Development

- Run tests: `npm test`
- Build the project: `npm run build`
- Start production server: `npm start`
- Generate API documentation: `npm run docs`

### Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- Code of conduct
- Development process
- Pull request process
- Coding standards
- Commit message format

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Persian

### معرفی

پلتفرم مراقبت از حیوانات خانگی یک راه‌حل جامع برای صاحبان حیوانات خانگی و ارائه‌دهندگان خدمات است که سیستم رزرو آسان برای خدمات مراقبت از حیوانات خانگی را ارائه می‌دهد. این پلتفرم صاحبان حیوانات خانگی را با ارائه‌دهندگان حرفه‌ای خدمات مراقبت از حیوانات خانگی متصل می‌کند و برنامه‌ریزی و مدیریت خدمات مراقبت از حیوانات خانگی را آسان‌تر می‌کند.

### ویژگی‌ها

- 🔐 سیستم احراز هویت امن با JWT
- 📅 مدیریت آسان رزرو با نمایش زمان‌های موجود
- 🐕 پشتیبانی از انواع مختلف حیوانات خانگی و نژادها
- 📱 طراحی واکنش‌گرا برای تمام دستگاه‌ها
- 🔍 قابلیت‌های پیشرفته جستجو و فیلتر
- 📸 آپلود تصویر با یکپارچه‌سازی AWS S3
- 🌐 پشتیبانی چند زبانه (انگلیسی و فارسی)
- 💳 پردازش امن پرداخت
- 📊 داشبورد مدیریت برای ارائه‌دهندگان خدمات
- 📱 اعلان‌های فوری برای به‌روزرسانی‌های رزرو
- ⭐ سیستم امتیازدهی و نظرات
- 📍 جستجوی ارائه‌دهنده خدمات بر اساس موقعیت مکانی

### ساختار پروژه
```
pet-care-platform/
├── booking-service/        # سرویس مدیریت رزرو
│   ├── src/
│   │   ├── controllers/   # کنترلرهای درخواست
│   │   ├── services/      # منطق کسب و کار
│   │   ├── models/        # مدل‌های پایگاه داده
│   │   ├── routes/        # مسیرهای API
│   │   ├── middleware/    # میدلورهای سفارشی
│   │   └── utils/         # توابع کمکی
│   └── tests/             # تست‌های واحد و یکپارچه
├── auth-service/          # سرویس احراز هویت
├── payment-service/       # سرویس پردازش پرداخت
├── user-service/         # سرویس مدیریت کاربران
└── admin-service/        # سرویس داشبورد مدیریت
```

### تکنولوژی‌های استفاده شده

- **Backend Services**:
  - **Express.js Services**:
    - Node.js & Express.js
    - TypeScript
    - TypeORM for database operations
    - JWT for authentication
    - Class Validator & Zod for validation
    - Jest for testing
    - Swagger for API documentation
  - **ASP.NET Core Services**:
    - .NET 7
    - Entity Framework Core with PostgreSQL provider
    - AutoMapper for object mapping
    - FluentValidation for request validation
    - MediatR for CQRS pattern
    - Serilog for structured logging
    - xUnit and Moq for testing
    - Swagger/OpenAPI for API documentation
    - Identity Server for authentication
    - SignalR for real-time features
    - Background Services for scheduled tasks
    - Health Checks for monitoring
    - Polly for resilience and transient fault handling

- **Database**: 
  - PostgreSQL
  - Redis for caching
  - Entity Framework Core migrations
  - Dapper for high-performance queries

- **Infrastructure**:
  - AWS S3 for file storage
  - Docker for containerization
  - GitHub Actions for CI/CD
  - Nginx as reverse proxy
  - Azure DevOps for deployment
  - Application Insights for monitoring
  - Azure Key Vault for secrets management

### مستندات API
مستندات API در مسیر `/api-docs` در زمان اجرای سرور در دسترس است. این شامل:
- نقاط پایانی احراز هویت
- مدیریت رزرو
- مدیریت پروفایل کاربر
- پردازش پرداخت
- عملیات مدیریتی

### شروع کار

#### پیش‌نیازها

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Redis (v6 or higher)
- AWS Account (for S3 storage)
- Docker (optional)

#### نصب

1. کلون کردن مخزن:

   ```bash
   git clone https://github.com/VersatileFusion/Pet-Care-Platform.git
   cd Pet-Care-Platform
   ```

2. نصب وابستگی‌ها:

   ```bash
   npm install
   ```

3. تنظیم متغیرهای محیطی:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=petcare_booking

   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=24h

   # AWS
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=your_region
   AWS_S3_BUCKET=your_bucket_name

   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. ایجاد پایگاه داده:

   ```bash
   createdb petcare_booking
   ```

5. اجرای مایگریشن‌ها:

   ```bash
   npm run migration:run
   ```

6. راه‌اندازی سرور توسعه:

   ```bash
   npm run dev
   ```

### توسعه
- اجرای تست‌ها: `npm test`
- ساخت پروژه: `npm run build`
- راه‌اندازی سرور تولید: `npm start`
- تولید مستندات API: `npm run docs`

### مشارکت
ما از مشارکت‌های شما استقبال می‌کنیم! لطفاً [راهنمای مشارکت](CONTRIBUTING.md) ما را برای جزئیات مطالعه کنید:
- کد رفتار
- فرآیند توسعه
- فرآیند درخواست pull
- استانداردهای کدنویسی
- فرمت پیام commit

### مجوز
این پروژه تحت مجوز MIT منتشر شده است - برای جزئیات به فایل [LICENSE](LICENSE) مراجعه کنید.
