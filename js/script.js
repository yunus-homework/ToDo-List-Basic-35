"use strict";

(function () {
  const todoList = {
    formId: null,
    form: null,
    _lastId: 0,

    createId() {
      this._lastId += 1;
      return `${this._lastId}`;
    },

    findForm() {
      const form = document.getElementById(this.formId);

      if (form === null || form.nodeName !== "FORM") {
        throw new Error("There is no such form on the page");
      }

      this.form = form;
      return form;
    },

    addFormHandler() {
      this.form.addEventListener("submit", (event) => this.formHandler(event));
    },

    preFillTodoList() {
      document.addEventListener(
        "DOMContentLoaded",
        this.preFillHandler.bind(this)
      );
    },

    preFillHandler() {
      const data = this.getData();
      console.log(data);

      const todoItems = document.getElementById("todoItems");

      todoItems.innerHTML = "";

      data.forEach((todoItem) => {
        const template = this.createTemplate(todoItem);
        todoItems.prepend(template);
      });
    },

    formHandler(event) {
      event.preventDefault();
      const inputs = this.findInputs(event.target);
      const data = {
        id: this.createId(),
        done: false,
      };

      inputs.forEach((input) => {
        data[input.name] = input.value;
      });

      this.addTodo(data);

      event.target.reset();
    },

    addTodo(todo) {
      const data = this.getData();
      data.push(todo);
      this.setData(data);
    },

    setData(data) {
      localStorage.setItem(this.formId, JSON.stringify(data));
      this.preFillHandler();
    },

    getData() {
      return JSON.parse(localStorage.getItem(this.formId) || "[]");
    },

    findInputs(target) {
      return target.querySelectorAll("input:not([type=submit]), textarea");
    },

    init(todoListFormID) {
      if (typeof todoListFormID !== "string" || todoListFormID.length === 0) {
        throw new Error("Todo list ID is not valid");
      }

      this.formId = todoListFormID;
      this.findForm();
      this.addFormHandler();
      this.preFillTodoList();
    },

    createTemplate({ title, description, id, done }) {
      const todoItem = this.createElement("div", "col-4");
      const taskWrapper = this.createElement("div", "taskWrapper");

      const taskHeading = this.createElement("div", "taskHeading", title);
      const taskDescription = this.createElement(
        "div",
        "taskDescription",
        description
      );
      const deleteElement = this.createElement("button", "todo-delete", "🗑");
      deleteElement.setAttribute("data-id", id);
      deleteElement.addEventListener("click", this.deleteTodo.bind(this));

      const checkElement = this.createElement("input", "todo-check");
      checkElement.type = "checkbox";
      checkElement.setAttribute("data-id", id);
      if (done) {
        checkElement.setAttribute("checked", "checked");
      }
      checkElement.change = this.toggleTodo.bind(this);

      taskWrapper.append(taskHeading);
      taskWrapper.append(taskDescription);
      taskWrapper.append(checkElement);
      taskWrapper.append(deleteElement);
      todoItem.append(taskWrapper);

      return todoItem;
    },

    deleteTodo(ev) {
      const el = ev.target;
      const id = el.getAttribute("data-id");
      const data = this.getData();
      const newData = data.filter((todo) => todo.id !== id);
      this.setData(newData);
    },

    toggleTodo(ev) {
      console.log(ev.target);
    },

    createElement(nodeName, classes, innerContent) {
      const el = document.createElement(nodeName);

      if (Array.isArray(classes)) {
        classes.forEach((singleClassName) => {
          el.classList.add(singleClassName);
        });
      } else {
        el.classList.add(classes);
      }

      if (innerContent) {
        el.innerHTML = innerContent; // fix this
      }

      return el;
    },
  };

  todoList.init("todoForm");
})();

// (function () {
//   const todoList = {
//     formId: null,
//     form: null,

//     findForm() {
//       const form = document.getElementById(this.formId);

//       if (form === null || form.nodeName !== "FORM") {
//         throw new Error("There is no such form on the page");
//       }

//       this.form = form;
//       return form;
//     },

//     addFormHandler() {
//       this.form.addEventListener("submit", (event) => this.formHandler(event));
//     },

//     preFillTodoList() {
//       document.addEventListener(
//         "DOMContentLoaded",
//         this.preFillHandler.bind(this)
//       );
//     },

//     preFillHandler() {
//       const data = this.getData();
//       console.log(data);

//       data.forEach((todoItem) => {
//         const template = this.createTemplate(todoItem);
//         document.getElementById("todoItems").prepend(template);
//       });
//     },

//     formHandler(event) {
//       event.preventDefault();
//       const inputs = this.findInputs(event.target);
//       const data = {};

//       inputs.forEach((input) => {
//         data[input.name] = input.value;
//       });

//       this.setData(data);
//       const template = this.createTemplate(data);

//       document.getElementById("todoItems").prepend(template);

//       event.target.reset();
//     },

//     setData(data) {
//       if (!localStorage.getItem(this.formId)) {
//         let arr = [];

//         arr.push(data);

//         localStorage.setItem(this.formId, JSON.stringify(arr));

//         return;
//       }

//       let existingData = localStorage.getItem(this.formId);
//       existingData = JSON.parse(existingData);
//       existingData.push(data);
//       localStorage.setItem(this.formId, JSON.stringify(existingData));
//     },

//     getData() {
//       return JSON.parse(localStorage.getItem(this.formId));
//     },

//     findInputs(target) {
//       return target.querySelectorAll("input:not([type=submit]), textarea");
//     },

//     init(todoListFormID) {
//       if (typeof todoListFormID !== "string" || todoListFormID.length === 0) {
//         throw new Error("Todo list ID is not valid");
//       }

//       this.formId = todoListFormID;
//       this.findForm();
//       this.addFormHandler();
//       this.preFillTodoList();
//     },

//     createTemplate({ title, description }) {
//       const todoItem = this.createElement("div", "col-4");
//       let taskWrapper = this.createElement("div", "taskWrapper");

//       todoItem.append(taskWrapper);

//       const taskHeading = this.createElement("div", "taskHeading", title);
//       const taskDescription = this.createElement(
//         "div",
//         "taskDescription",
//         description
//       );

//       taskWrapper.append(taskHeading);
//       taskWrapper.append(taskDescription);

//       return todoItem;
//     },

//     createElement(nodeName, classes, innerContent) {
//       const el = document.createElement(nodeName);

//       if (Array.isArray(classes)) {
//         classes.forEach((singleClassName) => {
//           el.classList.add(singleClassName);
//         });
//       } else {
//         el.classList.add(classes);
//       }

//       if (innerContent) {
//         el.innerHTML = innerContent; // fix this
//       }

//       return el;
//     },
//   };

//   todoList.init("todoForm");
// })();

// (function () {
//   // select everything
// // select the todo-form
// const todoForm = document.querySelector('.todo-form');
// // select the input box
// const todoInput = document.querySelector('.todo-input');
// // select the <ul> with class="todo-items"
// const todoItemsList = document.querySelector('.todo-items');

// // array which stores every todos
// let todos = [];

// // add an eventListener on form, and listen for submit event
// todoForm.addEventListener('submit', function(event) {
//   // prevent the page from reloading when submitting the form
//   event.preventDefault();
//   addTodo(todoInput.value); // call addTodo function with input box current value
// });

// // function to add todo
// function addTodo(item) {
//   // if item is not empty
//   if (item !== '') {
//     // make a todo object, which has id, name, and completed properties
//     const todo = {
//       id: Date.now(),
//       name: item,
//       completed: false
//     };

//     // then add it to todos array
//     todos.push(todo);
//     addToLocalStorage(todos); // then store it in localStorage

//     // finally clear the input box value
//     todoInput.value = '';
//   }
// }

// // function to render given todos to screen
// function renderTodos(todos) {
//   // clear everything inside <ul> with class=todo-items
//   todoItemsList.innerHTML = '';

//   // run through each item inside todos
//   todos.forEach(function(item) {
//     // check if the item is completed
//     const checked = item.completed ? 'checked': null;

//     // make a <li> element and fill it
//     // <li> </li>
//     const li = document.createElement('li');
//     // <li class="item"> </li>
//     li.setAttribute('class', 'item');
//     // <li class="item" data-key="20200708"> </li>
//     li.setAttribute('data-key', item.id);
//     /* <li class="item" data-key="20200708">
//           <input type="checkbox" class="checkbox">
//           Go to Gym
//           <button class="delete-button">X</button>
//         </li> */
//     // if item is completed, then add a class to <li> called 'checked', which will add line-through style
//     if (item.completed === true) {
//       li.classList.add('checked');
//     }

//     li.innerHTML = `
//       <input type="checkbox" class="checkbox" ${checked}>
//       ${item.name}
//       <button class="delete-button">X</button>
//     `;
//     // finally add the <li> to the <ul>
//     todoItemsList.append(li);
//   });

// }

// // function to add todos to local storage
// function addToLocalStorage(todos) {
//   // conver the array to string then store it.
//   localStorage.setItem('todos', JSON.stringify(todos));
//   // render them to screen
//   renderTodos(todos);
// }

// // function helps to get everything from local storage
// function getFromLocalStorage() {
//   const reference = localStorage.getItem('todos');
//   // if reference exists
//   if (reference) {
//     // converts back to array and store it in todos array
//     todos = JSON.parse(reference);
//     renderTodos(todos);
//   }
// }

// // toggle the value to completed and not completed
// function toggle(id) {
//   todos.forEach(function(item) {
//     // use == not ===, because here types are different. One is number and other is string
//     if (item.id == id) {
//       // toggle the value
//       item.completed = !item.completed;
//     }
//   });

//   addToLocalStorage(todos);
// }

// // deletes a todo from todos array, then updates localstorage and renders updated list to screen
// function deleteTodo(id) {
//   // filters out the <li> with the id and updates the todos array
//   todos = todos.filter(function(item) {
//     // use != not !==, because here types are different. One is number and other is string
//     return item.id != id;
//   });

//   // update the localStorage
//   addToLocalStorage(todos);
// }

// // initially get everything from localStorage
// getFromLocalStorage();

// // after that addEventListener <ul> with class=todoItems. Because we need to listen for click event in all delete-button and checkbox
// todoItemsList.addEventListener('click', function(event) {
//   // check if the event is on checkbox
//   if (event.target.type === 'checkbox') {
//     // toggle the state
//     toggle(event.target.parentElement.getAttribute('data-key'));
//   }

//   // check if that is a delete-button
//   if (event.target.classList.contains('delete-button')) {
//     // get id from data-key attribute's value of parent <li> where the delete-button is present
//     deleteTodo(event.target.parentElement.getAttribute('data-key'));
//   }
// });
// })();
