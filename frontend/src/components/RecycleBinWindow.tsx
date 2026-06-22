import { useRef, useState } from "react";
import type { IconDef } from "../types/desktop";

interface Props {
  allIcons: IconDef[];
  deletedIds: Set<string>;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onEmptyAll: () => void;
  onClose: () => void;
}

export default function RecycleBinWindow({
  allIcons,
  deletedIds,
  onRestore,
  onDelete,
  onEmptyAll,
  onClose,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<IconDef | null>(null);
  const lastClickedIndex = useRef(-1);

  const deleted = allIcons.filter((i) => deletedIds.has(i.id));

  function handleItemClick(icon: IconDef, index: number, e: React.MouseEvent) {
    if (e.ctrlKey) {
      setSelectedIds((prev) => {
        const n = new Set(prev);
        if (n.has(icon.id)) n.delete(icon.id);
        else n.add(icon.id);
        return n;
      });
    } else if (e.shiftKey && lastClickedIndex.current >= 0) {
      const start = Math.min(lastClickedIndex.current, index);
      const end = Math.max(lastClickedIndex.current, index);
      setSelectedIds(new Set(deleted.slice(start, end + 1).map((i) => i.id)));
      return;
    } else {
      setSelectedIds(new Set([icon.id]));
    }
    lastClickedIndex.current = index;
  }

  function restoreSelected() {
    selectedIds.forEach((id) => onRestore(id));
    setSelectedIds(new Set());
  }

  function deleteSelected() {
    selectedIds.forEach((id) => onDelete(id));
    setSelectedIds(new Set());
  }

  const selectedList = deleted.filter((i) => selectedIds.has(i.id));
  const detailIcon = selectedList.length === 1 ? selectedList[0] : hovered;

  return (
    <div
      className="explorer-overlay"
      onContextMenu={(e) => e.stopPropagation()}
    >
      <div className="window explorer-window">
        <div className="title-bar">
          <div className="title-bar-text">Recycle Bin</div>
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
            <button onClick={restoreSelected} disabled={selectedIds.size === 0}>
              Restore
            </button>
            <button onClick={deleteSelected} disabled={selectedIds.size === 0}>
              Delete
            </button>
            <button onClick={onEmptyAll} disabled={deleted.length === 0}>
              Empty Recycle Bin
            </button>
          </div>

          <div className="explorer-address-bar">
            <label htmlFor="addr-recycle">Address</label>
            <input id="addr-recycle" readOnly value="C:\Desktop\Recycle Bin" />
          </div>

          <div className="explorer-body">
            <div className="sunken-panel explorer-pane">
              {deleted.length === 0 ? (
                <p className="recycle-empty-msg">Recycle Bin is empty.</p>
              ) : (
                <ul className="explorer-file-list">
                  {deleted.map((icon, i) => (
                    <li
                      key={icon.id}
                      className={
                        selectedIds.has(icon.id) ? "explorer-item--selected" : ""
                      }
                      onMouseEnter={() => setHovered(icon)}
                      onMouseLeave={() =>
                        setHovered((h) => (h?.id === icon.id ? null : h))
                      }
                      onClick={(e) => handleItemClick(icon, i, e)}
                    >
                      <span className="explorer-file-link">
                        <span className="explorer-file-icon">{icon.icon}</span>
                        {icon.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="explorer-detail-pane">
              {selectedList.length > 1 ? (
                <div className="explorer-detail-row">
                  <span className="explorer-detail-label">Selected:</span>
                  <span>{selectedList.length} items</span>
                </div>
              ) : detailIcon ? (
                <div className="explorer-detail-row">
                  <span className="explorer-detail-label">Name:</span>
                  <span>{detailIcon.label}</span>
                </div>
              ) : (
                <span className="explorer-detail-placeholder">
                  Select items to restore or delete them...
                </span>
              )}
            </div>
          </div>

          <div className="status-bar explorer-status">
            <p className="status-bar-field">{deleted.length} object(s)</p>
            {selectedIds.size > 0 && (
              <p className="status-bar-field">{selectedIds.size} selected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
