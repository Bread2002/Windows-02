import { useState } from "react";

// ── Entry types ────────────────────────────────────────────

export type FolderEntry = {
  type: "folder";
  name: string;
};

export type FileEntry = {
  type: "file";
  name: string;
  dateCreated: string;
  url?: string;
};

export type PublicationEntry = {
  type: "publication";
  name: string;
  title: string;
  datePublished: string;
  publisher: string;
  authors: string[];
  url: string;
};

export type ResumeEntry = {
  type: "resume";
  name: string;
  title: string;
  lastUpdated: string;
  author?: string;
  url?: string;
};

export type Entry = FolderEntry | FileEntry | PublicationEntry | ResumeEntry;

// ── Props ──────────────────────────────────────────────────

interface Props {
  title: string;
  path: string;
  onClose: () => void;
  entries: Entry[];
}

// ── Icons ──────────────────────────────────────────────────

function FolderIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className="explorer-file-icon"
      aria-hidden="true"
    >
      <rect
        x="1"
        y="5"
        width="14"
        height="9"
        rx="1"
        fill="#f0c040"
        stroke="#a08000"
        strokeWidth="1"
      />
      <rect
        x="1"
        y="3"
        width="6"
        height="3"
        rx="1"
        fill="#f0c040"
        stroke="#a08000"
        strokeWidth="1"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className="explorer-file-icon"
      aria-hidden="true"
    >
      <polygon
        points="0,0 10,0 10,6 16,6 16,16 0,16"
        fill="#ffffff"
        stroke="#808080"
        strokeWidth="1"
      />
      <polygon
        points="10,0 16,6 10,6"
        fill="#c0c0c0"
        stroke="#808080"
        strokeWidth="1"
      />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg
      width="11"
      height="16"
      viewBox="0 0 11 16"
      xmlns="http://www.w3.org/2000/svg"
      className="explorer-file-icon"
      aria-hidden="true"
    >
      <polygon
        points="0,0 7,0 7,4 11,4 11,16 0,16"
        fill="#ffffff"
        stroke="#808080"
        strokeWidth="1"
      />
      <polygon
        points="7,0 11,4 7,4"
        fill="#c0c0c0"
        stroke="#808080"
        strokeWidth="1"
      />
      <rect x="1" y="11" width="9" height="4" fill="#cc0000" />
      <text
        x="5.5"
        y="14.5"
        textAnchor="middle"
        fill="white"
        fontSize="4"
        fontFamily="Arial"
        fontWeight="bold"
      >
        PDF
      </text>
    </svg>
  );
}

function EntryIcon({ type }: { type: Entry["type"] }) {
  if (type === "folder") return <FolderIcon />;
  if (type === "publication" || type === "resume") return <PdfIcon />;
  return <FileIcon />;
}

// ── Detail pane ────────────────────────────────────────────

function DetailPane({ entry }: { entry: Entry | null }) {
  if (!entry) {
    return (
      <span className="explorer-detail-placeholder">
        Hover over a file to view its properties...
      </span>
    );
  }

  if (entry.type === "publication") {
    return (
      <>
        <div className="explorer-detail-row">
          <span className="explorer-detail-label">Title:</span>
          <span>{entry.title}</span>
        </div>
        <div className="explorer-detail-row">
          <span className="explorer-detail-label">Date Published:</span>
          <span>{entry.datePublished}</span>
        </div>
        <div className="explorer-detail-row">
          <span className="explorer-detail-label">Publisher:</span>
          <span>{entry.publisher}</span>
        </div>
        <div className="explorer-detail-row">
          <span className="explorer-detail-label">Author(s):</span>
          <span>{entry.authors.join(", ")}</span>
        </div>
      </>
    );
  }

  if (entry.type === "resume") {
    return (
      <>
        <div className="explorer-detail-row">
          <span className="explorer-detail-label">Title:</span>
          <span>{entry.title}</span>
        </div>
        <div className="explorer-detail-row">
          <span className="explorer-detail-label">Last Updated:</span>
          <span>{entry.lastUpdated}</span>
        </div>
        {entry.author && (
          <div className="explorer-detail-row">
            <span className="explorer-detail-label">Author:</span>
            <span>{entry.author}</span>
          </div>
        )}
      </>
    );
  }

  if (entry.type === "file") {
    return (
      <>
        <div className="explorer-detail-row">
          <span className="explorer-detail-label">Name:</span>
          <span>{entry.name}</span>
        </div>
        <div className="explorer-detail-row">
          <span className="explorer-detail-label">Date Created:</span>
          <span>{entry.dateCreated}</span>
        </div>
      </>
    );
  }

  return (
    <div className="explorer-detail-row">
      <span className="explorer-detail-label">Name:</span>
      <span>{entry.name}</span>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────

export default function FileExplorer({ title, path, onClose, entries }: Props) {
  const [hovered, setHovered] = useState<Entry | null>(null);

  function entryUrl(entry: Entry): string | undefined {
    if (entry.type === "publication") return entry.url;
    if (entry.type === "resume") return entry.url;
    if (entry.type === "file") return entry.url;
    return undefined;
  }

  return (
    <div
      className="explorer-overlay"
      onContextMenu={(e) => e.stopPropagation()}
    >
      <div className="window explorer-window">
        <div className="title-bar">
          <div className="title-bar-text">{title}</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" disabled />
            <button aria-label="Maximize" disabled />
            <button aria-label="Close" onClick={onClose} />
          </div>
        </div>

        <div className="window-body" style={{ padding: 0 }}>
          <div className="explorer-toolbar">
            <button disabled>← Back</button>
            <button disabled>→ Forward</button>
            <button disabled>↑ Up</button>
            <button disabled>Cut</button>
            <button disabled>Copy</button>
            <button disabled>Paste</button>
            <button disabled>Delete</button>
          </div>

          <div className="explorer-address-bar">
            <label htmlFor="explorer-addr">Address</label>
            <input id="explorer-addr" type="text" readOnly value={path} />
          </div>

          <div className="explorer-body">
            <div className="sunken-panel explorer-pane">
              <ul className="explorer-file-list">
                {entries.map((entry) => {
                  const url = entryUrl(entry);
                  const content = (
                    <>
                      <EntryIcon type={entry.type} />
                      {entry.name}
                    </>
                  );
                  return (
                    <li
                      key={entry.name}
                      onMouseEnter={() => setHovered(entry)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="explorer-file-link"
                        >
                          {content}
                        </a>
                      ) : (
                        <span className="explorer-file-link">{content}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="explorer-detail-pane">
              <DetailPane entry={hovered} />
            </div>
          </div>

          <div className="status-bar explorer-status">
            <p className="status-bar-field">{entries.length} object(s)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
