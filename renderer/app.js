const { ipcRenderer } = require("electron");
const items = require('./items');

// DOM Nodes
let showModal = document.getElementById('show-modal');
let closeModal = document.getElementById('close-modal');
let modal = document.getElementById('modal');
let addItem = document.getElementById('add-item');
let itemUrl = document.getElementById('url');
let search = document.getElementById('search');

ipcRenderer.on('menu-show-modal', () => {
    showModal.click();
})

ipcRenderer.on('menu-open-item', () => {
    items.open()
})

ipcRenderer.on('menu-delete-item', () => {
    let selectedItem = items.getSelectedItem();
    items.delete(selectedItem.index);
})

ipcRenderer.on('menu-focus-search', () => {
    search.focus();
})

ipcRenderer.on('menu-open-item-native', () => {
    items.openNative();
})

search.addEventListener('keyup', e => {
    Array.from( document.getElementsByClassName('read-item') ).forEach( item => {
        let hasMatch = item.innerText.toLowerCase().includes(search.value);
        item.style.display = hasMatch ? 'flex' : 'none';
    })
})

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key)
    }
})

// Disable & Enable modal buttons
const toggleModalButtons = () => {
    // Check state
    if(addItem.disabled === true) {
        addItem.disabled = false;
        addItem.style.opacity = 1
        addItem.innerText = "Add Item"
        closeModal.style.display='inline'
    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5
        addItem.innerText = "Adding..."
        closeModal.style.display='none'
    }
}

// Show modal
showModal.addEventListener('click', e => {
    modal.style.display = 'flex'
    itemUrl.focus();
})

// Hide modal
closeModal.addEventListener('click', e => {
    modal.style.display = 'none'
})

// Handle new item
addItem.addEventListener('click', e => {
    if(itemUrl.value) {

        // Send new item url to main processs
        ipcRenderer.send('new-item', itemUrl.value);
        toggleModalButtons()
    }
})

// Listen for keyboard submit
itemUrl.addEventListener('keyup', e => {
    if( e.key === 'Enter' ) {
        addItem.click();
    }
})

// Listen response from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
    items.addItem(newItem, true);
    toggleModalButtons()

    // Hide modal and clear value
    modal.style.display = 'none'
    itemUrl.value = ''
})
