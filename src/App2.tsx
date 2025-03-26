import { useEffect, useState } from "react";
import "./App.css";
import { NotebookLMService } from "./services/notebookLM/basicService";

/// <reference types="chrome"/>

interface Source {
    url: string;
    title: string;
    type: string;
    added_datetime: string;
    added_to_notebook: boolean;
}

interface Sources {
    [sourceId: string]: Source;
}

interface NotebookData {
    created_datetime: string;
    last_updated_datetime: string;
    last_sync_datetime: string;
    notebookLM_id: string;
    notebookLM_url: string;
    notebookLM_title: string;
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
        setResearchMode(!researchMode);
        chrome.storage.local.set({ researchMode: !researchMode });
        chrome.runtime.sendMessage({
            action: "TOGGLE_RESEARCH_MODE",
            enabled: !researchMode,
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
            const url = currentTab.url.toLowerCase(); // Convert URL to lowercase for easier comparison

            // Determine the type of link
            let linkType = 'web'; // Default to 'web'
            const isGoogleDocs = url.includes('docs.google.com/document');
            const isGoogleSlides = url.includes('docs.google.com/presentation') || url.includes('slides.google.com');
            const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
            const isPDF = url.endsWith('.pdf');

            // Set linkType based on the URL
            if (isGoogleDocs) {
                linkType = 'googledocs';
            } else if (isGoogleSlides) {
                linkType = 'googleslides';
            } else if (isYouTube) {
                linkType = 'youtube';
            } else if (isPDF) {
                linkType = 'pdf';
            }

            chrome.runtime.sendMessage({
                action: 'ADD_SOURCE',
                url: currentTab.url,
                title: currentTab.title,
                type: linkType, // Use the determined link type
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

    // This function is used to sync the current notebook to NotebookLM
    const handleSyncToNotebookLM = async () => {    
        if (sources.length === 0) {
            alert('No sources to sync');
            return;
        }

        setIsSyncing(true);

        try {
            for (const [_, source] of sources) {
                await notebookService.addSource({
                    
                })
            }
        }
}

export default App;
