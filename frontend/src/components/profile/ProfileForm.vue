<template>
    <Form @submit="submitUser" :validation-schema="userFormSchema">
        <div class="modal-header">
            <h3 class="modal-title" id="eidtProfileModalLabel">
                <slot></slot>
            </h3>
            <button type="button" class="btn border-0 text-danger" data-bs-dismiss="modal" aria-label="Close">
                <i class="fa-sharp fa-solid fa-circle-xmark" style="font-size: 1.5rem;"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="row form-group">
                <div class="col-6">
                    <strong for="lastname">Lastname</strong>
                    <Field name="lastname" type="text" class="form-control" v-model="userLocal.lastname"
                        placeholder="Lastname" />
                    <ErrorMessage name="lastname" class="error-feedback" />
                </div>
                <div class="col-6">
                    <strong for="firstname">Firstname</strong>
                    <Field name="firstname" type="text" class="form-control" v-model="userLocal.firstname"
                        placeholder="Fristname" />
                    <ErrorMessage name="firstname" class="error-feedback" />
                </div>
            </div>
            <div class="form-group row">
                <div class="col-6">
                    <strong for="gender">Gender</strong>
                    <div>
                        <Field name="gender" type="radio" value="none" v-model="userLocal.gender" /> None
                        <Field name="gender" type="radio" value="male" v-model="userLocal.gender" /> Male
                        <Field name="gender" type="radio" value="female" v-model="userLocal.gender" /> Female
                    </div>
                    <ErrorMessage name="gender" class="error-feedback" />
                </div>
                <div class="col-6">
                    <strong for="gender">Date of birth</strong>
                    <Field name="birth_date" type="date" class="form-control" v-model="userLocal.birth_date" />
                    <ErrorMessage name="birth_date" class="error-feedback" />
                </div>
            </div>
            <div class="form-group">
                <strong for="intro">Intro</strong>
                <Field v-slot="{ field }" v-model="userLocal.intro" name="content">
                    <textarea v-bind="field" name="intro" rows="5" class="form-control" placeholder="Enter intro here" />
                </Field>
                <ErrorMessage name="intro" class="error-feedback" />
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
            lastname: yup
                .string()
                .required("Please enter the user's last name.")
                .min(2, "Must have at least 2 characters.")
                .max(20, "Last name has at most 20 characters."),
            firstname: yup
                .string()
                .required("Please enter the user's frist name.")
                .min(2, "Must have at least 2 characters.")
                .max(20, "First name has at most 20 characters."),
            birth_date: yup
                .date()
                .required("Please enter your birthday.")
                .max(new Date(Date.now() - 315569520000), "You must be at least 10 years"),
            gender: yup
                .string()
                .required("Please choose your gender."),
            intro: yup
                .string()
                .max(100, "Places lived has at most 100 characters."),
        });
        return {
            userFormSchema,
            userLocal: this.user,
        };
    },
    methods: {
        submitUser() {
            if (this.userLocal.gender == "male") this.userLocal.gender = true;
            else if (this.userLocal.gender == "female") this.userLocal.gender = false;
            else this.userLocal.gender = null;
            this.$emit("submit:user", this.userLocal);
        },
        getName() {
            this.userLocal.firstname = this.user.name?.firstname;
            this.userLocal.lastname = this.user.name?.lastname;
        }
    },
    created() {
        this.getName()
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