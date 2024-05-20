
class ToDo {
    constructor(_id, name, deadline, importance, done) {
        this._id = _id;
        this.name = name;
        this.deadline = deadline;
        this.importance = importance;
        this.done = done;
    }
}

var date
let app = Vue.createApp({
    data() {
        return {
            //Todo Input values bidirectional binden --> schau demo von Full Stack
            todoColumns: ["Name", "Deadline", "Importance", "Done"],
            closeToDeadlineCol: ["Name", "Deadline"],
            todos: [],
            todoName: "",
            deadline: new Date().toISOString().slice(0, 10), // current date
            importance: "medium",
            nameEmpty: false,
            deadlineEmpty: false,
            importanceEmpty: false,
            checked: [],
            allChecked: false,
            jwt: {
                token: localStorage.getItem("token"),
                expiresAt: localStorage.getItem("expiresAt") ? new Date(+localStorage.getItem("expiresAt")) : null
            },
            mail: localStorage.getItem("mail"),
        };
    },
    computed: {
        loggedIn: function() {
            return this.jwt.token && this.jwt.expiresAt && this.jwt.expiresAt > new Date();
          }
    },
    mounted(){
        if(this.jwt.token && this.jwt.expiresAt && this.jwt.expiresAt > new Date()){
            this.getTodos();
        }
    },
    methods: {
        authorizationHeader() {
            return this.jwt.token ? { 'Authorization': `Bearer ${this.jwt.token}` } : {};
        },
        getTodos(){
            const url = "http://localhost:3000/api/get/todos/" + this.mail;
            axios.get(url, { headers: this.authorizationHeader() })
            .then(resp => {
                console.log(resp.data);
                this.todos = resp.data;
                for(let i = 0; i < this.todos.length; i++){
                    this.checked.push(false);
                }
            })
            .catch(error => alert(`Failed to fetch todos\nCode: ${error.code}\nMessage: ${error.message}\nResponse: ${JSON.stringify(error.response, null, 2)}`));
        },
        addTodo: function () {
            if (!this.todoName) {
                this.nameEmpty = true;
                return;
            } else if (!this.deadline) {
                this.deadlineEmpty = true;
                return;
            } else if (!this.importance) {
                this.importanceEmpty = true;
                return;
            }

            this.nameEmpty = false;
            this.deadlineEmpty = false;
            this.importanceEmpty = false;

            let reqTodo = {
                mail: this.mail,
                name: this.todoName,
                deadline: this.deadline,
                importance: this.importance,
                done: false
            };
            const url = "http://localhost:3000/api/add/todo/" + this.mail;
            axios.post(url, {todo: reqTodo}, {headers: this.authorizationHeader()})
            .then(resp => {
                console.log(resp);
                let newTodo = new ToDo(resp.data.insertedId, this.todoName, this.deadline, this.importance, false);
                this.checked.push(false);
                this.todos.push(newTodo);
            })
            .catch(error => alert(`Failed to add todo \nCode: ${error.code}\nMessage: ${error.message}\nResponse: ${JSON.stringify(error.response, null, 2)}`));
         
        },
        checkAll: function () {
            for (let i = 0; i < this.checked.length; i++) {
                this.checked[i] = !this.checked[i];
            }
        },
        deleteTodo: function () {
            let i = this.checked.length-1; // vice versa, so that the indices don't shift when removed
            let toDelet= [];
            while(i >= 0 ){
                if (this.checked[i]) {
                    toDelet.push(this.todos[i]._id);
                    this.checked.splice(i, 1);
                    this.todos.splice(i, 1);
                }
                i--;
            }
            this.allChecked = false;
            const url = "http://localhost:3000/api/remove/todos/" + this.mail;
            axios.delete(url, {headers: this.authorizationHeader(), data: {ids: toDelet}})
            .then(resp => {
                console.log(resp)
            })
            .catch(error => alert(`Failed to remove todos \nCode: ${error.code}\nMessage: ${error.message}\nResponse: ${JSON.stringify(error.response, null, 2)}`))
        }
    }

}).mount("#app");
