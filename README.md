AbleSpace – Task Management System

A responsive task management application built as a Full Stack Developer technical assessment.

Overview

AbleSpace provides a clean task management experience where users can create, view, edit, delete, search, and manage tasks. The application supports task status, priority, due dates, theme switching, guest access, and persistent task data.

Features

Authentication

Guest Login

Protected application flow

Guest session persistence

Back to Login option

Task Management

Create tasks

View task details

Edit tasks

Delete tasks

Change task status

Change task priority

Set task due dates

Due-date calendar

Search tasks

Dashboard

Total Tasks

To Do

In Progress

Completed

Responsive task cards

Theme

Light/Dark theme

Theme preference persists across refreshes

Backend & Persistence

NestJS REST API

SQLite database

TypeORM

Frontend API integration

Local persistence fallback

Responsive Design

Desktop

Tablet

Mobile

Tech Stack

Frontend

Next.js

React

TypeScript

Tailwind CSS

Backend

NestJS

TypeScript

TypeORM

SQLite

Project Structure

AbleSpace-Assessment/
├── frontend/
├── backend/
└── README.md

Getting Started

Prerequisites

Node.js

npm

Frontend

cd frontend
npm install
npm run dev

Frontend:

http://localhost:3000

Backend

Open another terminal:

cd backend
npm install
npm run start:dev

API Endpoints

Method

Endpoint

Description

GET

/api/tasks

Get all tasks

POST

/api/tasks

Create a task

PATCH

/api/tasks/:id

Update a task

DELETE

/api/tasks/:id

Delete a task

Guest Flow

Login
  ↓
Continue as Guest
  ↓
Task Dashboard
  ↓
Manage Tasks
  ↓
Back to Login

Protected pages require an active guest session.

Theme Persistence

The selected Light/Dark theme is stored locally and remains selected after page refresh.

Data Persistence

Tasks are persisted through the NestJS API and SQLite database. The frontend also maintains local persistence as a fallback when the API is unavailable.

Design & Responsiveness

The interface follows the provided assessment design while supporting desktop, tablet, and mobile layouts.

Part 2 – Product Understanding

Part 2 is provided separately as a screenshot-based document covering:

AbleSpace Take Data workflow

Workflow explanation

UX/UI observations

Suggested functionality improvements

## Live Demo

### Frontend
https://able-space-task-management.vercel.app/login

### Backend API
https://ablespace-backend-8vnt.onrender.com

## GitHub Repository

https://github.com/BhanuStackDev/AbleSpace-Task-Management

## Author

Bhanuday Urmaliya

Full Stack Developer