import css from './style.css';

// Simple Component
class NoteApp extends HTMLElement{
    constructor(){
        super();

        this.render();
    }

    render(){
        this.innerHTML = `<h2>Notes App</h2>`
    }
}

customElements.define("note-app", NoteApp);

class MyNotes extends HTMLElement{
    constructor(){
        super();

        this.render();
    }

    render(){
        this.innerHTML = `<h2>My Notes</h2>`
    }
}

customElements.define("my-notes", MyNotes);


class FooterUi extends HTMLElement {
    constructor() {
        super();

        this.render()
    }

    render() {
        this.innerHTML = `
        <div class="main-footer">
        Notes App Created by Yosef
        </div>`;
    }
}
customElements.define("footer-ui", FooterUi);

// Constants
const API_ENDPOINT = 'https://notes-api.dicoding.dev/v2/notes';
const NOTE_CONTAINER_ID = 'note-container';

// Function to add a new note
async function addNote(title, body) {
    try {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
    });
    if (response.ok) {
      showData(); // Refresh the note list
    } else {
        console.error(`Error creating note: ${response.status}`);
    }
    } catch (error) {
    console.error('Error creating note:', error);
    }
}

// Function to show all notes
async function showData() {
    const noteContainer = document.getElementById(NOTE_CONTAINER_ID);
    noteContainer.setAttribute('class', 'loader')
    try {
    const response = await fetch(API_ENDPOINT);
    const notes = await response.json();
    const noteContainer = document.getElementById(NOTE_CONTAINER_ID);
    noteContainer.innerHTML = ''; 
    notes.data.forEach((note) => {
        const noteCard = createNoteCard(note);
        noteContainer.appendChild(noteCard);
    });
    noteContainer.setAttribute('class', '')
    } catch (error) {
    console.error(error);
    }
    
}


// Function to create a note card
function createNoteCard(note) {
    const card = document.createElement('div');
    card.innerHTML = `
    <div class="card">
        <h1>${note.title}</h1>
        <p>${note.body}</p>
        <button class="delete-btn" id="${note.id}">delete</button>
    </div>
    `;
    return card;
}

// Function to delete a note
async function deleteNote(id) {
    try {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }) ;
    if (response.ok) {
        window.location.reload();
    } else {
        console.error(`Error deleting note: ${response.status}`);
    }
    } catch (error) {
    console.error(error);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', showData);

const addNoteButton = document.querySelector('button');
addNoteButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const title = document.getElementById('note-title').value;
    const body = document.getElementById('note-body').value;
    addNote(title, body);
});

document.getElementById(NOTE_CONTAINER_ID).addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
    deleteNote(e.target.id);
    }
});
