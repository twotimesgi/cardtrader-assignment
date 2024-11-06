# Cardtrader-assignment

This project is a sample e-commerce system built with [Prisma](https://www.prisma.io/), MySql and NextJs demonstrating a setup with categories, products, and associated attributes.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Running the Project](#running-the-project)
4. [Features](#features)
5. [Routes](#routes)
6. [Category IDs](#category-ids)
7. [Notes](#notes)

---

## Prerequisites

Ensure the following are installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or higher)

## Project Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   
2. **Install dependencies**:
   Run the following command to install the necessary packages:
   ```bash
   npm install

## Running the Project

1. **Start the Development Server**:
   Run the following command to start the server:
   ```bash
   npm run dev

The application should now be running on `http://localhost:3000`.

## Features

- **Category Page Showing All Products**: View all products within a selected category.
- **Filters**: Filter products by various attributes such as size, color, and material.
- **Search with Debounce**: Search for products within a category with a debounce mechanism to minimize request overload.
- **Infinite Scroll**: Automatically load more products as the user scrolls, providing a seamless browsing experience.
- **Product Creation Page**: Create new products with necessary details and attributes.
- **Image Upload and Compression**: Upload images with automatic compression for optimized storage.
- **Category Creation Page**: Create new categories with customizable attributes, each with an option to mark attributes as required or optional.

## Routes
The following routes are available in the project:

- **/categories/[categoryId]**: Displays a list of all products within a specific category. Visit this route and substitute categoryId with one from below.
- **/products/create**: A page to create a new product.
- **/categories/new**: A page to create new categories. Allows you to define attributes for the category, with options to set them as required or optional.

## Category IDs

Here are the category IDs that can be used in the application for reference:

| Category         | ID                                     |
|------------------|----------------------------------------|
| Jeans            | 21c407a3-537d-4dbb-843e-c4aebd02ae92   |
| T-Shirts         | bfb4e045-672e-4d4a-a2d6-800d7acba25d   |
| Glasses          | ca65a7d5-47dc-420d-9cca-9b1150813222   |
| Shoes            | df58419f-4e0b-4240-84b1-28ca96f2dbee   |


## Notes

- **Environment Variables**: Required environment variables, including `DATABASE_URL`, are already provided inside .env file.
- **Database Access**: The project is set up to work with the pre-configured database.
- **Prisma Studio**: If you need to view or modify the database, you can optionally open Prisma Studio with:
  ```bash
  npx prisma studio
