import { useState, useEffect } from 'react'
import './App.css'

// Type declarations for Chrome API
declare global {
  interface Window {
    chrome: {
      storage: {
        local: {
          get: (keys: string[], callback: (result: any) => void) => void;
          set: (items: object, callback?: () => void) => void;
        };
        onChanged: {
          addListener: (callback: (changes: any, namespace: string) => void) => void;
        };
      };
      runtime: {
        sendMessage: (message: any, callback?: (response: any) => void) => void;
      };
      tabs: {
        query: (queryInfo: {active: boolean, currentWindow: boolean}, 
                callback: (tabs: {id: number, url: string, title: string}[]) => void) => void;
      };
    };
  }
}

// Use the chrome API from the window object
const chrome = window.chrome;

interface Source {
  url: string;
  title: string;
  type: string;
  added_datetime: string;
}

interface NotebookData {
  [sourceId: string]: Source;
}

interface Notebooks {
  [notebookName: string]: NotebookData;
}

function App() {
  const [researchMode, setResearchMode] = useState(false)
  const [notebooks, setNotebooks] = useState<Notebooks>({})
  const [currentNotebook, setCurrentNotebook] = useState<string | null>(null)
  const [isCreatingNotebook, setIsCreatingNotebook] = useState(false)
  const [newNotebookName, setNewNotebookName] = useState('')
  const [sources, setSources] = useState<[string, Source][]>([])
  const [isAddingSource, setIsAddingSource] = useState(false)

  // Load initial data from storage
  useEffect(() => {
    chrome.storage.local.get(['notebooks', 'currentNotebook', 'researchMode'], (result) => {
      if (result.notebooks) {
        setNotebooks(result.notebooks)
      }
      if (result.currentNotebook) {
        setCurrentNotebook(result.currentNotebook)
      }
      if (result.researchMode !== undefined) {
        setResearchMode(result.researchMode)
      }
    })

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes, _namespace) => {
      if (changes.notebooks) {
        setNotebooks(changes.notebooks.newValue)
      }
      if (changes.currentNotebook) {
        setCurrentNotebook(changes.currentNotebook.newValue)
      }
      if (changes.researchMode) {
        setResearchMode(changes.researchMode.newValue)
      }
    })
  }, [])

  // Update sources when notebooks or current notebook changes
  useEffect(() => {
    if (currentNotebook && notebooks[currentNotebook]) {
      // Convert object to array of [id, source] pairs and sort by date (newest first)
      const sourceEntries = Object.entries(notebooks[currentNotebook])
        .sort((a, b) => {
          return new Date(b[1].added_datetime).getTime() - new Date(a[1].added_datetime).getTime()
        })
      setSources(sourceEntries)
    } else {
      setSources([])
    }
  }, [notebooks, currentNotebook])

  // Toggle research mode
  const handleToggleResearchMode = () => {
    const newMode = !researchMode
    setResearchMode(newMode)
    chrome.runtime.sendMessage(
      { action: 'TOGGLE_RESEARCH_MODE', enabled: newMode },
      (response) => {
        console.log('Research Mode Toggled:', response)
      }
    )
  }

  // Handle notebook selection
  const handleNotebookChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    
    if (value === 'create_new') {
      setIsCreatingNotebook(true)
    } else {
      chrome.runtime.sendMessage(
        { action: 'SET_CURRENT_NOTEBOOK', name: value },
        (response) => {
          console.log('Current Notebook Set:', response)
          setCurrentNotebook(value)
        }
      )
    }
  }

  // Create a new notebook
  const handleCreateNotebook = () => {
    if (newNotebookName.trim() === '') {
      alert('Please enter a notebook name')
      return
    }

    chrome.runtime.sendMessage(
      { action: 'CREATE_NOTEBOOK', name: newNotebookName.trim() },
      (response) => {
        if (response.status === 'success') {
          console.log('Notebook Created:', response)
          setNewNotebookName('')
          setIsCreatingNotebook(false)
          setCurrentNotebook(response.data.name)
        } else {
          alert(`Error: ${response.error}`)
        }
      }
    )
  }

  // Delete a source
  const handleDeleteSource = (sourceId: string) => {
    if (!currentNotebook) return

    chrome.runtime.sendMessage(
      { action: 'DELETE_SOURCE', notebookName: currentNotebook, sourceId },
      (response) => {
        console.log('Source Deleted:', response)
      }
    )
  }

  // Add current tab as source
  const handleAddCurrentTab = () => {
    if (!currentNotebook) {
      alert('Please select a notebook first');
      return;
    }

    setIsAddingSource(true);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        setIsAddingSource(false);
        alert('No active tab found');
        return;
      }

      const currentTab = tabs[0];
      
      chrome.runtime.sendMessage(
        {
          action: 'ADD_SOURCE',
          url: currentTab.url,
          title: currentTab.title,
          type: 'web',
          datetime: new Date().toISOString()
        },
        (response) => {
          setIsAddingSource(false);
          if (response.status === 'success') {
            console.log('Source Added:', response);
          } else {
            alert(`Error: ${response.error}`);
          }
        }
      );
    });
  }

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="logo-container">
          <img src="/icons/athena48.ico" alt="Athena Logo" className="logo" />
          <h1>ATHENA</h1>
        </div>
        <div className="toggle-container">
          <span>Research Mode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={researchMode}
              onChange={handleToggleResearchMode}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      {/* Notebook Selection */}
      <div className="notebook-section">
        <h2>Notebook</h2>
        {isCreatingNotebook ? (
          <div className="create-notebook">
            <input
              type="text"
              value={newNotebookName}
              onChange={(e) => setNewNotebookName(e.target.value)}
              placeholder="Enter notebook name"
            />
            <div className="button-group">
              <button onClick={handleCreateNotebook}>Create</button>
              <button onClick={() => setIsCreatingNotebook(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <select
            value={currentNotebook || ''}
            onChange={handleNotebookChange}
            className="notebook-select"
          >
            <option value="" disabled>
              Select an option
            </option>
            {Object.keys(notebooks).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
            <option value="create_new">Create New Notebook</option>
          </select>
        )}
      </div>

      {/* Add Current Tab Button */}
      <div className="add-source-section">
        <button 
          className="add-current-tab-button" 
          onClick={handleAddCurrentTab}
          disabled={!currentNotebook || isAddingSource}
        >
          {isAddingSource ? 'Adding...' : '+ Add Current Tab to Notebook'}
        </button>
      </div>

      {/* Included Sources */}
      <div className="sources-section">
        <h2>
          Included Sources
          <span className="sources-count">{sources.length > 0 ? `(${sources.length})` : ''}</span>
        </h2>
        <ul className="source-list">
          {sources.length > 0 ? (
            sources.map(([id, source]) => (
              <li key={id} className="source-item">
                <div className="source-info">
                  <span className="source-title">{source.title}</span>
                  <span className="source-url">{source.url}</span>
                </div>
                <div className="source-actions">
                  <span
                    className="delete-button"
                    onClick={() => handleDeleteSource(id)}
                  >
                    ×
                  </span>
                  <span className="checkmark">✓</span>
                </div>
              </li>
            ))
          ) : (
            <li className="no-sources">
              {currentNotebook
                ? "No sources added yet. Click 'Add Current Tab to Notebook' to add sources."
                : "Please select or create a notebook first."}
            </li>
          )}
        </ul>
      </div>

      {/* Version Info */}
      <div className="version-info">
        <span>v1.0.0-beta.45</span>
      </div>
    </div>
  )
}

export default App
