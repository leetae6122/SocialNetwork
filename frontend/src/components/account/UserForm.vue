<template>
  <Form @submit="submitUser" :validation-schema="userFormSchema">
    <div class="modal-header">
      <h3 class="modal-title" :id="modalLabels">
        <slot></slot>
      </h3>
      <button class="btn border-0 text-danger" type="button" data-bs-dismiss="modal" aria-label="Close">
        <i class="fa-sharp fa-solid fa-circle-xmark" style="font-size: 1.5rem;"></i>
      </button>
    </div>
    <div class="modal-body">
      <div class="row form-group">
        <div class="col-6">
          <Field name="lastname" type="text" class="form-control" v-model="userLocal.lastname" placeholder="Lastname" />
          <ErrorMessage name="lastname" class="error-feedback" />
        </div>
        <div class="col-6">
          <Field name="firstname" type="text" class="form-control" v-model="userLocal.firstname"
            placeholder="Fristname" />
          <ErrorMessage name="firstname" class="error-feedback" />
        </div>
      </div>
      <div class="form-group">
        <Field name="username" type="text" class="form-control" v-model="userLocal.username" placeholder="Account" />
        <ErrorMessage name="username" class="error-feedback" />
      </div>
      <div class="form-group row">
        <div class="col-6">
          <Field name="password" type="password" class="form-control" v-model="userLocal.password"
            placeholder="Password" />
          <ErrorMessage name="password" class="error-feedback" />
        </div>
        <div class="col-6">
          <Field name="repassword" type="password" class="form-control" rules="confirmed:@password"
            placeholder="Re-Password" />
          <ErrorMessage name="repassword" class="error-feedback" />
        </div>
      </div>
      <div class="form-group">
        <Field name="email" type="text" class="form-control" v-model="userLocal.email" placeholder="E-mail" />
        <ErrorMessage name="email" class="error-feedback" />
        <small id="passwordHelpInline" class="text-muted">
          Email has the format ( abc123@gmail.com ).
        </small>
      </div>
      <div class="form-group" v-if="userLocal._id">
        <Field name="phone" type="text" class="form-control" v-model="userLocal.phone" placeholder="Phone number" />
        <ErrorMessage name="phone" class="error-feedback" />
        <small id="passwordHelpInline" class="text-muted">
          Phone number starts ( 09|03|07|08|05 ).
        </small>
      </div>
      <div class="form-group" v-if="userLocal._id">
        <Field name="places_lived" type="text" class="form-control" v-model="userLocal.places_lived"
          placeholder="Places lived" />
        <ErrorMessage name="places_lived" class="error-feedback" />
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
    </div>
    <div class="modal-footer justify-content-center">
      <div class="form-group">
        <button v-if="userLocal._id" class="btn btn-success mx-1" type="submit">
          <i class="fa-solid fa-floppy-disk mx-1"></i>
          Save changes
        </button>
        <button v-else class="btn btn-success mx-1" type="submit">
          <i class="fa-solid fa-floppy-disk mx-1"></i>
          Register
        </button>
        <button type="reset" class="ml-2 btn btn-danger mx-1" data-bs-dismiss="modal">
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
    user: { type: Object, required: true },
    modalLabels: { type: String, default: null }
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
      username: yup
        .string()
        .required("Please enter your account.")
        .min(8, "Must have at least 8 characters.")
        .max(50, "Account has at most 50 characters."),
      password: yup
        .string()
        .required("Please enter your password.")
        .min(8, "Must have at least 8 characters.")
        .max(50, "Password has at most 50 characters."),
      repassword: yup
        .string()
        .required("Please enter your re-password.")
        .min(8, "Must have at least 8 characters.")
        .max(50, "Re-Password has at most 50 characters.")
        .oneOf([yup.ref('password'), null], "Re-Password does not match"),
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
      places_lived: yup
        .string()
        .max(100, "Places lived has at most 100 characters."),
      birth_date: yup
        .date()
        .required("Please enter your birthday.")
        .max(new Date(Date.now() - 315569520000), "You must be at least 10 years"),
      gender: yup
        .string()
        .required("Please choose your gender.")
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
    deleteUser() {
      this.$emit("delete:user", this.userLocal.id);
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
</style>