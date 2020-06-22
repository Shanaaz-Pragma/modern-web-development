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

    /**
     * @constructor
     */
    constructor() {
        this._setup();
        this.store = Store.createStore("MyTasks");
        
        if(this.store.data.length > 0) {
            this.render(this.store.data);
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
        this._formContainer = null;
        this._form = null;

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
        this._formContainer.querySelector('#date').value = this.resetDate;
        this._buttons = this._formContainer.querySelectorAll('button');

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
            const task = this.store.findBy('data-id', id);
            task.isComplete = e.target.checked;
        }
    }

    /**
     * Render items
     */
    render(items) {
        const fragment = document.createDocumentFragment();
        
        for (const item of items) {
            const clone = this._template.content.cloneNode(true);
            clone.querySelector('li').setAttribute('data-id', item['data-id']);
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
    close(e) {
        this.toggle(this._form);
        this.toggle(document.getElementById('open'));
    }

    /**
     * Handle action of submit button 
     */
    submit(){
        this.validate(this._form);

        if (this._valid.length !== this._fields.length) return;

        const fragment = document.createDocumentFragment();
        const clone = this._template.content.cloneNode(true);

        this._task = new Task(title.value, date.value);
        this._task['data-id'] = this.store.getNewId().toString();
        this.store.data.push(this._task);
        this.store.datasource.save();

        clone.querySelector('li').setAttribute('data-id', this._task['data-id']);
        clone.querySelector('.overview h4').innerHTML = this._formContainer.querySelector('#title').value;
        clone.querySelector('.overview div').innerHTML = new Date(document.getElementById("date").value).toDateString();

        fragment.appendChild(clone);
        this._taskList.appendChild(fragment);

        title.value = "";
        date.value = this.resetDate;

        this.close();
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