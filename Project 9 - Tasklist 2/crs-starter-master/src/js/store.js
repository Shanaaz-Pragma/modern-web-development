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
        return new Store(key);
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
     * Get new item id
     */
    getNewId(){
        this._id = this._id || 0;
        this._id++;

        return this._id;
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
     * Find item by parameter property
     * @param {*} flag - Eg. id, title 
     */
    findBy(flag, value) {
        return this.data.find(x => x[flag] === value);
    }
}