<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter();

let user = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    nif: '',
    phone: ''
})

let error = ref('');

const register = async () => {
    await axios.post(import.meta.env.VITE_API_URL+'/register', user.value)
    .then(response => {
        router.push('/')
    })
    .catch(e => {
        error.value = e.response.data.message
    })
}
</script>

<template>
    <main>
        <div class="container">
            <section class="vh-100 gradient-custom">
                <div class="container py-5 h-100">
                    <div class="row d-flex justify-content-center align-items-center h-100">
                        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div class="card bg-dark text-white" style="border-radius: 1rem;">
                                <div class="card-body p-5 text-center">

                                    <div class="mb-md-5 mt-md-4 pb-5">

                                        <h2 class="fw-bold mb-2 text-uppercase">Register</h2>
                                        <p class="text-white-50 mb-5">Please enter your credentials to register</p>
                                        
                                        <div class="form-outline form-white mb-4" v-if="error != ''">
                                            <h6 class="text-danger" >{{error}}</h6>
                                        </div>
                                        
                                        <div class="form-outline form-white mb-4">
                                            <input v-model="user.name" type="name" id="name" class="form-control form-control-lg" placeholder="Name"/>
                                        </div>

                                        <div class="form-outline form-white mb-4">
                                            <input v-model="user.email" type="email" id="email" class="form-control form-control-lg" placeholder="Email"/>
                                        </div>

                                        <div class="form-outline form-white mb-4">
                                            <input v-model="user.password" type="password" id="password"
                                                class="form-control form-control-lg" placeholder="Password"/>
                                        </div>
                                        <div class="form-outline form-white mb-4">
                                            <input v-model="user.password_confirmation" type="password" id="password_confirmation"
                                                class="form-control form-control-lg" placeholder="Password confirmation"/>
                                        </div>
                                        

                                        <div class="form-outline form-white mb-4">
                                            <input v-model="user.nif" type="nif" id="nif" class="form-control form-control-lg" placeholder="NIF"/>
                                        </div>

                                        <div class="form-outline form-white mb-4">
                                            <input v-model="user.phone" type="phone" id="phone" class="form-control form-control-lg" placeholder="Phone"/>
                                        </div>

                                        <button class="btn btn-outline-light btn-lg px-5" @click="register">Register</button>

                                        <hr class="my-2"/>
                                        <p class="mb-0">You already have a account? <a href="#!"
                                                class="text-white-50 fw-bold">Sign In</a>
                                        </p>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    </main>
</template>