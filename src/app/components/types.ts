export type OutputItem =
  | { type: 'command'; query: string }
  | { type: 'feedback'; message: string }
  | { type: 'file-match'; path: string; line?: string; lineNumber?: number }
  | { type: 'content'; content: string; path: string }
  | { type: 'edit-button'; path: string; content: string };

export type Suggestion =
  | { type: 'feedback'; message: string }
  | { type: 'file-match'; path: string; line?: string };
