<script setup>
import { ref, inject } from 'vue'
import axios from 'axios'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const router = useRouter();
const storeUser = useUserStore();

const socket = inject("socket")
const toast = inject("toast")

let user = ref({
        email:'',
        password:''
})

let error = ref('');

axios.defaults.withCredentials = true;

const login = async () => {
    await axios.get(import.meta.env.VITE_API_URL+'/csrf-cookie', {withCredentials: true})
    await axios.post(import.meta.env.VITE_API_URL+'/login', user.value)
    .then(response => {
        if(response.data.user.blocked == 1){
            error.value = 'Your account is blocked'
            return
        }
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.user.token
        storeUser.login(response.data.user)
        router.push('/')
        socket.emit('loggedIn', response.data.user)
        toast.success('Logged in with success')
    })
    .catch(e => {
        error.value = e.response.data.error
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

                                        <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                                        <p class="text-white-50 mb-5">Please enter your login and password!</p>

                                        <div class="form-outline form-white mb-4" v-if="error != ''">
                                            <h6 class="text-danger" >{{error}}</h6>
                                        </div>

                                        <div class="form-outline form-white mb-4">
                                            <input v-model="user.email" type="email" id="typeEmailX" class="form-control form-control-lg" placeholder="Email" @keyup.enter="login"/>
                                        </div>

                                        <div class="form-outline form-white mb-4">
                                            <input v-model="user.password" type="password" id="typePasswordX"
                                                class="form-control form-control-lg" placeholder="Password" @keyup.enter="login"/>
                                        </div>

                                        <p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#!">Forgot
                                                password?</a></p>

                                        <button class="btn btn-outline-light btn-lg px-5" type="submit" @click="login" >Login</button>

                                        <hr class="my-2"/>
                                        <p class="mb-0">Don't have an account? <a href="#!"
                                                class="text-white-50 fw-bold">Sign Up</a>
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