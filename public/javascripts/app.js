
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
            closeToDeadline: [],
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
                this.todos = resp.data;
                for(let i = 0; i < this.todos.length; i++){
                    this.checked.push(false);
                    let delta = new Date((this.todos[i].deadline)).getTime() - new Date().getTime(); //
                    let days = Math.round(delta / (1000 * 3600 * 24) + 1);
                    if(days <= 5){
                        this.closeToDeadline.push(this.todos[i]);
                    }
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
                let newTodo = new ToDo(resp.data.insertedId, this.todoName, this.deadline, this.importance, false);
                this.checked.push(false);
                this.todos.push(newTodo);
                let delta =  new Date((newTodo.deadline)).getTime() - new Date().getTime(); 
                let days = Math.round(delta / (1000 * 3600 * 24) + 1);
                if(days <= 5){
                    this.closeToDeadline.push(newTodo);
                }
                this.todoName = "";
            })
            .catch(error => alert(`Failed to add todo \nCode: ${error.code}\nMessage: ${error.message}\nResponse: ${JSON.stringify(error.response, null, 2)}`));
         
        },
        checkAll: function () {
            for (let i = 0; i < this.checked.length; i++) {
                this.checked[i] = !this.checked[i];
            }
        },
        setDone: function(entry){
            const url = "http://localhost:3000/api/set/done/" + this.mail;
            axios.post(url, {id: entry._id, value: !entry.done}, {headers: this.authorizationHeader()})
            .catch(error => alert(`Failed to set done \nCode: ${error.code}\nMessage: ${error.message}\nResponse: ${JSON.stringify(error.response, null, 2)}`));
        },
        deleteTodo: function () {
            let i = this.checked.length-1; // vice versa, so that the indices don't shift when removed
            let toDelet= [];
            while(i >= 0 ){
                if (this.checked[i]) {
                    toDelet.push(this.todos[i]._id);
                    this.checked.splice(i, 1);
                    if(this.closeToDeadline.includes(this.todos[i])){
                        this.closeToDeadline.splice(this.closeToDeadline.indexOf(this.todos[i]), 1);
                    }
                    this.todos.splice(i, 1);
                }
                i--;
            }
            this.allChecked = false;
            const url = "http://localhost:3000/api/remove/todos/" + this.mail;
            axios.delete(url, {headers: this.authorizationHeader(), data: {ids: toDelet}})
            .catch(error => alert(`Failed to remove todos \nCode: ${error.code}\nMessage: ${error.message}\nResponse: ${JSON.stringify(error.response, null, 2)}`))
        }
    }

}).mount("#app");
