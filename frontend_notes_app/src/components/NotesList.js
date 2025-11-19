import React from "react";

// PUBLIC_INTERFACE
function NotesList({
  notes,
  selectedId,
  onSelect,
  onAdd,
  filter,
  setFilter,
}) {
  return (
    <aside className="notes-list" aria-label="Notes List">
      <div className="notes-list-header">
        <h2 className="notes-title" style={{ margin: 0 }}>Notes</h2>
        <button
          className="add-btn"
          onClick={onAdd}
          aria-label="Add Note"
          type="button"
        >
          ＋ Add Note
        </button>
      </div>
      <input
        aria-label="Search notes by title"
        className="search-input"
        type="search"
        placeholder="Search notes..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <ul className="notes-list-ul">
        {notes.length === 0 && (
          <li className="empty">No notes found.</li>
        )}
        {notes.map(note => (
          <li
            className={
              "note-item" +
              (note.id === selectedId ? " selected" : "")
            }
            tabIndex={0}
            role="button"
            aria-label={
              note.title
                ? `Edit note titled ${note.title}`
                : "Edit untitled note"
            }
            aria-current={note.id === selectedId}
            key={note.id}
            onClick={() => onSelect(note.id)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") onSelect(note.id);
            }}
          >
            <div className="note-title">
              {note.title ? note.title : "<Untitled>"}
            </div>
            <div className="note-updated">
              {new Date(note.updated).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default NotesList;
