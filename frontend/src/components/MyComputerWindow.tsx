import type { IconDef } from "../types/desktop";

interface Props {
  allIcons: IconDef[];
  onClose: () => void;
  onOpenProperties: () => void;
}

export default function MyComputerWindow({ allIcons, onClose, onOpenProperties }: Props) {
  return (
    <div
      className="explorer-overlay"
      onContextMenu={(e) => e.stopPropagation()}
    >
      <div className="window explorer-window">
        <div className="title-bar">
          <div className="title-bar-text">My Computer</div>
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
            <button
              onClick={() => {
                onClose();
                onOpenProperties();
              }}
            >
              Display Properties
            </button>
          </div>

          <div className="explorer-address-bar">
            <label htmlFor="addr-mycomputer">Address</label>
            <input id="addr-mycomputer" readOnly value="C:\Desktop\My Computer" />
          </div>

          <div className="explorer-body">
            <div className="sunken-panel explorer-pane">
              <ul className="explorer-file-list">
                {allIcons.map((icon) => (
                  <li
                    key={icon.id}
                    onDoubleClick={() => {
                      icon.onDoubleClick();
                      if (icon.label !== "My Computer") {
                        onClose();
                      }
                    }}
                  >
                    <span className="explorer-file-icon">{icon.icon}</span>
                    {icon.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="status-bar explorer-status">
            <p className="status-bar-field">{allIcons.length} object(s)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
