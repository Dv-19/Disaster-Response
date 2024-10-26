# Disaster-Response
A comprehensive web application facilitating effective disaster management through real-time distress signals, resource allocation, volunteer coordination, and seamless communication among government, NGOs, and the public.

## Introduction

The **Disaster Response Platform** is a full-stack web application designed to streamline disaster management processes. It enables real-time distress signal broadcasting, efficient resource allocation, volunteer coordination, and effective communication among government agencies, NGOs, and the general public. By leveraging modern web technologies and real-time communication, the platform ensures timely and organized responses to various disaster scenarios.

## Features

- **User Roles & Authentication**
  - **Public Users**: Send distress signals, and access resources.
  - **Volunteers**: Receive and manage assigned tasks, update task statuses.
  - **Government & NGO**: Report incidents, manage resources, assign tasks to volunteers.
  
- **Real-Time Distress Signals**
  - Broadcast and receive SOS signals with geolocation data.
  
- **Resource Management**
  - Track and allocate resources efficiently.
  
- **Volunteer Coordination**
  - Assign tasks to volunteers and monitor their statuses.
  
- **Interactive Maps**
  - Visualize incidents and resources on an interactive map interface.
  
- **Notifications**
  - Receive real-time notifications for new incidents and updates.
  
## Technologies Used

### Frontend
- **React.js**: Frontend library for building user interfaces.
- **Material-UI (MUI)**: UI component library for React.
- **React Router**: Routing library for React applications.
- **Leaflet & React-Leaflet**: Interactive maps.
- **Socket.IO Client**: Real-time communication.
- **Axios**: HTTP client for API requests.

### Backend
- **Node.js & Express.js**: Server-side runtime and framework.
- **MongoDB & Mongoose**: Database and ODM for data modeling.
- **Socket.IO**: Real-time communication between server and clients.
- **JWT (jsonwebtoken)**: Authentication using JSON Web Tokens.
- **Cors**: Enabling Cross-Origin Resource Sharing.

- - **Frontend**: React application communicating with the backend via RESTful APIs and Socket.IO for real-time features.
- **Backend**: Express server handling API requests, managing WebSocket connections, and interacting with MongoDB.
- **Database**: MongoDB storing user data, incidents, resources, and tasks.
- **Real-Time Communication**: Socket.IO facilitating real-time updates for distress signals.

### Prerequisites

- **Node.js** (v14 or above)
- **npm** or **yarn**
- **MongoDB** instance *(local or hosted, e.g., MongoDB Atlas)*

### Installation

1. **Clone the Repository**

   ```bash
   git https://github.com/Dv-19/Disaster-Response.git
   cd Disaster Response
