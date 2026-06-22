import { useCallback, useEffect, useRef, useState } from "react";

const UPLOAD_DATE = new Date("2026-06-16");

const DISKS: Record<string, string> = {
  "WDC WD64AA-00BAA0": "6.4GB",
  "WDC WD102AA-00AFA0": "10.2GB",
  "MAXTOR 90845D4": "8.4GB",
  "MAXTOR 52049H3": "20GB",
  ST38421A: "8.4GB",
  ST315310A: "15GB",
  "IBM-DTTA-351010": "10GB",
  "IBM-DJNA-352030": "20GB",
  "FUJITSU MPE3084AE": "8.4GB",
  "QUANTUM FIREBALLP LM20": "20GB",
  "QUANTUM EX12A011": "12GB",
};

const EVENTS = [
  `WARNING: System has been running for ${Math.floor((Date.now() - UPLOAD_DATE.getTime()) / (1000 * 60 * 60 * 24))} days without a meaningful connection. Show it some love.`,
  "INFO: Memory check complete. Some memories could not be recovered. This is okay.",
  "WARNING: Clock batteries need replacing. System no longer certain what time it is (or if it matters).",
  "WARNING: Hard drive has filed an appeal with the court to be recognized.",
  "INFO: Boot sequence interrupted by the Boot Sequence Review Committee (BSRC). Awaiting approval.",
  "INFO: Secondary device found. It was not invited to the party.",
  "INFO: BIOS integrity verified. It feels pretty comfortable with what it found.",
  "INFO: Unknown peripheral is missing on COM3. COM3 has been asked for their alibi.",
  "INFO: CPU fan appears to be spinning. He's having a great time.",
  "ERROR: Disk unreadable. The disk is always unreadable lol.",
  "INFO: IRQ conflict resolved via financial negotiation. Both parties satisfied.",
  "INFO: Device found. However, it wishes it hadn't been.",
];

const HDD_LABELS = [
  "Primary Master",
  "Primary Slave",
  "Secondary Master",
  "Secondary Slave",
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Component ─────────────────────────────────────────────
interface Props {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: Props) {
  const [waiting, setWaiting] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [memCount, setMemCount] = useState("");
  const [headerFaded, setHeaderFaded] = useState(false);
  const [pnpVisible, setPnpVisible] = useState(false);
  const [hddLines, setHddLines] = useState<string[]>(["", "", "", ""]);
  const [eventText, setEventText] = useState("");
  const [footerVisible, setFooterVisible] = useState(false);
  const doneRef = useRef(false);
  const bootSoundRef = useRef<HTMLAudioElement | null>(null);

  const complete = useCallback(() => {
    if (!doneRef.current) {
      doneRef.current = true;
      bootSoundRef.current?.pause();
      onComplete();
    }
  }, [onComplete]);

  // Spacebar to begin boot; plays the boot sound at the moment of user interaction
  useEffect(() => {
    if (!waiting) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const bootSound = new Audio("/bios/boot.mp3");
        bootSoundRef.current = bootSound;
        bootSound.play().catch(() => {});
        setWaiting(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [waiting]);

  // ESC to skip boot
  useEffect(() => {
    if (waiting) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") complete();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [waiting, complete]);

  useEffect(() => {
    if (waiting) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    function later(ms: number): Promise<void> {
      return new Promise((r) => {
        if (!cancelled) timers.push(setTimeout(r, ms));
      });
    }

    function updateHdd(i: number, html: string) {
      setHddLines((prev) => {
        const next = [...prev];
        next[i] = html;
        return next;
      });
    }

    async function run() {
      // ── Header (2s delay, matches original turnOn) ──
      await later(2000);
      if (cancelled) return;
      setHeaderVisible(true);

      // ── Memory counter (pre-scheduled, same timing as original) ──
      const MEM_MAX = 32768;
      const MEM_BLOCK = 4;
      setMemCount("0K");
      for (let i = MEM_BLOCK; i <= MEM_MAX; i += MEM_BLOCK) {
        const val = i;
        timers.push(
          setTimeout(() => {
            if (!cancelled)
              setMemCount(val < MEM_MAX ? `${val}K` : `${val}K OK`);
          }, val / MEM_BLOCK),
        );
      }
      // Header fades ~5s into memory test
      timers.push(
        setTimeout(() => {
          if (!cancelled) setHeaderFaded(true);
        }, 5000),
      );
      await later(MEM_MAX / MEM_BLOCK + 300);
      if (cancelled) return;

      // ── PnP stage ──
      await later(3000);
      if (cancelled) return;
      setPnpVisible(true);

      // ── Primary Master (always detected) ──
      updateHdd(0, `Detecting IDE ${HDD_LABELS[0]}...`);
      await later(2000);
      if (cancelled) return;
      const disk = rand(Object.keys(DISKS));
      updateHdd(0, `Detecting IDE ${HDD_LABELS[0]}... ${disk} ${DISKS[disk]}`);

      // ── Secondary drives (None is ~25% likely, down from 50%) ──
      for (let i = 1; i <= 3; i++) {
        const n = Math.floor(Math.random() * 4);
        if (n === 0) {
          // None (1-in-4 chance)
          await later(50);
          if (cancelled) return;
          updateHdd(i, `Detecting IDE ${HDD_LABELS[i]}... None`);
        } else {
          updateHdd(i, `Detecting IDE ${HDD_LABELS[i]}...`);
          await later(4000);
          if (cancelled) return;
          const d = rand(Object.keys(DISKS));
          updateHdd(i, `Detecting IDE ${HDD_LABELS[i]}... ${d} ${DISKS[d]}`);
        }
      }

      // ── Random BIOS event ──
      await later(2000);
      if (cancelled) return;
      setEventText(rand(EVENTS));

      // ── Footer ──
      await later(3500);
      if (cancelled) return;
      setFooterVisible(true);

      // ── Auto-proceed to login ──
      await later(3000);
      if (!cancelled) complete();
    }

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [waiting, complete]);

  if (waiting) {
    return (
      <div className="boot-screen boot-screen--press">
        <p className="boot-press-prompt">Press &lt;Spacebar&gt; to BOOT</p>
      </div>
    );
  }

  return (
    <div className="boot-screen">
      <div className="boot-screen-content">
        {headerVisible && (
          <>
            <div
              className={`bios-header${headerFaded ? " bios-header-faded" : ""}`}
            >
              <a href="https://www.fontspace.com/category/3d,pixel">
                <img src="/bios/header.png" alt="Header" />
              </a>
            </div>
            <div className="bios-info">
              <div className="bios-brand">
                <a href="https://www.flaticon.com/free-icons/pixel-art">
                  <img src="/bios/blip.png" alt="Blip" className="bios-blip" />
                </a>
                <p>
                  Award Modular BIOS v4.50G, An Energy Star Ally
                  <br />
                  Copyright (C) 1984-94, Award Software, Inc.
                </p>
              </div>
              <p>M4NZD3V ACPI BIOS Revision 1004</p>
              <p>
                Intel(R) Pentium(R) PRO-MMX CPU at 133MHz
                <br />
                Memory Test: <span className="bios-mem-count">{memCount}</span>
              </p>
            </div>
          </>
        )}

        {pnpVisible && (
          <div className="bios-pnp">
            <p>Award Plug and Play BIOS Extension v1.0A</p>
            <p>Initialize Plug and Play Cards...</p>
            <p>PNP Init Completed</p>
          </div>
        )}

        <div className="bios-hdd">
          {hddLines.map((line, i) =>
            line ? (
              <p key={i} className="bios-hdd-line">
                {line}
              </p>
            ) : null,
          )}
        </div>

        {eventText && <p className="bios-event">{eventText}</p>}

        {footerVisible && (
          <div className="bios-last">
            <p>This website is a work of fiction, not a real system.</p>
            <p>Copyright (C) 2026, Rye Stahle-Smith; All rights reserved.</p>
          </div>
        )}
      </div>

      <div className="boot-screen-footer">Press &lt;Esc&gt; to SKIP</div>
    </div>
  );
}
