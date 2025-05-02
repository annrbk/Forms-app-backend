# Form Creation and Management System (React/Node.js)

## Overview

A web application that allows users to create, fill out, and manage forms. Each user has a personal dashboard with access to their own forms, can view and fill forms created by others, and leave comments. The app includes search, tags, language switching (2 languages), and real-time updates for comments via WebSockets. Admins have extended access and control over users, forms, and comments.

## Features

### Users
- Registration and authentication  
- Personal dashboard to create, edit, and delete their own forms  
- Fill out forms created by others  
- View submitted responses in their account  
- Leave and delete their own comments  
- Add tags to forms  
- Search functionality  
- Language switching  
- Real-time comment updates via WebSockets  

### Admins
- All user functionality  
- Assign or revoke admin rights  
- Block, unblock, and delete users  
- Edit and delete any form  
- Delete any comment  

## Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, WebSocket
- **Frontend:** React, React Router, Material UI, React Intl  

## Frontend Repository

[https://github.com/annrbk/Forms-app-backend](https://github.com/annrbk/Forms-app-frontend)
