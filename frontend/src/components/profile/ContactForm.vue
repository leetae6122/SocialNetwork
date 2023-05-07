<template>
    <Form @submit="submitUser" :validation-schema="userFormSchema">
        <div class="modal-header">
            <h3 class="modal-title" id="eidtContactModalLabel">
                <slot></slot>
            </h3>
            <button type="button" class="btn border-0 text-danger" data-bs-dismiss="modal" aria-label="Close">
                <i class="fa-sharp fa-solid fa-circle-xmark" style="font-size: 1.5rem;"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <strong for="address">Address</strong>
                <Field v-slot="{ field }" v-model="userLocal.address" name="content">
                    <textarea v-bind="field" name="address" rows="5" class="form-control"
                        placeholder="Enter places lived here" />
                </Field>
                <ErrorMessage name="address" class="error-feedback" />
            </div>
            <div class="form-group">
                <strong for="email">Email</strong>
                <Field name="email" type="text" class="form-control" v-model="userLocal.email" placeholder="E-mail" />
                <ErrorMessage name="email" class="error-feedback" />
                <small id="passwordHelpInline" class="text-muted">
                    Email has the format ( abc123@gmail.com ).
                </small>
            </div>
            <div class="form-group">
                <strong for="phone">Phone</strong>
                <Field name="phone" type="text" class="form-control" v-model="userLocal.phone" placeholder="Phone number" />
                <ErrorMessage name="phone" class="error-feedback" />
                <small id="passwordHelpInline" class="text-muted">
                    Phone number starts ( 09|03|07|08|05 ).
                </small>
            </div>
        </div>
        <div class="modal-footer justify-content-center">
            <div class="form-group">
                <button class="btn btn-success mx-1" @click="submitUser" data-bs-dismiss="modal">
                    <i class="fa-solid fa-floppy-disk mx-1"></i>
                    Save changes
                </button>
                <button type="button" class="ml-2 btn btn-danger mx-1" data-bs-dismiss="modal">
                    <i class="fa-solid fa-trash-can mx-1"></i>
                    Cancel
                </button>
            </div>
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
    emits: ["submit:user", "delete:user"],
    props: {
        user: { type: Object, required: true }
    },
    data() {
        const userFormSchema = yup.object().shape({
            places_lived: yup
                .string()
                .max(80, "Places lived has at most 80 characters."),
            email: yup
                .string()
                .required("Please enter your email.")
                .email("Email is not correct")
                .max(50, "Email has at most 50 characters."),
            phone: yup
                .string()
                .matches(
                    /((09|03|07|08|05)+([0-9]{8})\b)/g,
                    "Invalid phone number."),
        });
        return {
            userFormSchema,
            userLocal: this.user,
        };
    },
    methods: {
        submitUser() {
            this.$emit("submit:user", this.userLocal);
        },

    }
}
</script>
  
<style scoped>
@import "@/assets/form.css";

.form-group {
    margin-top: 12px;
}

.error-feedback {
    position: absolute;
    padding: 2px 3px;
    border-radius: 5px;
    background: white;
    z-index: 1;
}

button {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
}

.modal-header {
    color: blue;
    text-shadow: 2px 2px 5px #007BFF;
}

textarea {
    width: 100%;
    box-sizing: border-box;
    resize: none;
}
</style>