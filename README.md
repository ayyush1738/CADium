# CADium - Seamless 3D Model Viewing Experience

## Overview
CADium is a powerful application that enables users to import, view, and interact with 3D models effortlessly. Supporting **.obj** and **.stl** file formats, CADium offers an appealing user interface coupled with intuitive functionality, making it an ideal tool for the designers.

## Running the Project
### Clone the Repository
```sh
git clone https://github.com/ayyush1738/Doc-Scanning.git
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
- **Interactive Viewing**: Rotate, zoom, and pan with smooth controls.
- **User-Friendly Interface**: Clean and modern UI for an enhanced user experience.
- **Performance Optimized**: Efficient rendering to handle complex models.
- **Cross-Platform Compatibility**: Works across different operating systems.

## Technologies Used
- **Frontend**: React.js, Three.js
- **Rendering**: WebGL
- **Styling**: Tailwind CSS
- **File Processing**: OBJ and STL parsers

## Contributing
We welcome contributions! Follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Commit changes: `git commit -m "Add new feature"`
4. Push the branch: `git push origin feature-branch`
5. Open a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For any questions or suggestions, feel free to reach out:
- **Email**: your-email@example.com
- **GitHub**: [yourusername](https://github.com/yourusername)

