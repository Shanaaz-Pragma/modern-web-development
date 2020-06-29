import {Task} from "./task.js";
import {Store} from "./store.js";

/**
 * Get a handle on a footer containing inputs and buttons. Assign relevant click and focus event handlers and validate and control ui behaviour based on required conditions.
 */
export class ViewModel {

    get resetDate(){
        const dateNow = new Date(Date.now());
        const day = "01";
        let month = dateNow.getMonth();
        month++;
        const year = dateNow.getFullYear();

        return `${year}-0${month}-${day}`;
    }

    get filterDate(){
        const dateNow = new Date(Date.now());
        let day = dateNow.getDate();
        day = day < 10 ? `0${day}` : day;
        let month = dateNow.getMonth();
        month++;
        const year = dateNow.getFullYear();

        return `${year}-0${month}-${day}`;
    }

    /**
     * @constructor
     */
    constructor() {
        this._setup();
        this.store = Store.createStore("MyTasks");
        
        if(this.store.data.length > 0) {
            this.render();
        }
    }

    /**
     * Dispose memory
     */
    dispose() {
        document.getElementById('app').removeEventListener('click', this._clickHandler);
        this._clickHandler = null;

        this._template = null;
        this._fields = null;
        this._buttons = null;
        this.title = null;
        this.date = null;
        this._form = null;
        this._formContainer = null;

        if(this._task != null) {
            this._task.dispose();
            this._task = null;
        }

        this._taskList = null;

        super.dispose();
    }

    /**
     * Initial setup - Some dom queries and adding event listeners
     */
    _setup() {
        this._taskList = document.querySelector('#tasks');
        this._template = document.querySelector('#task-template');
        this._formContainer = document.querySelector('footer');
        this._form = this._formContainer.querySelector('form');
        this._buttons = this._formContainer.querySelectorAll('button');
        this.title = this._formContainer.querySelector('#title');
        this.date = this._formContainer.querySelector('#date');
        this.date.value = this.resetDate;

        this._clickHandler = this._click.bind(this);
        document.getElementById('app').addEventListener('click', this._clickHandler);
    }

    /**
     * Handle click event
     * @param {*} e 
     */
    _click(e) {
        if (e.target instanceof HTMLButtonElement) {
            this[`${e.target.getAttribute("id")}`](e);
            e.preventDefault();
        }

        if(e.target.type === "checkbox") {
            const id = e.target.parentElement.getAttribute('data-id');
            const task = this.store.findBy('id', id);
            task.isComplete = e.target.checked;
        }
    }

    /**
     * Render existing items
     */
    render() {
        const fragment = document.createDocumentFragment();
        const items = this.filter == null ? this.store.data : this.store.filterBy('date', this.filterDate);
        
        for (const item of items) {
            const clone = this._template.content.cloneNode(true);
            clone.querySelector('li').setAttribute('data-id', item['id']);
            clone.querySelector('.overview h4').innerHTML = item.title;
            clone.querySelector('.overview div').innerHTML = new Date(item.date).toDateString();

            fragment.appendChild(clone);
        }

        this._taskList.appendChild(fragment);
    }

    /**
     * Toggle visiblity of an element
     * @param {*} element - HTML Element
     */
    toggle(element) {
        element.classList.toggle('hidden');
    }

    /**
     * Handle action of menu button
     * @param {*} e 
     */
    menu(e) {
        this.toggle(document.querySelector(`#${e.target.getAttribute("id")}-list`));
    }

    toggleFilter(e) {
        const text = e.target.innerHTML === "Today" ? "All" : "Today";
        e.target.innerHTML = text;
        this.filter = this.filter != null ? null : text.toLowerCase();

        this._taskList.innerHTML = "";
        this.render();
    }

    /**
    * Handle action of open button 
    */
    open(e) {
        this.toggle(this._form);
        this.toggle(e.target);
    }

    /**
     * Handle action of close button
     */
    close() {
        this.toggle(this._form);
        this.toggle(document.getElementById('open'));

        this.title.value = "";
        this.date.value = this.resetDate;
    }

    /**
     * Handle action of submit button 
     */
    submit() {
        this.validate(this._form);

        if (this._valid.length !== this._fields.length) return;

        this.title.value = this._formContainer.querySelector('#title').value;
        this.date.value = this._formContainer.querySelector('#date').value;
        
        this.createTask();
        this.createFragment();
        this.close();
    }

    /**
     * Create a task
     */
    createTask() {
        this._task = new Task(this.title.value, this.date.value);
        this._task.id = this.store.getNewId().toString();
        this.store.data.push(this._task);
        this.store.datasource.save();
    }

    /**
     * Create a fragment
     */
    createFragment() {

        if(this.filter != null) {
            if(this._task['date'] !== this.filterDate) return;
        }

        const clone = this._template.content.cloneNode(true);
        const fragment = document.createDocumentFragment();

        clone.querySelector('li').setAttribute('data-id', this._task['id']);
        clone.querySelector('.overview h4').innerHTML = this.title.value;
        clone.querySelector('.overview div').innerHTML = new Date(this.date.value).toDateString();

        fragment.appendChild(clone);
        this._taskList.appendChild(fragment);
    }

    /**
     * Handle validation logic on form
     */
    validate(form) {
        this._valid = [];
        this._fields = form.querySelectorAll('input');
        for(const field of this._fields){
            if(field.validity.valid === true) {
                this._valid.push(field);                
            }
        }
    }
}