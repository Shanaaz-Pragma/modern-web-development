import {ViewModel} from "./src/js/view-model.js";

const viewModel = new ViewModel();

window.addEventListener("unload", () => {
    viewModel.dispose();
}, { once: true });

