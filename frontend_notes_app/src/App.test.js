import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// Helper for setting up mock localStorage in test env
function mockStorage() {
  const store = {};
  window.localStorage.__proto__.getItem = jest.fn(key => store[key] || null);
  window.localStorage.__proto__.setItem = jest.fn((key, val) => (store[key] = val));
  window.localStorage.__proto__.removeItem = jest.fn(key => delete store[key]);
  window.localStorage.__proto__.clear = jest.fn(() => Object.keys(store).forEach(k => delete store[k]));
}

// PUBLIC_INTERFACE
describe("Notes App UI", () => {
  beforeEach(() => {
    mockStorage();
    window.localStorage.clear();
  });

  it("renders Notes list and Editor area", () => {
    render(<App />);
    expect(screen.getByText(/Notes/i)).toBeInTheDocument();
    expect(screen.getByText(/Select a note/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Add Note/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Search notes/i)).toBeInTheDocument();
  });

  it("can create a note, edit it, and see it in the list", async () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText(/Add Note/i));
    await waitFor(() => expect(screen.getByLabelText(/Note title/i)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/Note title/i), { target: { value: "Test Note" }});
    fireEvent.change(screen.getByLabelText(/Note body/i), { target: { value: "Hello Ocean!" }});
    fireEvent.click(screen.getByLabelText(/Save note/i));
    expect(await screen.findByText(/Note saved/i)).toBeInTheDocument();
    // Should appear in note list
    expect(screen.getByText("Test Note")).toBeInTheDocument();
  });

  it("can edit and persist a note", async () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText(/Add Note/i));
    await waitFor(() => screen.getByLabelText(/Note title/i));
    fireEvent.change(screen.getByLabelText(/Note title/i), { target: { value: "Persistent" }});
    fireEvent.click(screen.getByLabelText(/Save note/i));
    // Simulate app reload (notes should persist)
    window.localStorage.setItem("notes", JSON.stringify([{ id: "1", title: "Persistent", body: "", updated: Date.now() }]));
    render(<App />);
    expect(screen.getByText("Persistent")).toBeInTheDocument();
  });

  it("can delete a note (with confirm)", async () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText(/Add Note/i));
    fireEvent.change(screen.getByLabelText(/Note title/i), { target: { value: "ToDelete" }});
    fireEvent.click(screen.getByLabelText(/Save note/i));
    fireEvent.click(screen.getByLabelText(/Delete note/i));
    await waitFor(() => screen.getByText(/Are you sure/i));
    fireEvent.click(screen.getByText(/^Delete$/));
    expect(await screen.findByText(/Note deleted/i)).toBeInTheDocument();
    expect(screen.queryByText("ToDelete")).not.toBeInTheDocument();
  });

  it("filters notes by title", async () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText(/Add Note/i));
    fireEvent.change(screen.getByLabelText(/Note title/i), { target: { value: "Ocean" }});
    fireEvent.click(screen.getByLabelText(/Save note/i));
    fireEvent.click(screen.getByLabelText(/Add Note/i));
    fireEvent.change(screen.getByLabelText(/Note title/i), { target: { value: "River" }});
    fireEvent.click(screen.getByLabelText(/Save note/i));
    fireEvent.change(screen.getByLabelText(/Search notes/i), { target: { value: "Ocean" }});
    expect(screen.getByText("Ocean")).toBeInTheDocument();
    expect(screen.queryByText("River")).not.toBeInTheDocument();
  });
});
