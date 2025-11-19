/**
 * Simple Modal placeholder; not actively used (inline modal in NoteEditor.js for now).
 * Provided for future modularization.
 */
// PUBLIC_INTERFACE
function Modal({ isOpen, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" role="dialog">
      <div className="modal">
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
