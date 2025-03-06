<template>
  <div>
    <h1>3D CAD Viewer</h1>
    <FileUpload @fileUploaded="setFilename" />
    <ModelViewer v-if="filename" :filename="filename" />
  </div>
</template>

<script>
import FileUpload from "./components/FileUpload.vue";
import ModelViewer from "./components/ModelViewer.vue";

export default {
  components: { FileUpload, ModelViewer },
  data() {
    return {
      filename: "",
    };
  },
  methods: {
    setFilename(name) {
      this.filename = name;
    },
  },
};
</script>

<style>
h1 {
  text-align: center;
  margin-top: 20px;
}
</style>
