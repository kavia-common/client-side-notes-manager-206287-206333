import React, { useRef, useState, useEffect } from "react";

// PUBLIC_INTERFACE
function NoteEditor({
  note,
  onChange,
  onDelete,
  onSave,
  busy,
  status,
}) {
  const [edit, setEdit] = useState({ title: note?.title || "", body: note?.body || "" });
  const [dirty, setDirty] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const statusRef = useRef();

  useEffect(() => {
    setEdit({ title: note?.title || "", body: note?.body || "" });
    setDirty(false);
  }, [note?.id]);

  // Debounced autosave after editing changes
  useEffect(() => {
    if (!dirty) return;
    const timeout = setTimeout(() => {
      onSave({ ...note, ...edit });
    }, 750);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [edit]);

  useEffect(() => {
    if (status && statusRef.current) {
      statusRef.current.focus();
    }
  }, [status]);

  function handleInput(e) {
    setEdit({ ...edit, [e.target.name]: e.target.value });
    setDirty(true);
  }

  return note ? (
    <section className="note-editor" aria-label="Edit Note">
      <label htmlFor="note-title-input">Title</label>
      <input
        id="note-title-input"
        className="editor-title"
        name="title"
        autoFocus
        value={edit.title}
        onChange={handleInput}
        autoComplete="off"
        aria-label="Note title"
      />
      <label htmlFor="note-body-input">Body</label>
      <textarea
        id="note-body-input"
        className="editor-body"
        name="body"
        rows={9}
        value={edit.body}
        onChange={handleInput}
        aria-label="Note body"
      />
      <div className="editor-actions">
        <button
          className="save-btn"
          disabled={busy || !dirty}
          onClick={() => {
            onSave({ ...note, ...edit });
            setDirty(false);
          }}
          aria-label="Save note"
          type="button"
        >Save</button>
        <button
          className="delete-btn"
          disabled={busy}
          onClick={() => setShowDelete(true)}
          aria-label="Delete note"
          type="button"
        >Delete</button>
      </div>
      <div
        tabIndex="-1"
        className="status-msg"
        aria-live="polite"
        aria-atomic="true"
        ref={statusRef}
        style={{
          outline: "none",
          marginTop: 6,
          minHeight: 22,
          color: status === "Note saved" ? "#2563EB" : "#EF4444",
          fontWeight: 500,
          transition: "color 0.2s",
        }}
      >
        {status}
      </div>
      {showDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <p>
                Are you sure you want to delete this note?
              </p>
              <div className="modal-actions">
                <button
                  className="delete-btn"
                  onClick={() => {
                    setShowDelete(false);
                    onDelete(note.id);
                  }}
                >
                  Delete
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  ) : (
    <div className="note-editor--empty" aria-label="No note selected">
      <em>Select a note to begin editing</em>
    </div>
  );
}

export default NoteEditor;
