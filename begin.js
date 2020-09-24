//init note db

const db_request = indexedDB.open("Note_DB")
db_request.onupgradeneeded = (event) => {
    const note_db = event.target.result
    console.log(note_db);
    let note_store = note_db.createObjectStore("Note_Store", { keyPath: "id", autoIncrement: true });
    note_store.createIndex("id", "id")
    note_store.createIndex("note", "note")
}

listNote()

function listNote() {
    //open request
    let open_request = indexedDB.open("Note_DB")

    //database
    open_request.onsuccess = (event) => {
        let note_db = event.target.result;

        //transaction
        let tx = note_db.transaction("Note_Store", "readonly")

        //objectstore
        let note_store = tx.objectStore("Note_Store")

        //get request
        let get_request = note_store.getAll()
        get_request.onsuccess = (event) => {
            let notes = event.target.result;
            //show on the page

            let note_list = document.querySelector("#note_list")
            // console.log(note_list);

            let template = ``
            notes.forEach(note => {
                template += `
                <div class="note_item">
                    <div class="del_btn_div">
                        <button class="del_btn" data-id="${note.id}"></button>
                    </div>
                    <div>
                        <textarea class="note" data-id="${note.id}">${note.note}</textarea>
                    </div>
                </div>
                `
            });

            note_list.innerHTML = template;

            //Add click event listener on delete button
            const del_btn_list = document.querySelectorAll(".del_btn")

            del_btn_list.forEach(element => {
                //console.log(element);
                element.addEventListener("click", deleteNote)
            });

            //Add onchange event listener on note
            const note_text_list = document.querySelectorAll(".note")
            note_text_list.forEach(element => {
                //console.log(element);
                element.addEventListener("change", updateNote)
            })

        }
    }
}


//addNote
function addNote() {
    const db_request = indexedDB.open("Note_DB")
    db_request.onsuccess = (event) => {
        //noteDB
        let note_db = event.target.result;

        //Transaction
        let tx = note_db.transaction("Note_Store", "readwrite");

        //Note_Store
        let note_store = tx.objectStore("Note_Store")

        //Get inputbox data
        let note_text = document.querySelector("#note_text")

        //JSON
        let note = {
            "note": note_text.value
        }

        //Add
        note_store.add(note)

        listNote()
    }
}

//delete
function deleteNote(event) {

    const del_btn = event.target

    let note_id = del_btn.dataset.id
    console.log(note_id);
    //open db request
    let open_request = indexedDB.open("Note_DB")
    //onsuccess 
    open_request.onsuccess = (event) => {
        //NoteDB
        let note_db = event.target.result
        //Transaction
        let tx = note_db.transaction("Note_Store", "readwrite")
        //ObjectStore
        let note_store = tx.objectStore("Note_Store")
        //Delete

        note_store.delete(parseInt(note_id))
        //refresh note list
        listNote()

    }
}

//updateNote

function updateNote(event) {

    const note_id = event.target.dataset.id
    const note_value = event.target.value

    //open db request
    let open_request = indexedDB.open("Note_DB")
    //onsuccess
    open_request.onsuccess = (event) => {
        //noteDB
        let note_db = event.target.result

        //transaction
        let tx = note_db.transaction("Note_Store", "readwrite")

        //objectstore
        let note_store = tx.objectStore("Note_Store")

        //note JSON
        let note = {
            "id": parseInt(note_id),
            "note": note_value,
        }
        console.log(note);

        //update
        note_store.put(note)
    }
}

