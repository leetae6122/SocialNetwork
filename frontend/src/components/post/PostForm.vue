<template>
  <Form @submit="submitPost" :validation-schema="postFormSchema">
    <div class="modal-header">
      <h3 class="modal-title" :id="modalLabels">
        <slot></slot>
      </h3>
      <button class="btn border-0 text-danger" data-bs-dismiss="modal" aria-label="Close">
        <i class="fa-sharp fa-solid fa-circle-xmark" style="font-size: 1.5rem;"></i>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="title">Title:</label>
        <Field name="title" type="text" class="form-control" v-model="postLocal.title" placeholder="Enter title here" />
        <ErrorMessage name="title" class="error-feedback" />
      </div>
      <div class="form-group">
        <label for="text">Content:</label>
        <!-- Input Image -->
        <Field name="image" type="file" class="form-control my-2" v-model="postLocal.image" accept=".jpg, .png" />
        <ErrorMessage name="image" class="error-feedback" />

        <!-- Input Text -->
        <Field v-slot="{ field }" v-model="postLocal.content" name="content">
          <textarea v-bind="field" name="content" rows="5" class="form-control border-0"
            placeholder="Enter content here" />
        </Field>
        <ErrorMessage name="content" class="error-feedback" />
      </div>
    </div>
    <div class="modal-footer justify-content-center">
      <button v-if="postLocal._id" class="btn btn-primary" type="submit" :class="{ disabled: disableButton }"
        data-bs-dismiss="modal">
        <i class="fa-solid fa-floppy-disk"></i>
        Save
      </button>
      <button v-else class="btn btn-primary" type="submit" :class="{ disabled: disableButton }" data-bs-dismiss="modal">
        <i class="fa-solid fa-floppy-disk"></i>
        Post
      </button>
      <button v-if="postLocal._id" type="button" class="ml-2 btn btn-danger" @click="deletePost" data-bs-dismiss="modal">
        <i class="fa-solid fa-trash-can"></i>
        Delete
      </button>
      <button v-else type="reset" class="ml-2 btn btn-danger" data-bs-dismiss="modal">
        <i class="fa-solid fa-trash-can"></i>
        Cancel
      </button>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Form, Field, ErrorMessage,
  },
  data() {
    const postFormSchema = yup.object().shape({
      title: yup
        .string()
        .max(100, "Title has at most 100 characters."),
      content: yup
        .string()
        .max(500, "Content has at most 500 characters."),
    });
    return {
      postLocal: this.post,
      postFormSchema
    };
  },
  computed: {
    disableButton() {
      if (this.postLocal.content || this.postLocal.image) {
        return false;
      } else {
        return true;
      }
    },
  },
  emits: ["submit:post", "delete:post"],
  props: {
    post: { type: Object, default: true },
    modalLabels: { type: String, default: null }

  },
  methods: {
    submitPost() {
      this.$emit("submit:post", this.postLocal);
    },
    async deletePost() {
      this.$emit("delete:post", this.postLocal.id);
    },
    onCloseCreate() {
      this.$emit("cancel");
    }
  },
}
</script>

<style scoped>
@import "@/assets/form.css";

.error-feedback {
  position: absolute;
  padding: 2px 3px;
  border-radius: 5px;
  background: rgb(50, 50, 50);
  z-index: 1;
}

label {
  margin-top: 0.25rem;
  margin-left: 0.5rem;
  font-size: medium;
  font-weight: bold;
}

input.form-control {
  border: none;
}

.form-group {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

button {
  padding: 0.7rem 1.2rem;
}

.modal-header {
  color: blue;
  text-shadow: 2px 2px 5px #007BFF;
}

textarea {
  width: 100%;
  height: auto;
  padding: 12px 20px;
  box-sizing: border-box;
  resize: none;
}
</style>