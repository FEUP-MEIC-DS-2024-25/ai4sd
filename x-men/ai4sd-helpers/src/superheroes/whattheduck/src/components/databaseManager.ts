import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";

// Interface for a history record
interface HistoryRecord {
  id?: number;
  timestamp?: string;
  original_code: string;
  filters: string;
  selected: boolean;
  error: boolean;
  refactored_code: string;
  accepted: boolean;
}

// Database manager class
export class myDatabaseManager {
  private db!: Database<sqlite3.Database>;
  private dbPath: string;
  private historyPanel: vscode.WebviewPanel | undefined;

  constructor(context: vscode.ExtensionContext) {
    this.dbPath = path.join(context.globalStorageUri.fsPath, "history", "history.db");
  }

  // Initialize the database and create the table
  public async initialize(): Promise<void> {
    try {
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });

      await this.createTable();
    } catch (err) {
      vscode.window.showErrorMessage("Error during database initialization:" + err);
      throw err;
    }
  }

  // Create the history table
  private async createTable(): Promise<void> {
    const query = `
        CREATE TABLE IF NOT EXISTS history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          original_code TEXT NOT NULL,
          filters TEXT NOT NULL,
          selected BOOLEAN NOT NULL,
          error BOOLEAN NOT NULL,
          refactored_code TEXT NOT NULL,
          accepted BOOLEAN NOT NULL
        )
      `;
    await this.db.exec(query);
  }

  // Insert a record into the history table
  public async insertRecord(original_code: string, filters: string, selected: boolean, error: boolean, refactored_code: string, accepted: boolean): Promise<void> {
    try {
      const query = `
        INSERT INTO history (original_code, filters, selected, error, refactored_code, accepted)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await this.db.run(
        query,
        original_code,
        filters,
        selected,
        error,
        refactored_code,
        accepted
      );
    } catch (err) {
      vscode.window.showErrorMessage("Error inserting record:" + err);
      throw err;
    }
  }

  // Get all records from the history table
  private async getAllRecords(): Promise<HistoryRecord[]> {
    const query = `SELECT * FROM history ORDER BY timestamp DESC`;
    return await this.db.all<HistoryRecord[]>(query);
  }

  // Helper function to escape HTML special characters
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\n/g, "<br>")
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
      .replace(/ /g, "&nbsp;");
  }

  // Replace the {{history}} placeholder in the HTML content with the records
  public async getRecordsHTML(): Promise<string> {
    const records = await this.getAllRecords();

    const htmlPath = vscode.Uri.file(path.join(__dirname, '../../src/components/WebViews/history.html'));
    let htmlContent = fs.readFileSync(htmlPath.fsPath, 'utf8');

    if (records.length === 0) {
      const row = "<tr><td colspan='8'>No records found</td></tr>";
      htmlContent = htmlContent.replace('{{history}}', row);
      return htmlContent;
    }

    let history = '';
    for (const record of records) {
      const row = `
        <tr>
          <td>${record.id}</td>
          <td>${record.timestamp}</td>
          <td>
            <details>
              <summary>Original Code</summary>
              <code>${this.escapeHtml(record.original_code)}</code>
            </details>    
          </td>
          <td>
            <details>
              <summary>Refactored Code</summary>
              <code>${this.escapeHtml(record.refactored_code)}</code>
            </details>    
          </td>
          <td>
            <details>
              <summary>Filters</summary>
              <code>${record.filters}</code>
            </details>    
          </td>
          <td>${record.selected ? "Yes" : "No"}</td>
          <td>${record.accepted ? "Yes" : "No"}</td>
          <td>${record.error ? "Yes" : "No"}</td> 
        </tr>
      `;

      history += row;
    }

    htmlContent = htmlContent.replace('{{history}}', history);

    return htmlContent;
  }

  // Create the history webview
  public async createHistoryWebview() {
    if (this.historyPanel) {
      if (!this.historyPanel.visible) {
        this.historyPanel.reveal(vscode.ViewColumn.Beside);
      }
    } else {
      this.historyPanel = vscode.window.createWebviewPanel(
        'history',
        'History',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(__dirname, '../../resources'))
          ]
        }
      );

      this.historyPanel.iconPath = vscode.Uri.file(path.join(__dirname, '../../resources/whattheduck.jpg'));
      this.historyPanel.webview.html = await this.getRecordsHTML();

      this.historyPanel.onDidDispose(() => {
        this.historyPanel = undefined;
      });
    }
  }

  // Close the database connection
  public async close(): Promise<void> {
    await this.db.close();
  }
}

// Database manager instance shared across the extension
export let dbManager: myDatabaseManager | undefined = undefined;

// Initialize the database manager
export async function setup(context: vscode.ExtensionContext): Promise<void> {
  dbManager = new myDatabaseManager(context);
  await dbManager.initialize();
}

// database getter
export function getDatabaseManager(): myDatabaseManager {
  if (!dbManager) {
    throw new Error('Database manager not initialized');
  }

  return dbManager;
}