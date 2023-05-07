<template>
    <h4 class="card-header text-center">
        <slot></slot>
    </h4>
    <Form @submit="submitAuth" :validation-schema="authFormSchema" class="card-body">
        <div class="form-group">
            <label for="username">Username</label>
            <Field name="username" type="text" class="form-control" v-model="authLocal.username" />
            <ErrorMessage name="username" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <Field name="password" type="password" class="form-control" v-model="authLocal.password" />
            <ErrorMessage name="password" class="error-feedback" />
        </div>

        <div class="form-group mt-5">
            <button class="btn btn-primary w-100">
                <i class="fa-solid fa-door-open mx-1"></i>
                Log In
            </button>
        </div>
    </Form>
</template>
<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
    components: {
        Form, Field, ErrorMessage
    },
    emits: ["submit:auth"],
    props: {
        auth: { type: Object, required: true }
    },
    data() {

        const authFormSchema = yup.object().shape({
            username: yup
                .string()
                .required("Please enter your account."),
            password: yup
                .string()
                .required("Please enter your passwork."),
        });
        return {
            authLocal: this.auth,
            authFormSchema
        };
    },
    methods: {
        submitAuth() {
            this.$emit("submit:auth", this.authLocal);
        },
    },
}
</script>

<style scoped>
@import "@/assets/form.css";
.card-header {
    font-size: 2rem;
    color: blue;
    text-shadow: 2px 2px 5px #007BFF;
    border: none;
}
</style>