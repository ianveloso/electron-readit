const fs = require('fs');

let items = document.getElementById('items');

let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString()
})

exports.select = e => {
    document.getElementsByClassName('read-item selected')[0].classList.remove('selected');

    e.currentTarget.classList.add('selected');
}

exports.changeSelection = direction => {
    let currentItem = document.getElementsByClassName('read-item selected')[0];

    if(direction === 'ArrowUp' && currentItem.previousElementSibling) {
        currentItem.classList.remove('selected')
        currentItem.previousElementSibling.classList.add('selected');
    } else if (direction === 'ArrowDown' && currentItem.nextElementSibling) {
        currentItem.classList.remove('selected')
        currentItem.nextElementSibling.classList.add('selected');
    }
};

exports.open = () => {
    if( !this.storage.length ) return;

    let selectedItem = document.getElementsByClassName('read-item selected')[0];

    let contentURL = selectedItem.dataset.url;

    console.log(`opening item contentURL: ${contentURL}`);
    let readerWin = window.open(contentURL, '', `
        maxWidth=2000,
        maxHeight=2000,
        width=1200,
        height=800,
        backgroundColor=#DEDEDE,
        nodeIntegration=0,
        contextIsolation=1,
    `)

    readerWin.eval(readerJS);
}

exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage));
}

exports.addItem = (item, isNew = false) => {
    let itemNode = document.createElement('div');

    itemNode.setAttribute('class', 'read-item');

    itemNode.setAttribute('data-url', item.url);

    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    items.appendChild(itemNode);

    itemNode.addEventListener('click', this.select);

    itemNode.addEventListener('dblclick', this.open);

    // Pre-select an item when app loads
    if(document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected');
    }

    if(isNew) {
        this.storage.push(item);
        this.save();
    }
}

this.storage.forEach(item => {
    this.addItem(item);
});
