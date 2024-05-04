
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
    // const noteContainer = document.getElementById(NOTE_CONTAINER_ID);
    // noteContainer.setAttribute('class', 'loader')
    try {
    const response = await fetch(API_ENDPOINT);
    const notes = await response.json();
    const noteContainer = document.getElementById(NOTE_CONTAINER_ID);
    noteContainer.innerHTML = ''; 
    notes.data.forEach((note) => {
        const noteCard = createNoteCard(note);
        noteContainer.appendChild(noteCard);
    });
    } catch (error) {
    console.error(error);
    }
    // noteContainer.setAttribute('class', '')
}


// Function to create a note card
function createNoteCard(note) {
    const card = document.createElement('div');
    card.innerHTML = `
    <div>
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