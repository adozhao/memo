const addBtn = document.getElementById('addBtn')
const list = document.getElementById('list')
const input = document.getElementById('input')

input.oninput = ()=>{
    input.value?addBtn.classList.add('mark') : addBtn.classList.remove('mark')
}

input.onblur = ()=>{
    input.value? addBtn.classList.add('mark') : addBtn.classList.remove('mark')
}

let i18n = {
    text_btn_add: chrome.i18n.getMessage('btn_add'),
    text_btn_finish: chrome.i18n.getMessage('btn_finish'),
    text_input_placeholder: chrome.i18n.getMessage('input_placeholder')
}

let items = []
chrome.storage.sync.get(["items"], value=>{
    if(!value){
        items = []
        return
    }
    else{
        items = value.items || []
    }
    showList()
})

addBtn.innerText = i18n.text_btn_add
input.setAttribute('placeholder', i18n.text_input_placeholder)

addBtn.onclick = ()=>{
    addItem()
}

list.addEventListener('click',(e)=>{
    if(e.target.className === 'btn-delete'){
        delItemByIdx( e.target.dataset.index)
    }
})

input.addEventListener('keyup', e=>{
    if(e.key === 'Enter'){
        addItem()
    }
})

function showList(){
    list.innerHTML = ''
    items.forEach((v, i)=>{
        let li = document.createElement('li')
        li.className = 'item'

        let span = document.createElement('span')
        span.className = 'text'
        span.innerText = v
        li.appendChild(span)
        
        let delBtn = document.createElement('button')
        delBtn.className = 'btn-delete'
        delBtn.innerText = i18n.text_btn_finish
        delBtn.setAttribute('data-index', i)
        
        li.appendChild(delBtn)

        list.appendChild(li)
    })
}

function addItem(){
    let value = input.value
    let hasExist = items.includes(value)
    if(!value || hasExist){
        input.value = ''
        return
    }
    items.unshift(value)
    input.value = ''
    addBtn.classList.remove('mark')
    chrome.storage.sync.set({'items': items}, ()=>{
        showList()
    });
}

function delItemByIdx(idx){
    items.splice(idx, 1)
    chrome.storage.sync.set({'items': items}, ()=>{
        showList()
    });
}

