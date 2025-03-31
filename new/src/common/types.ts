/// <reference types="chrome"/>

// Represents a single source (webpage, PDF, video, etc.)
export interface Source {
  url: string;
  title: string; // Use document title or URL if title is unavailable
  linkType: SourceType; // Type of the source link
  added_datetime: string; // ISO string format
  added_to_notebook?: boolean; // Optional: Track if synced to NotebookLM
}

// Represents the data stored for a single notebook, keyed by a unique source ID
export interface NotebookSourceData {
  [sourceId: string]: Source;
}

// Represents the structure of a single notebook in storage
export interface Notebook {
  created_datetime: string; // ISO string format
  last_updated_datetime: string; // ISO string format
  last_sync_datetime: string | null; // ISO string format or null if never synced
  notebookLM_id: string | null; // ID from NotebookLM if synced, otherwise null
  notebookLM_url: string | null; // URL from NotebookLM if synced, otherwise null
  notebookLM_title: string | null; // Title from NotebookLM if synced, otherwise null
  sources: NotebookSourceData; // Object containing sources keyed by unique IDs
}

// Represents the entire collection of notebooks stored locally, keyed by notebook name
export interface Notebooks {
  [notebookName: string]: Notebook;
}

// Defines the possible types for a source link
export type SourceType = 'website' | 'youtube' | 'googledocs' | 'googleslides' | 'pdf' | 'web'; // Added 'web' for compatibility

// Structure for messages passed between components (UI, background, content)
export interface ActionMessage {
  action: string; // e.g., 'ADD_SOURCE', 'GET_NOTEBOOKS'
  payload?: any; // Data associated with the action
}

// Structure for responses to ActionMessages
export interface ActionResponse {
  status: 'success' | 'error';
  data?: any; // Data returned on success
  error?: string; // Error message on failure
}

// Structure for data passed when adding a source via NotebookLMService (API layer)
export interface NotebookLMServiceSource {
    url: string;
    title?: string;
    linkType: SourceType;
    added_datetime?: string;
}