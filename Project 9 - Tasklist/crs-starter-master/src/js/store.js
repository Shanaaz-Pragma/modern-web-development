import { DataSource } from "./datasource.js";
/**
 * This class serves as a data store. It reads and writes data to and from localstorage. It instanciates a datasource.
 */
export class Store {

    get key() {
        return this._key;
    }

    get data() {
        return this._data || [];       
    }

    set data(newValue) {
        this._data = newValue;
    }

    static createStore(key) {
        const store = new Store(key);
        return store;
    }

    constructor(key){
        this._key = key;
        this.datasource = new DataSource();
        this.datasource.store = this;
    }

    /**
     * Dispose memory
     */
    dispose(){
        this._key = null;
        this.data = null;

        this.datasource.dispose();
        this.datasource = null;
    }

    /**
     * Read data from local storage
     */
    readData() {
        if (window.localStorage.getItem(this["key"]) != null) {
            this.data = JSON.parse(window.localStorage.getItem(this["key"]));
        }
        
        return this.data;
    }

    /**
     * Save data to local storage
     * @param {*} data 
     */
    saveData(data) {
        if (window.localStorage.getItem(this.key === null)) {
            window.localStorage.setItem(this.key, JSON.stringify( [] ));
        }
        window.localStorage.setItem(this.key, JSON.stringify(data));
    }
    
    /**
     * Get item by title
     * @param {*} title 
     */
    findByTitle(title) {
        return this._data.find(x => x.title === title);
    }
}