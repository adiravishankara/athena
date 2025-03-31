import { Notebooks, Notebook, Source, NotebookSourceData } from '../../common/types.ts';
import { getLocalStorage, setLocalStorage } from '../chrome/storage.ts';
import { normalizeUrlForComparison } from '../utils/utils.ts'; // Import the utility function

const NOTEBOOKS_KEY = 'notebooks';
const CURRENT_NOTEBOOK_KEY = 'currentNotebook';
const RESEARCH_MODE_KEY = 'researchMode';

// --- Notebook Operations ---

/**
 * Retrieves all notebooks from storage.
 */
export async function getNotebooks(): Promise<Notebooks> {
    const result = await getLocalStorage<{ [NOTEBOOKS_KEY]?: Notebooks }>([NOTEBOOKS_KEY]);
    return result[NOTEBOOKS_KEY] || {};
}

/**
 * Retrieves the name of the currently selected notebook.
 */
export async function getCurrentNotebookName(): Promise<string | null> {
    const result = await getLocalStorage<{ [CURRENT_NOTEBOOK_KEY]?: string | null }>([CURRENT_NOTEBOOK_KEY]);
    return result[CURRENT_NOTEBOOK_KEY] || null;
}

/**
 * Sets the currently selected notebook.
 * @param name The name of the notebook to set as current, or null to clear.
 */
export async function setCurrentNotebook(name: string | null): Promise<void> {
    const notebooks = await getNotebooks();
    if (name !== null && !notebooks[name]) {
        throw new Error(`Notebook "${name}" does not exist.`);
    }
    await setLocalStorage({ [CURRENT_NOTEBOOK_KEY]: name });
    console.log(`Current notebook set to: ${name}`);
}

/**
 * Creates a new, empty notebook.
 * @param name The desired name for the new notebook.
 * @returns The newly created notebook object.
 * @throws If a notebook with the same name already exists.
 */
export async function createNotebook(name: string): Promise<{ name: string; notebook: Notebook }> {
    if (!name || name.trim() === '') {
        throw new Error('Notebook name cannot be empty.');
    }
    const trimmedName = name.trim();

    const notebooks = await getNotebooks();
    if (notebooks[trimmedName]) {
        throw new Error(`Notebook "${trimmedName}" already exists.`);
    }

    const nowISO = new Date().toISOString();
    const newNotebook: Notebook = {
        created_datetime: nowISO,
        last_updated_datetime: nowISO,
        last_sync_datetime: null,
        notebookLM_id: null,
        notebookLM_url: null,
        notebookLM_title: null,
        sources: {}
    };

    const updatedNotebooks = { ...notebooks, [trimmedName]: newNotebook };
    await setLocalStorage({ [NOTEBOOKS_KEY]: updatedNotebooks });
    console.log(`Notebook "${trimmedName}" created.`);

    // Optionally set the new notebook as current
    await setCurrentNotebook(trimmedName);

    return { name: trimmedName, notebook: newNotebook };
}

// --- Source Operations ---

/**
 * Adds a source to the currently selected notebook.
 * @param source The source object to add.
 * @returns The added source object along with its generated ID.
 * @throws If no notebook is currently selected or the source data is invalid.
 */
export async function addSourceToCurrentNotebook(source: Omit<Source, 'added_to_notebook'>): Promise<{ notebookName: string; sourceId: string; source: Source }> {
    const currentNotebookName = await getCurrentNotebookName();
    if (!currentNotebookName) {
        throw new Error('No notebook selected. Please select or create a notebook first.');
    }

    if (!source || !source.url) {
        throw new Error('Source URL is required.');
    }

    const notebooks = await getNotebooks();
    const targetNotebook = notebooks[currentNotebookName];

    if (!targetNotebook) {
        // This case should ideally not happen if setCurrentNotebook validates
        throw new Error(`Current notebook "${currentNotebookName}" not found in storage.`);
    }

    // Generate a unique ID for the source
    const sourceId = `source_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newSource: Source = {
        ...source,
        title: source.title || source.url, // Ensure title exists
        linkType: source.linkType || 'web', // Default linkType
        added_datetime: source.added_datetime || new Date().toISOString(),
        added_to_notebook: false // Initialize sync status
    };

    // Check for duplicates based on normalized URL within the current notebook
    const normalizedNewUrl = normalizeUrlForComparison(newSource.url);
    const existingSources = Object.values(targetNotebook.sources);
    const isDuplicate = existingSources.some(existing => normalizeUrlForComparison(existing.url) === normalizedNewUrl);

    if (isDuplicate) {
        console.warn(`Source URL "${newSource.url}" already exists in notebook "${currentNotebookName}". Skipping add.`);
        // Find the existing source ID to return potentially? Or throw specific error?
        // For now, let's throw an error indicating duplication.
         throw new Error(`Source URL "${source.url}" already exists in this notebook.`);
        // Or return the existing source?
        // const existingEntry = Object.entries(targetNotebook.sources).find(([id, s]) => normalizeUrlForComparison(s.url) === normalizedNewUrl);
        // if (existingEntry) {
        //     return { notebookName: currentNotebookName, sourceId: existingEntry[0], source: existingEntry[1] };
        // }
    }


    const updatedSources: NotebookSourceData = {
        ...(targetNotebook.sources || {}),
        [sourceId]: newSource
    };

    const updatedNotebook: Notebook = {
        ...targetNotebook,
        sources: updatedSources,
        last_updated_datetime: new Date().toISOString()
    };

    const updatedNotebooks = { ...notebooks, [currentNotebookName]: updatedNotebook };
    await setLocalStorage({ [NOTEBOOKS_KEY]: updatedNotebooks });
    console.log(`Source "${newSource.title}" added to notebook "${currentNotebookName}".`);

    return { notebookName: currentNotebookName, sourceId, source: newSource };
}

/**
 * Deletes a source from a specified notebook.
 * @param notebookName The name of the notebook containing the source.
 * @param sourceId The ID of the source to delete.
 * @throws If the notebook or source does not exist.
 */
export async function deleteSourceFromNotebook(notebookName: string, sourceId: string): Promise<{ notebookName: string; sourceId: string }> {
     if (!notebookName) {
        throw new Error('Notebook name is required.');
    }
     if (!sourceId) {
        throw new Error('Source ID is required.');
    }

    const notebooks = await getNotebooks();
    const targetNotebook = notebooks[notebookName];

    if (!targetNotebook) {
        throw new Error(`Notebook "${notebookName}" does not exist.`);
    }

    if (!targetNotebook.sources || !targetNotebook.sources[sourceId]) {
        throw new Error(`Source ID "${sourceId}" does not exist in notebook "${notebookName}".`);
    }

    // Create a new sources object without the deleted source
    const updatedSources = { ...targetNotebook.sources };
    delete updatedSources[sourceId];

    const updatedNotebook: Notebook = {
        ...targetNotebook,
        sources: updatedSources,
        last_updated_datetime: new Date().toISOString()
    };

    const updatedNotebooks = { ...notebooks, [notebookName]: updatedNotebook };
    await setLocalStorage({ [NOTEBOOKS_KEY]: updatedNotebooks });
    console.log(`Source ID "${sourceId}" deleted from notebook "${notebookName}".`);

    return { notebookName, sourceId };
}

/**
 * Updates the sync status of a specific source within a notebook.
 * @param notebookName Name of the notebook.
 * @param sourceId ID of the source.
 * @param synced Whether the source has been added to NotebookLM.
 */
export async function updateSourceSyncStatus(notebookName: string, sourceId: string, synced: boolean): Promise<void> {
    const notebooks = await getNotebooks();
    const targetNotebook = notebooks[notebookName];

    if (!targetNotebook || !targetNotebook.sources || !targetNotebook.sources[sourceId]) {
        console.warn(`Cannot update sync status: Notebook "${notebookName}" or Source ID "${sourceId}" not found.`);
        return; // Or throw error? For now, just log and return.
    }

    if (targetNotebook.sources[sourceId].added_to_notebook === synced) {
        return; // No change needed
    }

    const updatedSource: Source = {
        ...targetNotebook.sources[sourceId],
        added_to_notebook: synced
    };

    const updatedSources = {
        ...targetNotebook.sources,
        [sourceId]: updatedSource
    };

     const updatedNotebook: Notebook = {
        ...targetNotebook,
        sources: updatedSources,
        // Optionally update last_updated_datetime here? Decided against it for now.
    };

    const updatedNotebooks = { ...notebooks, [notebookName]: updatedNotebook };
    await setLocalStorage({ [NOTEBOOKS_KEY]: updatedNotebooks });
    console.log(`Sync status for source "${sourceId}" in notebook "${notebookName}" updated to ${synced}.`);
}


// --- Research Mode Operations ---

/**
 * Retrieves the current state of research mode.
 */
export async function getResearchMode(): Promise<boolean> {
    const result = await getLocalStorage<{ [RESEARCH_MODE_KEY]?: boolean }>([RESEARCH_MODE_KEY]);
    return result[RESEARCH_MODE_KEY] || false; // Default to false if not set
}

/**
 * Sets the state of research mode.
 * @param enabled True to enable research mode, false to disable.
 */
export async function setResearchMode(enabled: boolean): Promise<void> {
    await setLocalStorage({ [RESEARCH_MODE_KEY]: enabled });
    console.log(`Research mode set to: ${enabled}`);
}

// normalizeUrlForComparison moved to ../utils/utils.ts