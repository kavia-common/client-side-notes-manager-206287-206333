/**
 * Utility functions for persisting notes to localStorage with basic CRUD.
 * Note object: { id: string, title: string, body: string, updated: number }
 */

// PUBLIC_INTERFACE
export function getNotes() {
  /** Returns array of all notes from localStorage (latest first) */
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  // Sort latest first
  return notes.sort((a, b) => b.updated - a.updated);
}

// PUBLIC_INTERFACE
export function saveNotes(notes) {
  /** Save all notes to localStorage */
  localStorage.setItem('notes', JSON.stringify(notes));
}

// PUBLIC_INTERFACE
export function upsertNote(note) {
  /** Add (if no id) or update note; returns updated notes array */
  let notes = getNotes();
  const i = notes.findIndex(n => n.id === note.id);
  if (i > -1) {
    notes[i] = { ...notes[i], ...note, updated: Date.now() };
  } else {
    notes.unshift({
      ...note,
      id: note.id || String(Date.now()),
      updated: Date.now(),
    });
  }
  saveNotes(notes);
  return notes;
}

// PUBLIC_INTERFACE
export function deleteNote(id) {
  /** Delete note by id; returns updated notes array */
  let notes = getNotes().filter(n => n.id !== id);
  saveNotes(notes);
  return notes;
}
