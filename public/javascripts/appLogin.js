let app = Vue.createApp({
    data() {
        return {
            loginEmail: '',
            loginPassword: '',
            registerEmail: '',
            registerPassword: '',
            registerPasswordRepeat: ''
        };
    },
    methods: {
        login() {
            const url = 'http://localhost:3000/user_handling/login';
            axios.post(url, { mail: this.loginEmail, pw: this.loginPassword })
              .then(response => {
                const { token, expiresAt } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('expiresAt', expiresAt);
                localStorage.setItem('mail', this.loginEmail);
                alert('Login successful');
                window.location.href = '/index.html';
              })
              .catch(error => {
                //Todo replace with toast
                alert("Login failed");
              });
        },
        register() {
            if (this.registerPassword != this.registerPasswordRepeat) {
                alert('Password and repeat password differ');
                return;
            }

            const url = 'http://localhost:3000/user_handling/register';
            axios.post(url, { mail: this.registerEmail, pw: this.registerPassword })
              .then(response => {
                //Todo replace with toast
                alert('Registration successful');
              })
              .catch(error => {
                alert("Registration failed");
            });
            this.registerEmail = "";
            this.registerPassword = "";
            this.registerPasswordRepeat = "";
        }
    }

});
app.mount("#app");