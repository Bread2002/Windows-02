import { useRef, useState } from "react";
import DisplayProperties from "./DisplayProperties";
import FileExplorer from "./FileExplorer";
import {
  FolderIcon,
  GitHubIcon,
  LinkedInIcon,
  MyComputerIcon,
  MyDocumentsIcon,
  MyPortfolioIcon,
  RecycleBinFullIcon,
  RecycleBinIcon,
} from "./icons/DesktopIcons";
import MyComputerWindow from "./MyComputerWindow";
import RecycleBinWindow from "./RecycleBinWindow";
import Taskbar from "./Taskbar";
import { PUBLICATIONS, RESUME } from "../data/documents";
import type { IconDef } from "../types/desktop";

interface DragState {
  id: string;
  x: number;
  y: number;
}

export default function Desktop() {
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [myComputerOpen, setMyComputerOpen] = useState(false);
  const [myDocumentsOpen, setMyDocumentsOpen] = useState(false);
  const [recycleBinOpen, setRecycleBinOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [bgColor, setBgColor] = useState("#008080");
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [permanentlyDeleted, setPermanentlyDeleted] = useState<Set<string>>(
    new Set(),
  );
  const [drag, setDrag] = useState<DragState | null>(null);

  const hasDraggedRef = useRef(false);
  const recycleBinRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<Record<string, number>>({});

  const ICONS: IconDef[] = [
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: <LinkedInIcon />,
      onDoubleClick: () =>
        window.open(
          "https://www.linkedin.com/in/rye-stahle-smith",
          "_blank",
          "noopener,noreferrer",
        ),
    },
    {
      id: "github",
      label: "GitHub",
      icon: <GitHubIcon />,
      onDoubleClick: () =>
        window.open(
          "https://github.com/Bread2002",
          "_blank",
          "noopener,noreferrer",
        ),
    },
    {
      id: "gmail-cleaner",
      label: "Gmail Cleaner",
      icon: (
        <img
          src="https://gmail-cleaner-lovat.vercel.app/logo.png"
          alt="Gmail Cleaner"
          className="desktop-icon-img"
          style={{ borderRadius: "4px" }}
        />
      ),
      onDoubleClick: () =>
        window.open(
          "https://gmail-cleaner-lovat.vercel.app",
          "_blank",
          "noopener,noreferrer",
        ),
    },
    {
      id: "publications",
      label: "Publications",
      icon: <FolderIcon />,
      onDoubleClick: () => setExplorerOpen(true),
    },
    {
      id: "my-computer",
      label: "My Computer",
      icon: <MyComputerIcon />,
      onDoubleClick: () => setMyComputerOpen(true),
    },
    {
      id: "my-documents",
      label: "My Documents",
      icon: <MyDocumentsIcon />,
      onDoubleClick: () => setMyDocumentsOpen(true),
    },
    {
      id: "my-portfolio",
      label: "My Portfolio",
      icon: <MyPortfolioIcon />,
      onDoubleClick: () =>
        window.open(
          "https://mcryeserver.wixsite.com/gld-in-research",
          "_blank",
          "noopener,noreferrer",
        ),
    },
    {
      id: "recycle",
      label: "Recycle Bin",
      icon: deletedIds.size > 0 ? <RecycleBinFullIcon /> : <RecycleBinIcon />,
      onDoubleClick: () => setRecycleBinOpen(true),
    },
  ];

  function handleMouseDown(id: string, e: React.MouseEvent) {
    if (id === "recycle" || e.button !== 0) return;
    e.preventDefault();
    hasDraggedRef.current = false;
    const startX = e.clientX;
    const startY = e.clientY;

    function onMove(me: MouseEvent) {
      if (!hasDraggedRef.current) {
        if (
          Math.abs(me.clientX - startX) > 4 ||
          Math.abs(me.clientY - startY) > 4
        ) {
          hasDraggedRef.current = true;
        }
      }
      if (hasDraggedRef.current) setDrag({ id, x: me.clientX, y: me.clientY });
    }

    function onUp(me: MouseEvent) {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (hasDraggedRef.current) {
        const el = document.elementFromPoint(me.clientX, me.clientY);
        if (
          recycleBinRef.current?.contains(el as Node) ||
          recycleBinRef.current === el
        ) {
          setDeletedIds((prev) => new Set([...prev, id]));
        }
      }
      hasDraggedRef.current = false;
      setDrag(null);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function handleTouchStart(id: string, e: React.TouchEvent) {
    if (id === "recycle") return;
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    hasDraggedRef.current = false;

    function onMove(te: TouchEvent) {
      const t = te.touches[0];
      if (!t) return;
      if (!hasDraggedRef.current) {
        if (
          Math.abs(t.clientX - startX) > 8 ||
          Math.abs(t.clientY - startY) > 8
        ) {
          hasDraggedRef.current = true;
        }
      }
      if (hasDraggedRef.current) {
        te.preventDefault();
        setDrag({ id, x: t.clientX, y: t.clientY });
      }
    }

    function onEnd(te: TouchEvent) {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      if (hasDraggedRef.current) {
        const t = te.changedTouches[0];
        const el = document.elementFromPoint(t.clientX, t.clientY);
        if (
          recycleBinRef.current?.contains(el as Node) ||
          recycleBinRef.current === el
        ) {
          setDeletedIds((prev) => new Set([...prev, id]));
        }
      }
      hasDraggedRef.current = false;
      setDrag(null);
    }

    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
  }

  function handleRestore(id: string) {
    setDeletedIds((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  }

  function handlePermanentDelete(id: string) {
    setDeletedIds((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
    setPermanentlyDeleted((prev) => new Set([...prev, id]));
  }

  function renderIcon(icon: IconDef) {
    const isDragging = drag?.id === icon.id;
    return (
      <div
        key={icon.id}
        ref={icon.id === "recycle" ? recycleBinRef : undefined}
        className={`desktop-icon${isDragging ? " desktop-icon--dragging" : ""}`}
        // eslint-disable-next-line react-hooks/refs
        onMouseDown={(e) => handleMouseDown(icon.id, e)}
        // eslint-disable-next-line react-hooks/refs
        onTouchStart={(e) => handleTouchStart(icon.id, e)}
        onDoubleClick={() => {
          if (!hasDraggedRef.current) icon.onDoubleClick();
        }}
        onTouchEnd={(e) => {
          const now = Date.now();
          const last = lastTapRef.current[icon.id] ?? 0;
          if (now - last < 300) {
            e.preventDefault();
            icon.onDoubleClick();
          }
          lastTapRef.current[icon.id] = now;
        }}
        onContextMenu={(e) => e.stopPropagation()}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && icon.onDoubleClick()}
        role="button"
        aria-label={`Open ${icon.label}`}
      >
        {icon.icon}
        <span>{icon.label}</span>
      </div>
    );
  }

  const active = (id: string) =>
    !deletedIds.has(id) && !permanentlyDeleted.has(id);
  const ghostIcon = drag ? ICONS.find((i) => i.id === drag.id) : null;

  return (
    <div
      className="desktop"
      style={{ background: bgColor }}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
      }}
      onClick={() => setContextMenu(null)}
    >
      <div className="desktop-icon-area">
        {/* Left column */}
        <div className="desktop-icons-col">
          <div className="desktop-icons-group">
            {active("linkedin") && renderIcon(ICONS[0])}
            {active("github") && renderIcon(ICONS[1])}
            {active("gmail-cleaner") && renderIcon(ICONS[2])}
          </div>
          <div className="desktop-icons-group">
            {active("publications") && renderIcon(ICONS[3])}
          </div>
        </div>

        {/* Right column */}
        <div className="desktop-icons-col">
          <div className="desktop-icons-group">
            {active("my-computer") && renderIcon(ICONS[4])}
            {active("my-documents") && renderIcon(ICONS[5])}
            {active("my-portfolio") && renderIcon(ICONS[6])}
          </div>
          <div className="desktop-icons-group">{renderIcon(ICONS[7])}</div>
        </div>
      </div>

      {/* Drag ghost — follows cursor, pointer-events: none */}
      {ghostIcon && (
        <div
          className="desktop-icon desktop-icon-ghost"
          style={{ left: drag!.x - 40, top: drag!.y - 40 }}
          aria-hidden="true"
        >
          {ghostIcon.icon}
          <span>{ghostIcon.label}</span>
        </div>
      )}

      {explorerOpen && (
        <FileExplorer
          title="Publications"
          path="C:\Desktop\Publications"
          onClose={() => setExplorerOpen(false)}
          entries={PUBLICATIONS}
        />
      )}

      {myComputerOpen && (
        <MyComputerWindow
          allIcons={ICONS}
          onClose={() => setMyComputerOpen(false)}
          onOpenProperties={() => setPropertiesOpen(true)}
        />
      )}

      {myDocumentsOpen && (
        <FileExplorer
          title="My Documents"
          path="C:\Desktop\My Documents"
          onClose={() => setMyDocumentsOpen(false)}
          entries={[RESUME, ...PUBLICATIONS]}
        />
      )}

      {recycleBinOpen && (
        <RecycleBinWindow
          allIcons={ICONS}
          deletedIds={deletedIds}
          onRestore={handleRestore}
          onDelete={handlePermanentDelete}
          onEmptyAll={() => {
            setPermanentlyDeleted((prev) => new Set([...prev, ...deletedIds]));
            setDeletedIds(new Set());
          }}
          onClose={() => setRecycleBinOpen(false)}
        />
      )}

      {propertiesOpen && (
        <DisplayProperties
          bgColor={bgColor}
          onColorChange={setBgColor}
          onClose={() => setPropertiesOpen(false)}
        />
      )}

      {contextMenu && (
        <ul
          className="desktop-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <li
            onClick={() => {
              setContextMenu(null);
              setPropertiesOpen(true);
            }}
          >
            Properties
          </li>
        </ul>
      )}

      <Taskbar />
    </div>
  );
}
