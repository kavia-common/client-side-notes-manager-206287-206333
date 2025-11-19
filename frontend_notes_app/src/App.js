import React, { useState, useEffect } from "react";
import "./App.css";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import {
  getNotes,
  saveNotes,
  upsertNote,
  deleteNote,
} from "./utils/localStorage";

// Color constants for Ocean Professional theme
const OCEAN_THEME = {
  primary: "#2563EB",
  secondary: "#F59E0B",
  success: "#F59E0B",
  error: "#EF4444",
  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
};

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("");
  const [editorStatus, setEditorStatus] = useState("");
  const [busy, setBusy] = useState(false);

  // Apply Ocean theme & color variables and dark toggle
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    // Apply theme color CSS vars (contextual)
    Object.entries(OCEAN_THEME).forEach(([k, v]) => {
      document.documentElement.style.setProperty(`--ocean-${k}`, v);
    });
  }, [theme]);

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  // Keep selected id after deleting: fallback to another note or null
  useEffect(() => {
    if (selectedId && !notes.some(n => n.id === selectedId)) {
      setSelectedId(notes[0]?.id || null);
    }
  }, [notes, selectedId]);

  // Filter notes by title
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(filter.toLowerCase())
  );

  // Get selected note
  const selectedNote = notes.find(n => n.id === selectedId);

  // Add new note (empty)
  function handleAddNote() {
    const fresh = {
      id: String(Date.now()),
      title: "",
      body: "",
      updated: Date.now(),
    };
    let all = upsertNote(fresh);
    setNotes(all);
    setSelectedId(fresh.id);
    setEditorStatus("");
  }

  // When editing/saving note
  function handleSaveNote(updated) {
    setBusy(true);
    let all = upsertNote({
      ...updated,
      updated: Date.now(),
    });
    setNotes(all);
    setEditorStatus("Note saved");
    setTimeout(() => setEditorStatus(""), 1000);
    setBusy(false);
  }

  // When delete
  function handleDeleteNote(id) {
    let all = deleteNote(id);
    setNotes(all);
    setEditorStatus("Note deleted");
    setTimeout(() => setEditorStatus(""), 800);
    if (all.length > 0) {
      setSelectedId(all[0].id);
    } else {
      setSelectedId(null);
    }
  }

  // Keyboard: focus note list and new
  function handleKeyDown(e) {
    if (e.ctrlKey && e.key.toLowerCase() === "n") {
      handleAddNote();
      e.preventDefault();
    }
  }

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="App" tabIndex={-1} onKeyDown={handleKeyDown}>
      <header className="top-header">
        <h1 className="app-title">Notes App</h1>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>
      <main className="main-container">
        <NotesList
          notes={filteredNotes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={handleAddNote}
          filter={filter}
          setFilter={setFilter}
        />
        <NoteEditor
          note={selectedNote}
          onChange={() => {}} // No direct field change callback (handled in editor internals)
          onDelete={handleDeleteNote}
          onSave={handleSaveNote}
          busy={busy}
          status={editorStatus}
        />
      </main>
      <footer className="footer">
        <small>
          Demo app &mdash; all data is stored in your browser
        </small>
      </footer>
    </div>
  );
}

export default App;
