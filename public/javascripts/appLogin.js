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
        loginFetch() {

            const url = new URL('http://localhost:3000/user_handling/login'); //Route for login
            url.search = new URLSearchParams({
                mail: this.loginEmail,
                pw: this.loginPassword
            }).toString();

            fetch(url)  //Send Request
                .then(resp => {
                    if (!resp.ok) {
                        throw new Error('Login failed');
                    }
                    return resp.json();
                })
                .then(data => {
                    localStorage.setItem('authToken', data.token); //save key/value pairs in the browser --> key: authToke, value: data.token
                    alert('Login successful');
                    window.location.href = '/index.html';
                })
                .catch(error => { 
                    console.error('Error:', error);
                    alert('Login failed');
                });

        },
        registerFetch() {
            if(this.registerPassword != this.registerPasswordRepeat){
                alert('Password and repeat Password differ');
            }

            const url = new URL('http://localhost:3000/user_handling/register'); //Route for registration
            url.search = new URLSearchParams({
                mail: this.registerEmail,
                pw: this.registerPassword
            }).toString();

            fetch(url)
                .then(resp => {
                    if (!resp.ok) {
                        throw new Error('Registration failed');
                    }
                    return resp.json();
                })
                .then(data => {
                    alert('Registration successful');
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Registration failed');
                });
        }
    }

}).mount("#app");