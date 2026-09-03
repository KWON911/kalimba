# 17-Key Acoustic Kalimba Design

## Goal

Build a responsive React, Vite, and TypeScript web instrument that represents a 17-key C-major acoustic kalimba. It must prioritize immediate play response, stable multi-touch, keyboard chords, and an instrument-like visual treatment.

## Architecture

- `data/notes.ts` holds the 17 note definitions: physical order, display labels, keyboard keys, frequencies, sample locations, and tine length ratios.
- `hooks/useKalimbaAudio.ts` owns one lazily created `AudioContext`, a `Master GainNode`, preloaded decoded sample buffers, and oscillator fallback. Audio graph objects live in refs, not React state.
- `hooks/useKeyboardControls.ts` maps physical keydown/keyup events to notes, ignores key-repeat and text-entry targets, and permits concurrent keys.
- `hooks/useOrientation.ts` exposes whether a narrow device is in portrait orientation.
- `components/Kalimba.tsx` manages pointer-to-note tracking for multi-touch and slide play. `KalimbaKey.tsx` is an accessible visual tine. `Controls.tsx` contains volume, label mode, haptics, and fullscreen controls. `PortraitNotice.tsx` provides guidance without forcing rotation.
- `App.tsx` composes controls and instrument state. CSS provides the wood body, metal tines, responsive layout, feedback animations, and touch-safe playing surface.

## Interaction and Data Flow

1. A pointer, mouse, or mapped keyboard key starts a note immediately through `playNote`.
2. The audio hook resumes its context on that trusted user action, routes a new sample source or oscillator through the master gain, and allows overlapping sources.
3. UI active-note state updates after audio starts, so feedback never delays sound.
4. Pointer IDs are tracked independently. A move onto a new tine plays it once per pointer, allowing multi-touch and glissando behavior without repeated retriggers within the same key.
5. Keyup, pointerup, cancellation, or leaving the playing surface clears only the relevant active input state.

## Audio Failure Handling

- Each `/sounds/<NOTE>.wav` file is loaded independently during initialization.
- A missing, unreadable, or undecodable sample only affects that note; it uses a short, damped oscillator fallback.
- An unavailable `AudioContext`, unsupported fullscreen, or unavailable vibration API never crashes the UI.
- Playback falls back silently so the instrument remains usable in common desktop and mobile browsers.

## Responsive and Accessibility Behavior

- Landscape mobile is the primary layout. The body fits the viewport without performance-area scrolling and each tine has a generous interaction target.
- A narrow portrait device gets a Korean rotation notice; wider portrait screens continue to show the instrument.
- Keys have accessible labels and retain keyboard focus visibility. Controls use native labels and inputs.

## Verification

- Build with `npm run build`; run lint if supplied by the generated project.
- Manually verify all 17 keyboard mappings, held-key state, key repeat suppression, pointer play, simultaneous pointers, glissando, volume, labels, fullscreen fallback, and portrait notice.
- Confirm audio sample preloading errors do not prevent oscillator playback.

## Explicit Non-Goals

Song/practice modes, MIDI, recording, accounts, Supabase, uploaded scores, and auto-play are outside this version. The data and component boundaries will leave room to add them later.
