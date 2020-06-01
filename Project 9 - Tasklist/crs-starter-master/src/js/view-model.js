import {Task} from "./task.js";
import {Store} from "./store.js";

/**
 * Get a handle on a footer containing inputs and buttons. Assign relevant click and focus event handlers and validate and control ui behaviour based on required conditions.
 */
export class ViewModel {

    /**
     * @constructor
     */
    constructor() {
        this._clickHandler = this._click.bind(this);
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
        for (const field of this._requiredFields) {
             field.removeEventListener('focusout', this._requiredFieldsFocusHandler);
        }

        for (const button of this._buttons) {
            button.removeEventListener('click', this._clickHandler);
        }

        this._requiredFields = null;
        this._clickHandler = null;
        this._buttons = null;
        this._form = null;

        if(this._task != null) {
            this._task.dispose();
            this._task = null;
        }

        this._taskList = null;

        super.dispose();
    }

    /**
     * Initial setup - Add event listeners
     */
    _setup() {
        const footer = document.querySelector('footer');
        this._form = footer.querySelector('form');
        this._buttons = footer.querySelectorAll('button');
        this._taskList = document.querySelector('#tasks ul');
        this._requiredFields = document.querySelectorAll('#controls input');

        const listClickHandler = this._listClick.bind(this);
        this._taskList.addEventListener('click', listClickHandler);
        
        this._requiredFieldsFocusHandler = this.validate.bind(this);

        for (const button of this._buttons) {
            button.addEventListener('click', this._clickHandler);
        }

        for (const field of this._requiredFields) {
            field.addEventListener('focusout', this._requiredFieldsFocusHandler);
        }
    }

    /**
     * Handle click event
     * @param {*} e 
     */
    _click(e) {
        if (e.target instanceof HTMLButtonElement) {
            e.preventDefault();
        }

        const attr = e.target.getAttribute("id");
        attr && this[`${attr}`](e);
    }

    /**
     * Handle list click event
     * @param {*} e 
     */
    _listClick(e) {
        if(e.target.classList.contains('completed-checkbox')) {
            const overview = e.target.parentElement.nextElementSibling;
            const title = overview.querySelector('h4').innerText;
            const task = this.store.findByTitle(title);
            task.isComplete = e.target.checked;
        }
    }

    /**
     * Render items
     */
    render(items) {
        const fragment = document.createDocumentFragment();
        
        const template = document.querySelector('#task-template');
        
        for (const item of items) {
            const listItem = document.createElement('li');
            const clone = template.content.cloneNode(true);
            const titleElement = clone.querySelector('.overview h4');
            const dateElement = clone.querySelector('.overview span');

            titleElement.innerHTML = item.title;
            dateElement.innerHTML = new Date(item.date).toDateString();

            listItem.appendChild(clone);
            fragment.appendChild(listItem);
        }

        this._taskList.appendChild(fragment);
    }

    /**
     * Handle action of add button 
     */
    add(){
        this.validate();

        if (this._valid.length !== this._requiredFields.length) return;
        
        const title = document.getElementById("title");
        const date = document.getElementById("date");

        this._task = new Task(title.value, date.value);
        this.store.data.push(this._task);
        this.store.datasource.save();

        const fragment = document.createDocumentFragment();
        const item = document.createElement('li');
        const template = document.querySelector('#task-template');
        const clone = template.content.cloneNode(true);

        const titleElement = clone.querySelector('.overview h4');
        const dateElement = clone.querySelector('.overview span');

        titleElement.innerHTML = title.value;
        dateElement.innerHTML = new Date(date.value).toDateString();

        item.appendChild(clone);
        fragment.appendChild(item);
        this._taskList.appendChild(fragment);

        title.value = "";
        date.value = "2020-06-01";
        this.close();
    }

    /**
     * Toggle form visiblity
     */
    toggleForm() {
        this._form.classList.toggle('hidden');

        for (const button of this._buttons) {                

            if(button.getAttribute('id') === "open") {
                button.classList.toggle('hidden');
            }
        }
    }

    /**
    * Handle action of open button 
    */
    open() {
        this.toggleForm();
    }

    /**
     * Handle action of close button
     */
    close() {
        this.toggleForm();
    }

    /**
     * Handle validation logic
     */
    validate() {
        this._valid = [];

        for (const input of this._requiredFields) {
            if(input.value != '') {
                if(input.classList.contains('error')) input.classList.remove('error');
                this._valid.push(input);

                for (const button of this._buttons) {                
                    if(button.getAttribute('id') === "add") button.removeAttribute('disabled');
                }
            }
            else {
                input.classList.add('error');

                for (const button of this._buttons) {                
                    if(button.getAttribute('id') === "add") button.setAttribute('disabled', 'disabled');
                }
            }          
        }
    }
}