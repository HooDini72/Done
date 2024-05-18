class ToDo {
    constructor(name, deadline, importance, done) {
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
            checked: [false, false, false],
            allChecked: false,
            jwt: {
                token: localStorage.getItem("token"),
                expiresAt: localStorage.getItem("expiresAt") ? new Date(+localStorage.getItem("expiresAt")) : null
            },
            mail: localStorage.getItem("mail"),
        };
    },
    mounted(){
        if(this.jwt.token){
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
                this.todos = resp.data;
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
            let newTodo = new ToDo(this.todoName, this.deadline, this.importance, false);
            this.checked.push(false);
            this.todos.push(newTodo);
        },
        checkAll: function () {
            for (let i = 0; i < this.checked.length; i++) {
                this.checked[i] = !this.checked[i];
            }
        },
        deleteTodo: function () {
            let i = this.checked.length-1; // vice versa, so that the indices don't shift when removed
            while(i >= 0 ){
                console.log(i);
                if (this.checked[i]) {
                    this.checked.splice(i, 1);
                    this.todos.splice(i, 1);
                }
                i--;
            }
            this.allChecked = false;
        }
    }

}).mount("#app");
