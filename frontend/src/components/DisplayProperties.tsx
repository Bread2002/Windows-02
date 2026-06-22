import { useState } from "react";

const DESKTOP_COLORS: { label: string; value: string }[] = [
  { label: "Teal (Default)", value: "#008080" },
  { label: "Navy", value: "#000080" },
  { label: "Midnight Blue", value: "#191970" },
  { label: "Steel Blue", value: "#4682B4" },
  { label: "Slate Blue", value: "#6A5ACD" },
  { label: "Forest Green", value: "#228B22" },
  { label: "Dark Olive", value: "#556B2F" },
  { label: "Dark Teal", value: "#2F4F4F" },
  { label: "Maroon", value: "#800000" },
  { label: "Dark Purple", value: "#800080" },
  { label: "Indigo", value: "#4B0082" },
  { label: "Saddle Brown", value: "#8B4513" },
  { label: "Dark Gray", value: "#404040" },
  { label: "Charcoal", value: "#36454F" },
  { label: "Black", value: "#000000" },
  { label: "Crimson", value: "#B22222" },
];

const DISPLAY_TABS = [
  "Background",
  "Screen Saver",
  "Appearance",
  "Effects",
  "Web",
  "Settings",
] as const;

interface Props {
  bgColor: string;
  onColorChange: (c: string) => void;
  onClose: () => void;
}

export default function DisplayProperties({ bgColor, onColorChange, onClose }: Props) {
  const [activeTab] = useState<string>("Appearance");
  const [pendingColor, setPendingColor] = useState(bgColor);

  function apply() {
    onColorChange(pendingColor);
  }

  return (
    <div
      className="explorer-overlay"
      onContextMenu={(e) => e.stopPropagation()}
    >
      <div className="window display-props-window">
        <div className="title-bar">
          <div className="title-bar-text">Display Properties</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" disabled />
            <button aria-label="Maximize" disabled />
            <button aria-label="Close" onClick={onClose} />
          </div>
        </div>

        <div className="window-body display-props-body">
          <menu role="tablist" className="display-props-tablist">
            {DISPLAY_TABS.map((tab) => (
              <li
                key={tab}
                role="tab"
                aria-selected={tab === activeTab}
                aria-disabled={tab !== activeTab}
                className={tab !== activeTab ? "display-tab--disabled" : ""}
              >
                {tab}
              </li>
            ))}
          </menu>
          <hr className="display-props-divider" />

          <div role="tabpanel" className="display-props-panel">
            <div className="display-preview-frame">
              <div
                className="display-preview-desktop"
                style={{ background: pendingColor }}
              >
                <div className="display-preview-win">
                  <div className="display-preview-titlebar" />
                  <div className="display-preview-content" />
                </div>
              </div>
            </div>

            <div className="display-color-section">
              <p className="display-color-label">Desktop Colors:</p>
              <div className="display-color-grid">
                {DESKTOP_COLORS.map((c) => (
                  <button
                    key={c.value}
                    className={`display-color-swatch${
                      pendingColor === c.value
                        ? " display-color-swatch--selected"
                        : ""
                    }`}
                    style={{ background: c.value }}
                    title={c.label}
                    onClick={() => setPendingColor(c.value)}
                  />
                ))}
              </div>

              <div className="display-color-preview-row">
                <span>Selected Color:</span>
                <div
                  className="display-color-preview-chip"
                  style={{ background: pendingColor }}
                />
                <span className="display-color-preview-hex">
                  {pendingColor}
                </span>
              </div>
            </div>
          </div>

          <div className="display-props-actions">
            <button
              onClick={() => {
                apply();
                onClose();
              }}
            >
              OK
            </button>
            <button onClick={onClose}>Cancel</button>
            <button onClick={apply}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
}
