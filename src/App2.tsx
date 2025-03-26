import { useEffect, useState } from "react";
import "./App.css";
import { NotebookLMService } from "./services/notebookLM/basicService";

/// <reference types="chrome"/>

interface Source {
    url: string;
    title: string;
    linkType: string;
    added_datetime: string;
    added_to_notebook: boolean;
}

interface Sources {
    [sourceId: string]: Source;
}

interface NotebookData {
    created_datetime: string;
    last_updated_datetime: string;
    last_sync_datetime: string | null;
    notebookLM_id: string | null;
    notebookLM_url: string | null;
    notebookLM_title: string | null;
    sources: Sources;
}

interface Notebooks {
    [notebookName: string]: NotebookData;
}

function App() {
    // Setting Initial States
    const [researchMode, setResearchMode] = useState(false);
    const [notebooks, setNotebooks] = useState<Notebooks>({});
    const [currentNotebook, setCurrentNotebook] = useState<string | null>(null);
    const [isCreatingNotebook, setIsCreatingNotebook] = useState(false);
    const [newNotebookName, setNewNotebookName] = useState("");
    const [sources, setSources] = useState<[string, Source][]>([]);
    const [isAddingSource, setIsAddingSource] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const notebookService = new NotebookLMService();

    // This function is used to get the notebooks, current notebook, and research mode from the storage
    useEffect(() => {
        chrome.storage.local.get([
            "notebooks",
            "currentNotebook",
            "researchMode",
        ], (result) => {
            if (result.notebooks) {
                setNotebooks(result.notebooks);
            }
            if (result.currentNotebook) {
                setCurrentNotebook(result.currentNotebook);
            }
            if (result.researchMode !== undefined) {
                setResearchMode(result.researchMode);
            }
        });
        // Listen for Storage Changes
        chrome.storage.onChanged.addListener((changes, _namespace) => {
            if (changes.notebooks) {
                setNotebooks(changes.notebooks.newValue);
            }
            if (changes.currentNotebook) {
                setCurrentNotebook(changes.currentNotebook.newValue);
            }
            if (changes.researchMode) {
                setResearchMode(changes.researchMode.newValue);
            }
        });
    }, []);

    // This function is used to update the sources when the notebooks or current notebook changes
    useEffect(() => {
        if (currentNotebook && notebooks[currentNotebook]) {
            // Convert object to array of [id, source] pairs and sort by date (newest first)
            const sourceEntries = Object.entries(
                notebooks[currentNotebook].sources,
            )
                .sort((a, b) => {
                    return new Date(b[1].added_datetime).getTime() -
                        new Date(a[1].added_datetime).getTime();
                });
            setSources(sourceEntries);
        } else {
            setSources([]);
        }
    }, [notebooks, currentNotebook]);

    // This function is used to toggle the research mode
    const handleToggleResearchMode = () => {
        const newMode = !researchMode;
        setResearchMode(newMode);
        chrome.storage.local.set({ researchMode: newMode });
        chrome.runtime.sendMessage({
            action: "TOGGLE_RESEARCH_MODE",
            enabled: newMode,
        }, (response) => {
            console.log("Research Mode Toggled:", response);
        });
    };

    // This function is used to handle the notebook change
    const handleNotebookChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const value = event.target.value;

        if (value === "create_new") {
            setIsCreatingNotebook(true);
        } else {
            chrome.runtime.sendMessage({
                action: "SET_CURRENT_NOTEBOOK",
                name: value,
            }, (response) => {
                console.log("Current Notebook Set:", response);
                setCurrentNotebook(value);
            });
        }
    };

    // This function is used to create a new notebook
    const handleCreateNotebook = () => {
        if (newNotebookName.trim() === '') {
            alert('Please enter a notebook name')
            return
        }
        // check if new notebook name already exists
        if (notebooks[newNotebookName.trim()]) {
            alert('A notebook with this name already exists')
            return
        }
        chrome.runtime.sendMessage({ action: 'CREATE_NOTEBOOK', name: newNotebookName.trim() }, (response) => {
            if (response.status === 'success') {
                console.log('Notebook Created:', response)
                setNewNotebookName('')
                setIsCreatingNotebook(false)
                setCurrentNotebook(response.data.name)
            } else {
                alert(`Error: ${response.error}`)
            }
        })
    }

    // This function is used to handle the delete source
    const handleDeleteSource = (sourceId: string) => {
        if (!currentNotebook) return

        chrome.runtime.sendMessage({ action: 'DELETE_SOURCE', notebookName: currentNotebook, sourceId }, (response) => {
            console.log('Source Deleted:', response)
        })
    }

    // This function is used to add the current tab as a source
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
            if (!currentTab.url) {
                setIsAddingSource(false);
                alert('No URL found for current tab');
                return;
            }

            const url = currentTab.url.toLowerCase(); // Convert URL to lowercase for easier comparison

            // Determine the type of link
            let linkType = 'web'; // Default to 'web'
            if (url.includes('docs.google.com/document')) {
                linkType = 'googledocs';
            } else if (url.includes('docs.google.com/presentation') || url.includes('slides.google.com')) {
                linkType = 'googleslides';
            } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
                linkType = 'youtube';
            } else if (url.endsWith('.pdf')) {
                linkType = 'pdf';
            }

            chrome.runtime.sendMessage({
                action: 'ADD_SOURCE',
                url: currentTab.url,
                title: currentTab.title,
                type: linkType,
                datetime: new Date().toISOString(),
                added_to_notebook: false
            }, (response) => {
                setIsAddingSource(false);
                if (response.status === 'success') {
                    console.log('Source Added:', response);
                } else {
                    alert(`Error: ${response.error}`);
                }
            });
        });
    }
    // This function handles opening a source URL in a new tab
    const handleOpenSource = (url: string) => {
        chrome.tabs.create({ url, active: false });
    }

    // Get source type badge color
    const getSourceTypeColor = (linkType: string): string => {
        switch (linkType) {
            case 'web':
                return 'green';
            case 'googleslides':
                return 'orange';
            case 'googledocs':
                return 'blue';
            case 'youtube':
                return 'red';
            case 'pdf':
                return 'black';
            default:
                return 'gray';
        }
    };

    // This function is used to sync the current notebook to NotebookLM
    const handleAddSourcestoNotebookLM = async () => {
        if (sources.length === 0) {
            alert('No sources to add. Please add sources to your notebook first.');
            return;
        }

        try {
            setIsSyncing(true);
            
            // Tell the user how many sources we're going to add
            const totalSources = sources.length;
            
            // Track successful, skipped, and failed sources
            let successCount = 0;
            let skippedCount = 0;
            let alreadyAddedCount = 0;
            let failedSources: string[] = [];
            
            // Add each source one by one
            for (let i = 0; i < sources.length; i++) {
                const [sourceId, source] = sources[i];
                
                try {
                    // Skip sources that have already been added to NotebookLM
                    if (source.added_to_notebook) {
                        console.log(`Skipping already added source (${i+1}/${totalSources}):`, source.url);
                        alreadyAddedCount++;
                        continue;
                    }
                    
                    // Check the type of source
                    const linkType = source.linkType.toLowerCase();
                    
                    // Skip certain types for now (they will be implemented later)
                    if (linkType === 'googledocs' || linkType === 'googleslides' || linkType === 'pdf') {
                        console.log(`Skipping unsupported link type ${linkType} (${i+1}/${totalSources}):`, source.url);
                        skippedCount++;
                        continue;
                    }
                    
                    // Handle websites and YouTube videos
                    if (linkType === 'web' || linkType === 'youtube') {
                        await notebookService.addSource({
                            url: source.url,
                            title: source.title
                        });
                        
                        // Update the source to mark it as added to NotebookLM
                        chrome.runtime.sendMessage(
                            { 
                                action: 'UPDATE_SOURCE_SYNC_STATUS', 
                                notebookName: currentNotebook, 
                                sourceId: sourceId,
                                added_to_notebook: true
                            },
                            (response) => {
                                console.log('Source sync status updated:', response);
                            }
                        );
                        
                        successCount++;
                        console.log(`Added source ${i+1}/${totalSources} to NotebookLM:`, source.url);
                        
                        // Small delay between sources to avoid overwhelming NotebookLM
                        if (i < sources.length - 1) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                } catch (error) {
                    console.error(`Failed to add source ${i+1}/${totalSources}:`, source.url, error);
                    failedSources.push(source.url);
                }
            }
            
            // Show a completion message
            if (alreadyAddedCount > 0 && skippedCount > 0) {
                alert(`Added ${successCount} sources to NotebookLM. Skipped ${skippedCount} unsupported sources and ${alreadyAddedCount} already added sources. ${failedSources.length} sources failed.`);
            } else if (alreadyAddedCount > 0) {
                alert(`Added ${successCount} sources to NotebookLM. Skipped ${alreadyAddedCount} already added sources. ${failedSources.length} sources failed.`);
            } else if (skippedCount > 0) {
                alert(`Added ${successCount} sources to NotebookLM. Skipped ${skippedCount} unsupported sources. ${failedSources.length} sources failed.`);
            } else if (failedSources.length === 0) {
                alert(`Successfully added all ${successCount} sources to NotebookLM!`);
            } else {
                alert(`Added ${successCount} out of ${totalSources} sources to NotebookLM. ${failedSources.length} sources failed.`);
            }
        } catch (error) {
            console.error("Failed to add sources:", error);
            alert("Failed to add sources to NotebookLM. See console for details.");
        } finally {
            setIsSyncing(false);
        }
    };

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
                <div className="notebook-header">
                    <h2>Notebook</h2>
                </div>
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
                            Select a notebook
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
                                <div 
                                    className="source-info clickable"
                                    onClick={() => handleOpenSource(source.url)}
                                    title="Click to open in new tab"
                                >
                                    <div 
                                        className="source-type-badge" 
                                        style={{ backgroundColor: getSourceTypeColor(source.linkType) }}
                                        title={`Type: ${source.linkType}`}
                                    ></div>
                                    <div className="source-content">
                                        <span className="source-title">{source.title}</span>
                                        <span className="source-url">{source.url}</span>
                                    </div>
                                </div>
                                <div className="source-actions">
                                    <span
                                        className="delete-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteSource(id);
                                        }}
                                    >
                                        ×
                                    </span>
                                    {source.added_to_notebook && <span className="sync-status">✓</span>}
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
                <span>v1.0.0-beta.46</span>
            </div>

            {/* Add to NotebookLM Button */}
            <div className="add-to-notebooklm-section">
                <button 
                    onClick={handleAddSourcestoNotebookLM}
                    disabled={isSyncing || sources.length === 0}
                    className="add-button"
                >
                    {isSyncing ? 'Adding to NotebookLM...' : 'Add Sources to NotebookLM'}
                </button>
                <p className="help-text">Adds website and YouTube links from your notebook to NotebookLM (skips already added sources)</p>
            </div>
        </div>
    );
}

export default App;
