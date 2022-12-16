<script setup>
import { ref, onMounted, inject} from 'vue'
import { useUserStore } from '../stores/user'
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
const storeUser = useUserStore();
const toast = inject('toast')

const customer = ref([]);

const api = import.meta.env.VITE_API_URL

onMounted( () => {
  axios.get(import.meta.env.VITE_API_URL+'/customers/'+storeUser.user.id)
  .then(response => {
    customer.value = response.data
  })
});

const updateCustomer = () => {
  customer.value.name = storeUser.user.name
  axios.put(import.meta.env.VITE_API_URL+'/customers/'+storeUser.user.id, customer.value)
  .then(response => {
    toast.success(response.data.message)

  }).catch(error => {
    toast.error(error.response.data.message)
  })
}

</script>

<template>
  <div class="page-holder bg-gray-100">
        <div class="container-fluid px-lg-4 px-xl-5 contentDiv">
          <section>
            <div class="row">
              <div class="col-lg-4">
                <div class="card card-profile mb-4">
                  <div class="card-header" style="background-image: url(https://therichpost.com/wp-content/uploads/2021/05/bootstrap5-carousel-slider-img1.jpg);"> </div>
                  <div class="card-body text-center"><img class="card-profile-img" :src="api + '/users/photo/' + storeUser.user.photo_url " alt="Jassa Rich">
                    <h3 class="mb-3">{{storeUser.user.name}}</h3>
                    <p class="mb-4" v-if="!customer == ''">Points: {{customer.points ? customer.points : 0}}</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-8">
                <div class="card mb-4">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="mb-4">
                          <label class="form-label">Name</label>
                          <input class="form-control" type="text" placeholder="Name" v-model="storeUser.user.name">
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="mb-4">
                          <label class="form-label">Email</label>
                          <input class="form-control" type="email" placeholder="Email" v-model="storeUser.user.email" disabled>
                        </div>
                      </div>
                      <div class="col-md-6" v-if="!customer == ''">
                        <div class="mb-0">
                          <label class="form-label">Phone</label>
                          <input class="form-control" type="text" placeholder="Phone" v-model="customer.phone">
                        </div>
                      </div>
                      <div class="col-md-6" v-if="!customer == ''">
                        <div class="mb-0">
                          <label class="form-label">NIF</label>
                          <input class="form-control" type="text" placeholder="NIF" v-model="customer.nif">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer text-end">
                    <button class="btn btn-primary" @click="updateCustomer" type="submit">Update Profile</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    
</template>

<style scoped>
      .card-header:first-child {
  border-radius: calc(1rem - 1px) calc(1rem - 1px) 0 0;
}
.card-header {
  position: relative;
  padding: 2rem 2rem;
  border-bottom: none;
  background-color: white;
  box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 8%);
  z-index: 2;
}
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: none;
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 30%);
  border-radius: 1rem;
}
body{
  font-family: 'Poppins'!important;
}
.text-primary {
  color: #4650dd !important;
}
h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6 {
 
  line-height: 1.2;
}
.text-muted {
  color: #6c757d !important;
}
.lead {
  font-size: 1.125rem;
  font-weight: 300;
}
.text-sm {
  font-size: .7875rem !important;
}
h3, .h3 {
  font-size: 1.575rem;
}
.page-holder {
  display: flex;
  overflow-x: hidden;
  width: 100%;
  min-height: calc(100vh - 72px);
 
  flex-wrap: wrap;
}
a {
  color: #4650dd!important;
  text-decoration: underline!important;
  cursor: pointer;
}
.card-profile-img {
  position: relative;
  max-width: 8rem;
  margin-top: -6rem;
  margin-bottom: 1rem;
  border: 3px solid #fff;
  border-radius: 100%;
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
  z-index: 2;
}
img, svg {
  vertical-align: middle;
}
.avatar.avatar-lg {
  width: 5rem;
  height: 5rem;
  line-height: 5rem;
}
.avatar {
  display: inline-block;
  position: relative;
  width: 3rem;
  height: 3rem;
  text-align: center;
  border: #dee2e6;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
  line-height: 3rem;
}
.form-control
{
  color: #343a40;
}
.page-heading {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 300;
}
.contentDiv
{
  padding-top: 4rem;
}
.card-profile .card-header {
  height: 9rem;
  background-position: center center;
  background-size: cover;
}
</style>