<template>
    <Form @submit="submitUser" :validation-schema="userFormSchema">
        <h3>
            <slot></slot>
        </h3>
        <div class="row">
            <!-- <div class="form-group">
                <Field name="oldpassword" type="password" class="form-control" v-model="oldpassword"
                    placeholder="Password" />
                <ErrorMessage name="oldpassword" class="error-feedback" />
            </div> -->
            <div class="form-group col-8">
                <Field name="newpassword" type="password" class="form-control" v-model="userLocal.password"
                    placeholder="Password" />
                <ErrorMessage name="newpassword" class="error-feedback" />
            </div>
            <div class="form-group col-8">
                <Field name="repassword" type="password" class="form-control" rules="confirmed:@password"
                    placeholder="Re-Password" />
                <ErrorMessage name="repassword" class="error-feedback" />
            </div>
        </div>
        <div class="justify-content-center">
            <div class="form-group">
                <button class="btn btn-success mx-1" @click="submitUser" data-bs-dismiss="modal">
                    <i class="fa-solid fa-floppy-disk mx-1"></i>
                    Save changes
                </button>
                <button class="ml-2 btn btn-danger mx-1" data-bs-dismiss="modal">
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
            // oldpassword: yup
            //     .string()
            //     .required("Please enter your old password.")
            //     .min(8, "Must have at least 8 characters.")
            //     .max(50, "Old Password has at most 50 characters.")
            //     .oneOf([yup.ref(userLocal.password), null], "Old Password does not match"),
            password: yup
                .string()
                .required("Please enter your new password.")
                .min(8, "Must have at least 8 characters.")
                .max(50, "New Password has at most 50 characters."),
            repassword: yup
                .string()
                .required("Please enter your re-password.")
                .min(8, "Must have at least 8 characters.")
                .max(50, "Re-Password has at most 50 characters.")
                .oneOf([yup.ref('newpassword'), null], "Re-Password does not match"),
        });
        return {
            newpassword:'',
            userFormSchema,
            userLocal: this.user,
        };
    },
    methods: {
        submitUser() {
            console.log(this.newpassword);
            this.userLocal.password = this.newpassword;
            this.$emit("submit:user", this.userLocal);
        },
    },

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