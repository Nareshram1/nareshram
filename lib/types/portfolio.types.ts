// Type for a single window's state
export interface WindowState {
  id: string;
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  prevData: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

// Type for wallpaper keys
export type Wallpaper = 'teal' | 'clouds' | 'bricks' | 'green';

// Props for DraggableWindow
export interface DraggableWindowProps {
  window: WindowState;
  activeWindow: string | null;
  setActiveWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximizeWindow: (id: string) => void;
  updateWindowPos: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  playClickSound: () => void
}

// Props for DesktopIcon
export interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

// Props for the main Portfolio component
export interface Win98PortfolioProps {
  onShutdown: () => void;
}