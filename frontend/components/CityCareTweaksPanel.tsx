'use client'

import { TweaksPanel, TweakSection, TweakSelect, TweakRadio } from './TweaksPanel'
import { CITYCARE_PERSONAS, CITYCARE_MOODS } from './CityCareContext'

interface CityCareTweaks {
  mood: string
  persona: string
  display: string
  [key: string]: unknown
}

interface CityCareTweaksPanelProps {
  t: CityCareTweaks
  setTweak: (key: string, value: string) => void
}

function MoodSwatches({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="mood-grid">
      {CITYCARE_MOODS.map((m) => (
        <button
          key={m.id}
          type="button"
          className="mood-tile"
          data-on={value === m.id ? '1' : '0'}
          onClick={() => onChange(m.id)}
          style={{
            background: m.bg,
            color: m.fg || '#29261b',
            ['--tile-bg' as string]: m.bg,
          }}
        >
          <span className="mood-swatch" style={{ background: m.accent }}>
            <i style={{ background: m.fg || '#29261b' }} />
          </span>
          {m.label}
        </button>
      ))}
    </div>
  )
}

function PersonaPreview({ persona }: { persona: string }) {
  const p = CITYCARE_PERSONAS[persona]
  if (!p) return null
  return (
    <div className="persona-card">
      <em>{persona}</em>
      <div style={{ marginBottom: 6, color: 'rgba(41,38,27,0.7)' }}>{p.sample}</div>
      <div style={{ fontStyle: 'italic', color: 'rgba(41,38,27,0.95)' }}>
        &ldquo;{(p.widgetGreeting ?? '').split('—')[0].trim().replace(/[.,;]$/, '')}&hellip;&rdquo;
      </div>
    </div>
  )
}

function DisplayPreview() {
  return (
    <div className="display-preview">
      A <em>single</em> call.
    </div>
  )
}

export default function CityCareTweaksPanel({ t, setTweak }: CityCareTweaksPanelProps) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Mood" />
      <MoodSwatches value={t.mood} onChange={(v) => setTweak('mood', v)} />

      <TweakSection label="Voice persona" />
      <TweakSelect
        label="Style"
        value={t.persona}
        options={[
          { value: 'receptionist', label: 'Receptionist' },
        ]}
        onChange={(v) => setTweak('persona', v)}
      />
      <PersonaPreview persona={t.persona} />

      <TweakSection label="Display type" />
      <TweakRadio
        label="Style"
        value={t.display}
        options={[
          { value: 'editorial',  label: 'Editorial' },
          { value: 'humanist',   label: 'Humanist' },
          { value: 'modernist',  label: 'Modernist' },
        ]}
        onChange={(v) => setTweak('display', String(v))}
      />
      <DisplayPreview />
    </TweaksPanel>
  )
}
