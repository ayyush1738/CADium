<template>
  <div class="upload-container">
    <input type="file" @change="handleFileChange" accept=".stl,.obj" />
    <button @click="uploadFile">Upload</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      file: null,
    };
  },
  methods: {
    handleFileChange(event) {
      this.file = event.target.files[0];
    },
    async uploadFile() {
      if (!this.file) return alert("Please select a file");

      let formData = new FormData();
      formData.append("file", this.file);

      try {
        let response = await axios.post("http://127.0.0.1:5000/upload", formData);
        alert("Upload successful");
        this.$emit("fileUploaded", response.data.filename);
      } catch (error) {
        console.error("Upload error", error);
      }
    },
  },
};
</script>

<style scoped>
.upload-container {
  margin: 20px;
}
button {
  margin-left: 10px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
