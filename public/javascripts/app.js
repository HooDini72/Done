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
            todoColumns: ["ID", "Name", "Deadline", "Importance", "Done"],
            closeToDeadlineCol: ["Name", "Deadline"],
            todos: [new ToDo("Full Stack", "2024-04-09", "high", false), new ToDo("SW2", "2024-05-09", "medium", false), new ToDo("SW1", "2024-05-09", "low", true)],
            todoName: "",
            deadline: new Date().toISOString().slice(0, 10), // current date
            importance: "medium",
            nameEmpty: false,
            deadlineEmpty: false,
            importanceEmpty: false,
            checked: [false, false, false],
            allChecked: false
        };
    },
    methods: {
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
