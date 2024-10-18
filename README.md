# Northcoders News API

Link to the hosted version https://my-first-project-the8.onrender.com

This project provides a RESTful API designed for a news application, offering endpoints to retrieve, create, update, and delete articles, topics, comments, and user data. The API supports sorting, filtering, and pagination of articles, while also including features such as comment counting and vote tracking.

Built with Node.js and Express, this API interacts with a PostgreSQL database. It is rigorously tested using Jest and Supertest to ensure robust error handling and maintainable code quality.

Instruction:

1. Clone the repository:
    git clone https://github.com/your-username/be-nc-news.git, 
    cd be-nc-news
2. Install dependencies:
    npm install
3. Set up environment variables:
    Create the following two environment files in the root directory in order to successfully connect to the two databases locally:
    .env.development
    .env.test
    Use .env-example as a template
4. Set up the databases:
    npm run setup-dbs
5. Seed the local database:
    npm run seed
6. Run the tests: To ensure everything is working properly, run the test suite:
    npm test
7. To start the development server, use:
    npm start

Minimum Version Requirements:
    Node.js: v14 or higher,
    PostgreSQL: v12 or higher



--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
