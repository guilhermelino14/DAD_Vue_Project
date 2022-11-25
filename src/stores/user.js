import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import axios from 'axios'
axios.defaults.withCredentials = true;


export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        user: useStorage('user',{}),
        token: useStorage('token',""),
        islogged: useStorage('islogged',false)
    }),
    getters: {
        getToken: (state) => state.token,
        getUser: (state) => state.user,
    },
    actions: {
        login(RequestUser) {
            this.user = RequestUser
            this.token = RequestUser.token
            this.islogged = true
        },
        logout() {
            const config = {
                headers: {
                    'Content-Type': "application/json",
                    Authorization: "Bearer " + this.token,
                },
            };
            axios.post(import.meta.env.VITE_API_URL+'/logout',[], config)
            .then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error)
            })
            this.user = {}
            this.token = ""
            this.islogged = false
        }
    }

})
