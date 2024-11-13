

# Aircon Factory Unified Namespace Demo

## Overview

This demo simulates a factory monitoring system for an air conditioner manufacturing plant. It includes a backend server built with Node.js and Express connected to a MongoDB Atlas database and a frontend application developed with React.

The application allows users to:

- Visualize the factory hierarchy in UNS format including sites, areas, lines, and work centers.

- Monitor live sensor data from various machines.

- Control machine statuses and manage work centers.

- View key performance indicators (KPIs) like Overall Equipment Effectiveness (OEE).

- Receive real-time alerts when sensor values exceed predefined thresholds.


## Features

- **Factory Hierarchy Visualization**: Explore the structure of the factory including sites, areas, lines, and work centers.

- **Live Sensor Data Monitoring**: View real-time data from sensors attached to machines.

- **Machine Control**: Update machine statuses, add new work centers, and delete existing ones.

- **KPIs Dashboard**: Monitor key performance indicators like OEE to assess productivity.

- **Alerts System**: Receive instant alerts when sensor readings exceed specified thresholds.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 14.x or higher)

- **npm** (version 6.x or higher)

- **MongoDB** database (local installation or MongoDB Atlas cluster)


## Installation

### 1. Clone the Repository

### 2. Set Up the Backend

#### a. Navigate to the Backend Directory

```

cd backend

```

#### b. Install Backend Dependencies

```

npm install

```

#### c. Configure MongoDB Connection

- **Create a `.env` File**:

  In the `backend` directory, create a `.env` file to store environment variables.

```
  touch .env
```

- **Add the MongoDB URI**:

  Open the `.env` file and add your MongoDB connection string and DB name:

```
  MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
  DB=aircon_factory
```

Make sure you create the Database in your cluster before proceeding



### 3. Set Up the Frontend

#### a. Navigate to the Frontend Directory

```
cd ../frontend
```

#### b. Install Frontend Dependencies

```

npm install

```

## Running the Application

### 1. Start the Backend Server

In the `backend` directory, run:

```

npm start

```

The backend server will start on port **3001**.

### 2. Start the Frontend Application

Open a new terminal window, navigate to the `frontend` directory, and run:

```

npm start

```

The frontend application will start on port **3000**.

### 3. Access the Application

Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to view the Aircon Factory Dashboard.

- **backend/**: Contains the Node.js backend server code.

- **frontend/**: Contains the React frontend application code.

## Configuration

### Backend Configuration

- **MongoDB Connection**: Set your MongoDB URI in the `backend/.env` file.

- **Server Ports**:

  - **Backend Server**: Runs on port **3001**.

  - **WebSocket Server**: Runs on port **8089**.

### Frontend Configuration

- **API Endpoints**: The frontend communicates with the backend server at `http://localhost:3001`.

- **WebSocket Connection**: The frontend connects to the WebSocket server at `ws://localhost:8089`.

## Usage

### Viewing the Dashboard

- Open [http://localhost:3000](http://localhost:3000) in your web browser.



### Adding Sensor Data

- Navigate to the **Live Sensor Data** section.

- Use the form to add new sensor data by specifying:

  - **Work Center ID**

  - **Sensor Type**

  - **Value**

- Click **Add Sensor Data** to submit.

### Controlling Machines

- Go to the **Machine Control** section.

- **Update Machine Status**:

  - Enter the **Work Center ID**.

  - Select the new **Status**.

  - Click **Update Status**.

- **Add New Work Center**:

  - Enter the **Line ID** where the work center will be added.

  - Provide the **Work Center ID** and **Name**.

  - Select the **Status**.

  - Click **Add Work Center**.

- **Delete Work Center**:

  - Enter the **Work Center ID**.

  - Click **Delete Work Center**.

### Monitoring KPIs

- Visit the **Key Performance Indicators (KPIs)** section.

- View the OEE percentages for each work center.

### Viewing Alerts

- Check the **Alerts** section to see if any sensor values have exceeded their thresholds. If you add a sensor value more than 80 for Temperature or more than 120 for Pressure, you will see an alert

### Exploring Factory Hierarchy

- In the **Factory Hierarchy** section, view the structured representation of the factory's enterprise, sites, areas, lines, and work centers.


### Refreshing Data

- The frontend fetches data at regular intervals (e.g., KPIs every 10 seconds, sensor data every 5 seconds).


## License

This demo is licensed under the [MIT License](LICENSE).

## Contact

Humza Akhtar, humza.akhtar@mongodb.com
