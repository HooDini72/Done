class ToDo {
    constructor(name, deadline, importance, done) {
        this.name = name;
        this.deadline = deadline;
        this.importance = importance;
        this.done = done;
    }
}

let app = Vue.createApp({
    data(){
        return {
            //Todo Input values bidirectional binden --> schau demo von Full Stack
            todoColumns: ["ID", "Name", "Deadline", "Importance", "Done"],
            closeToDeadlineCol: ["Name", "Deadline"],
            todos: [new ToDo("Full Stack", "2024-04-09", "high", false), new ToDo("SW2", "2024-05-09", "medium", false), new ToDo("SW1", "2024-05-09", "low", true)],
        };
    },
    methods: {
        addTodo : function(){
            //Todo
        }
    }

}).mount("#app");
