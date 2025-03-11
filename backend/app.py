from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
import os
import trimesh  # Install using: pip install trimesh

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
CONVERTED_FOLDER = 'converted_models'
ALLOWED_EXTENSIONS = {'stl', 'obj'}  # Allowed formats
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['CONVERTED_FOLDER'] = CONVERTED_FOLDER

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)
    return jsonify({"message": "File uploaded", "filename": file.filename}), 200

@app.route('/models/<filename>', methods=['GET'])
def get_model(filename):
    # Check if the file exists in the upload folder
    upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    converted_path = os.path.join(app.config['CONVERTED_FOLDER'], filename)

    if os.path.exists(upload_path):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    elif os.path.exists(converted_path):
        return send_from_directory(app.config['CONVERTED_FOLDER'], filename)
    else:
        return jsonify({"error": "File not found"}), 404


@app.route('/convert/<filename>/<target_format>', methods=['GET'])
def convert_model(filename, target_format):
    target_format = target_format.lower()

    # Validate the target format
    if target_format not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Target format not supported"}), 400
    
    source_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    # Check if source file exists
    if not os.path.exists(source_path):
        return jsonify({"error": "Source file not found"}), 404
    
    try:
        # Load the mesh
        mesh = trimesh.load_mesh(source_path)
        
        # Create a new filename for the converted file
        new_filename = f"{filename.rsplit('.', 1)[0]}.{target_format}"
        target_path = os.path.join(app.config['CONVERTED_FOLDER'], new_filename)
        
        # Export to the target format
        mesh.export(target_path)

        return jsonify({
            "message": "File converted successfully",
            "filename": new_filename,
            "original_format": filename.rsplit('.', 1)[1].lower(),
            "new_format": target_format,
            "download_url": f"http://localhost:5000/models/{new_filename}"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
