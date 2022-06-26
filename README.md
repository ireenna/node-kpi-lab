# node-kpi-lab

Стек технологій даного проекту:

- Fastify
- compiler Typescript
- Mongoose

Чому Fastify:

- Наявні повноцінні контролери (значення функції повертається клієнту у тілі відповіді).
- Зручна обробка синхронних та асинхронних помилок.
- Валідація вхідних параметрів.
- Розширюваність.

Fastify підтримує і звичний для розробників на Express стиль формування відповіді сервера, і більш перспективний у формі значення функції, що повертається, при цьому залишаючи можливість гнучко маніпулювати іншими параметрами відповіді (статусом, заголовками)

Чому Typescript:
Typescript - типізований JavaScript, та оскільки ми мали досвід роботи з типізованими мовами програмування та Typescript вцілому, то ми надали перевагу Typescript.

Чому Mongoose:
MongoDB - документоорієнтована система управління базами даних, яка не вимагає опису схеми таблиць. Вважається одним із класичних прикладів NoSQL-систем, використовує JSON-подібні документи та схему бази даних.
Комбінація MongoDB з Fastify є дуже поширеною та вдалою.
Mongoose представляє спеціальну ODM-бібліотеку (Object Data Modelling) для роботи з MongoDB, яка дозволяє зіставляти об'єкти класів та документи колекцій із бази даних.
На нашу думку, це найзручніша для використання база даних - MongoDB з її ODM Mongoose.

Схема БД:
User:
- name: string;
- email: string;
- password: string;
- avatar: string;
- isAdmin: boolean;
- posts: Schema.Types.ObjectId[];

Posts:
- title: string;
- content: string;
- category: string;
- tags: string[];
- createdAt: string;
- updatedAt: string;
- creator: Schema.Types.ObjectId;

![Screenshot](assets/databaseSchema.png)
