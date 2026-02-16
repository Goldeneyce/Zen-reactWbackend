// components/VisualEditingWrapper.tsx
"use client";

import { VisualEditing } from "next-sanity/visual-editing";

/**
 * Renders the Sanity VisualEditing overlay.
 * This component is only mounted when Next.js draftMode is enabled
 * (see root layout).
 */
export default function VisualEditingWrapper() {
  return <VisualEditing />;
}
