import React, { useEffect, useState, useCallback } from "react";
import '../styles/App.css'; // Assuming App.css is moved to ui/styles/
import { Notebooks, Source } from "../../common/types.ts"; // Removed unused Notebook type

// Placeholder for the messaging hook/utility
// We'll need to implement this to handle communication with the background script
const useMessaging = () => {
    // Simulate sending a message and receiving a response
    const sendMessage = useCallback(async (message: { action: string, payload?: any }): Promise<any> => {
        console.log("UI Sending message:", message);
        // In a real implementation, this would use chrome.runtime.sendMessage
        // and handle the response asynchronously.
        return new Promise((resolve, reject) => {
             if (chrome.runtime?.id) { // Check if running as an extension
                 chrome.runtime.sendMessage(message, (response) => {
                     if (chrome.runtime.lastError) {
                         console.error("sendMessage Error:", chrome.runtime.lastError.message);
                         return reject(chrome.runtime.lastError);
                     }
                     if (response?.status === 'error') {
                         console.error("Background Error:", response.error);
                         return reject(new Error(response.error));
                     }
                     console.log("UI Received response:", response);
                     resolve(response?.data); // Assuming response structure { status, data?, error? }
                 });
             } else {
                 // Fallback for development/testing outside extension context
                 console.warn("chrome.runtime not available. Message not sent.");
                 reject(new Error("Extension context not available."));
             }
        });
    }, []);

    // Placeholder for listening to messages pushed FROM the background
    // In a real implementation, this would use chrome.runtime.onMessage.addListener
    const addMessageListener = useCallback((callback: (message: any) => void) => {
        const listener = (message: any, _sender: chrome.runtime.MessageSender) => { // Prefixed unused sender
            // Optional: Filter messages based on sender or origin if needed
            console.log("UI Received pushed message:", message);
            callback(message);
        };
         if (chrome.runtime?.id) {
            chrome.runtime.onMessage.addListener(listener);
            // Return cleanup function
            return () => chrome.runtime.onMessage.removeListener(listener);
         } else {
             console.warn("chrome.runtime not available. Cannot add listener.");
             return () => {}; // Return no-op cleanup
         }
    }, []);


    return { sendMessage, addMessageListener };
};
// End Placeholder

function Popup() {
    // Setting Initial States
    const [researchMode, setResearchMode] = useState(false);
    const [notebooks, setNotebooks] = useState<Notebooks>({});
    const [currentNotebook, setCurrentNotebook] = useState<string | null>(null);
    const [isCreatingNotebook, setIsCreatingNotebook] = useState(false);
    const [newNotebookName, setNewNotebookName] = useState("");
    const [sources, setSources] = useState<[string, Source][]>([]); // Keep as [id, source] array
    const [isAddingSource, setIsAddingSource] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false); // For syncing sources to NotebookLM
    const [isSyncingNotebooks, setIsSyncingNotebooks] = useState(false); // For syncing notebook list
    const [isLoading, setIsLoading] = useState(true); // Added loading state
    const [error, setError] = useState<string | null>(null); // Added error state

    const { sendMessage, addMessageListener } = useMessaging();

    // Fetch initial data on mount
    useEffect(() => {
        setIsLoading(true);
        sendMessage({ action: 'GET_INITIAL_DATA' })
            .then(data => {
                if (data) {
                    setNotebooks(data.notebooks || {});
                    setCurrentNotebook(data.currentNotebook || null);
                    setResearchMode(data.researchMode || false);
                }
                setError(null);
            })
            .catch(err => {
                console.error("Error fetching initial data:", err);
                setError(`Failed to load initial data: ${err.message}`);
                // Set default states on error?
                setNotebooks({});
                setCurrentNotebook(null);
                setResearchMode(false);
            })
            .finally(() => setIsLoading(false));

        // Setup listener for background updates
        const cleanupListener = addMessageListener((message) => {
            if (message.action === 'STORAGE_UPDATED' && message.payload) {
                 console.log("UI received STORAGE_UPDATED:", message.payload);
                 setNotebooks(message.payload.notebooks || {});
                 setCurrentNotebook(message.payload.currentNotebook || null);
                 setResearchMode(message.payload.researchMode || false);
                 // Maybe clear error if update is successful?
                 // setError(null);
            }
            // Add other message handlers if needed
        });

        return cleanupListener; // Cleanup listener on unmount

    }, [sendMessage, addMessageListener]); // Dependencies for the effect

    // Update sources derived state when notebooks or currentNotebook changes
    useEffect(() => {
        if (currentNotebook && notebooks[currentNotebook]?.sources) {
            const sourceEntries = Object.entries(notebooks[currentNotebook].sources)
                .sort((a, b) => new Date(b[1].added_datetime).getTime() - new Date(a[1].added_datetime).getTime());
            setSources(sourceEntries);
        } else {
            setSources([]);
        }
    }, [notebooks, currentNotebook]);

    // --- Handlers ---

    const handleToggleResearchMode = async () => {
        const newMode = !researchMode;
        // Optimistically update UI state
        setResearchMode(newMode);
        try {
            await sendMessage({ action: 'TOGGLE_RESEARCH_MODE', payload: { enabled: newMode } });
            console.log("Research Mode Toggled successfully via background.");
        } catch (err) {
            console.error("Failed to toggle research mode:", err);
            setError(`Failed to toggle research mode: ${err instanceof Error ? err.message : String(err)}`);
            // Revert optimistic update on error
            setResearchMode(!newMode);
        }
    };

    const handleNotebookChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.currentTarget.value;
        if (value === "create_new") {
            setIsCreatingNotebook(true);
        } else {
            // Optimistically update UI
            setCurrentNotebook(value);
            try {
                await sendMessage({ action: 'SET_CURRENT_NOTEBOOK', payload: { name: value } });
                console.log("Current notebook set successfully via background.");
            } catch (err) {
                 console.error("Failed to set current notebook:", err);
                 setError(`Failed to set notebook: ${err instanceof Error ? err.message : String(err)}`);
                 // Revert optimistic update? Need previous value. Or refetch state.
                 // For simplicity, maybe just show error and let next STORAGE_UPDATED fix it.
            }
        }
    };

    const handleCreateNotebook = async () => {
        const trimmedName = newNotebookName.trim();
        if (trimmedName === '') {
            alert('Please enter a notebook name');
            return;
        }
        if (notebooks[trimmedName]) {
            alert('A notebook with this name already exists');
            return;
        }
        try {
            // No optimistic update here, wait for response as it sets current notebook
            const newNotebookData = await sendMessage({ action: 'CREATE_NOTEBOOK', payload: { name: trimmedName } });
            console.log('Notebook Created:', newNotebookData);
            setNewNotebookName('');
            setIsCreatingNotebook(false);
            // Background should update storage, triggering STORAGE_UPDATED message,
            // which will update notebooks and currentNotebook state.
            // setCurrentNotebook(newNotebookData.name); // Avoid direct state set if relying on push update
        } catch (err) {
            console.error("Failed to create notebook:", err);
            alert(`Error creating notebook: ${err instanceof Error ? err.message : String(err)}`);
            setError(`Failed to create notebook: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    const handleDeleteSource = async (sourceId: string) => {
        if (!currentNotebook) return;
        // Optimistic UI update (remove source from local state)
        setSources(prevSources => prevSources.filter(([id, _]) => id !== sourceId));
        try {
            await sendMessage({ action: 'DELETE_SOURCE', payload: { notebookName: currentNotebook, sourceId } });
            console.log('Source Deleted successfully via background.');
        } catch (err) {
            console.error("Failed to delete source:", err);
            setError(`Failed to delete source ${sourceId}: ${err instanceof Error ? err.message : String(err)}`);
            // Revert optimistic update? Requires refetching or more complex state management.
            // For now, show error. STORAGE_UPDATED should eventually correct the state.
        }
    };

    const handleAddCurrentTab = async () => {
        if (!currentNotebook) {
            alert('Please select a notebook first');
            return;
        }
        setIsAddingSource(true);
        try {
            // Background script needs to query the current tab
            await sendMessage({ action: 'ADD_SOURCE_FROM_CURRENT_TAB' });
            console.log('Add current tab request sent successfully.');
            // Background script handles adding and updates storage.
            // UI will update via STORAGE_UPDATED message.
        } catch (err) {
            console.error("Failed to add current tab:", err);
            alert(`Error adding current tab: ${err instanceof Error ? err.message : String(err)}`);
            setError(`Failed to add current tab: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsAddingSource(false);
        }
    };

    const handleOpenSource = async (url: string) => {
        try {
            await sendMessage({ action: 'OPEN_URL', payload: { url, active: false } });
        } catch (err) {
            console.error("Failed to open URL:", err);
            setError(`Failed to open URL: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    // Sync sources TO NotebookLM
    const handleAddSourcestoNotebookLM = async () => {
        if (!currentNotebook) {
             alert('Please select a notebook first.');
             return;
        }
        const sourcesToAdd = sources.filter(([_, src]) => !src.added_to_notebook && (src.linkType === 'web' || src.linkType === 'youtube'));
        if (sourcesToAdd.length === 0) {
            alert('No new website or YouTube sources to add to NotebookLM.');
            return;
        }

        setIsSyncing(true);
        setError(null);
        try {
            const result = await sendMessage({ action: 'ADD_SOURCES_TO_NOTEBOOKLM', payload: { notebookName: currentNotebook } });
            console.log("Add sources result:", result);
            // Display summary message based on result from background
            const { successCount = 0, skippedCount = 0, failedSources = [] } = result || {};
            let message = `Added ${successCount} sources.`;
            if (skippedCount > 0) message += ` Skipped ${skippedCount} unsupported/already added sources.`;
            if (failedSources.length > 0) message += ` Failed to add ${failedSources.length} sources.`;
            alert(message);
            // State will update via STORAGE_UPDATED message triggered by background marking sources as synced.
        } catch (err) {
            console.error("Failed to add sources to NotebookLM:", err);
            alert(`Error adding sources: ${err instanceof Error ? err.message : String(err)}`);
            setError(`Error adding sources: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsSyncing(false);
        }
    };

     // Sync Notebook LIST from NotebookLM
     const handleSyncNotebookList = async () => {
        setIsSyncingNotebooks(true);
        setError(null);
        try {
            await sendMessage({ action: 'SYNC_NOTEBOOKLM_NOTEBOOKS' });
            alert("Notebook list sync initiated. Check console for details. List will update shortly.");
            // UI updates via STORAGE_UPDATED message from background
        } catch (err) {
            console.error("Failed to sync notebook list:", err);
            alert(`Error syncing notebook list: ${err instanceof Error ? err.message : String(err)}`);
            setError(`Error syncing notebook list: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsSyncingNotebooks(false);
        }
     };


    // --- UI Rendering ---

    const getSourceTypeColor = (linkType: string): string => {
        // Same as before
        switch (linkType?.toLowerCase()) {
            case 'web': return '#4caf50'; // Green
            case 'googleslides': return '#ff9800'; // Orange
            case 'googledocs': return '#2196f3'; // Blue
            case 'youtube': return '#f44336'; // Red
            case 'pdf': return '#607d8b'; // Blue Grey
            default: return '#9e9e9e'; // Grey
        }
    };

    if (isLoading) {
        return <div className="app-container loading">Loading...</div>;
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

             {error && <div className="error-banner">Error: {error}</div>}

            {/* Notebook Selection */}
            <div className="notebook-section">
                <div className="notebook-header">
                    <h2>Notebook</h2>
                     <button
                        onClick={handleSyncNotebookList}
                        disabled={isSyncingNotebooks}
                        className="sync-button"
                        title="Sync notebook list from NotebookLM"
                    >
                        {isSyncingNotebooks ? 'Syncing List...' : 'Sync List'}
                    </button>
                </div>
                {isCreatingNotebook ? (
                    <div className="create-notebook">
                        <input
                            type="text"
                            value={newNotebookName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewNotebookName(e.currentTarget.value)}
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
                        disabled={isSyncingNotebooks} // Disable while syncing list
                    >
                        <option value="" disabled>
                            Select a notebook
                        </option>
                        {Object.keys(notebooks).sort().map((name) => ( // Sort names alphabetically
                            <option key={name} value={name}>
                                {notebooks[name]?.notebookLM_title || name} {/* Display LM title if available */}
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
                            <li key={id} className={`source-item ${source.added_to_notebook ? 'synced' : ''}`}>
                                <div
                                    className="source-info clickable"
                                    onClick={() => handleOpenSource(source.url)}
                                    title={`Click to open in new tab\nType: ${source.linkType}\nAdded: ${new Date(source.added_datetime).toLocaleString()}`}
                                >
                                    <div
                                        className="source-type-badge"
                                        style={{ backgroundColor: getSourceTypeColor(source.linkType) }}
                                    ></div>
                                    <div className="source-content">
                                        <span className="source-title">{source.title}</span>
                                        <span className="source-url">{source.url}</span>
                                    </div>
                                </div>
                                <div className="source-actions">
                                    <span
                                        className="delete-button"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteSource(id); }}
                                        title="Delete source"
                                    > × </span>
                                    {source.added_to_notebook && <span className="sync-status" title="Added to NotebookLM">✓</span>}
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="no-sources">
                            {currentNotebook
                                ? "No sources added yet. Use the button above or the floating '+' button on web pages."
                                : "Please select or create a notebook first."}
                        </li>
                    )}
                </ul>
            </div>

            {/* Version Info */}
            <div className="version-info">
                <span>v1.1.0-refactor</span> {/* Updated version */}
            </div>

            {/* Add to NotebookLM Button */}
            <div className="add-to-notebooklm-section">
                <button
                    onClick={handleAddSourcestoNotebookLM}
                    disabled={isSyncing || !currentNotebook || sources.filter(([_, src]) => !src.added_to_notebook && (src.linkType === 'web' || src.linkType === 'youtube')).length === 0}
                    className="add-button"
                >
                    {isSyncing ? 'Adding to NotebookLM...' : 'Add Sources to NotebookLM'}
                </button>
                <p className="help-text">Adds new website/YouTube links from this notebook to NotebookLM.</p>
            </div>
        </div>
    );
}

export default Popup;