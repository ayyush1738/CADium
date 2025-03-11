# CADium - Seamless 3D Model Viewing Experience

## Overview
CADium is a powerful application that enables users to import, view, and interact with 3D models effortlessly. Supporting **.obj** and **.stl** file formats, CADium offers an appealing user interface coupled with intuitive functionality, making it an ideal tool for the designers.

## Running the Project
### Clone the Repository
```sh
git clone https://github.com/ayyush1738/CADium.git
cd CADium
```

### Backend Setup
```sh
cd backend
```

1. Ensure you have Python and pip installed:
```sh
python --version
pip --version
```

2. Create the virtual environment:
```sh
python -m venv venv
```
This will create a `venv` folder in your project directory that will contain a separate Python environment.

3. Activate the virtual environment:
- **On Windows**:
```sh
venv\Scripts\activate
```
- **On Mac/Linux**:
```sh
source venv/bin/activate
```

4. Install dependencies:
```sh
pip install -r requirements.txt
```

5. Start the backend server:
```sh
python app.py
```

### Frontend Setup
Go back to the root repository:
```sh
cd ..
cd cad-frontend
```

1. Install dependencies:
```sh
npm install
```

2. Start the frontend server:
```sh
npm run dev
```

### Running the Application
Open your browser and navigate to:
```sh
http://localhost:3000
```

## Features
- **3D File Import**: Load **.obj** and **.stl** files seamlessly.
- **Interactive Viewing**: Rotate, zoom, move, export in different format, change color with smooth controls.
- **User-Friendly Interface**: Clean and modern UI for an enhanced user experience.
- **Performance Optimized**: Efficient rendering.
- **Cross-Platform Compatibility**: Works across different operating systems.

## Technologies Used
- **Frontend**: Next.js, Three.js
- **Styling**: Tailwind CSS
- **File Processing**: OBJ and STL parsers

## Testing Routes for Flask Model Conversion API

This section provides details on how to test the Flask API routes.

### Testing Routes

#### 1. Upload File
**Endpoint:** `/upload`  
**Method:** `POST`  
**Description:** Uploads a file to the server.  
**Example (Using cURL):**
```bash
curl -X POST -F "file=@path/to/your/file.stl" http://localhost:5000/upload
```

#### 2. Retrieve Model
**Endpoint:** `/models/<filename>`  
**Method:** `GET`  
**Description:** Retrieves the uploaded or converted model file.  
**Example:**
```bash
curl -O http://localhost:5000/models/sample.obj
```

#### 3. Convert Model Format
**Endpoint:** `/convert/<filename>/<target_format>`  
**Method:** `GET`  
**Description:** Converts the uploaded model to the specified format.  
**Example:**
```bash
curl -X GET http://localhost:5000/convert/sample.stl/obj
```

## Contact
For any questions or suggestions, feel free to reach out:
- **Email**: ayushsingh_rathore@srmap.edu.in
- **GitHub**: [ayyush1738](https://github.com/ayyush1738)

