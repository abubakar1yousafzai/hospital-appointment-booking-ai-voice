'use client'

import { createContext } from 'react'
import type { ReactNode } from 'react'

export interface CityCarePersona {
  cta: string
  heroEyebrow: string
  heroH1?: () => ReactNode
  heroLede: string
  capEyebrow?: string
  capH2?: () => ReactNode
  capDesc?: string
  widgetGreeting?: string
  widgetStatus?: string
  fabLabel?: string
  sampleHeadline?: () => ReactNode
  sample?: string
}

export interface CityCareMood {
  id: string
  label: string
  bg: string
  accent: string
  fg?: string
}

export const CityCareCtx = createContext<CityCarePersona | null>(null)

export const CITYCARE_PERSONAS: Record<string, CityCarePersona> = {
  receptionist: {
    cta: 'Talk to Alex',
    heroEyebrow: 'Voice agent · for SmartCare Hospital',
    heroH1: () => (
      <>Book a doctor.<br /><em>Just by speaking.</em></>
    ),
    heroLede: 'Meet Alex — the voice receptionist that books, reschedules and cancels appointments across 3 departments. No app. No waiting. Just speak — in English',
    capEyebrow: 'What Alex can do',
    capH2: () => (<>Four jobs<br />your <em>receptionist</em> never sleeps through.</>),
    capDesc: 'CityCare handles the predictable, repetitive calls — so your front desk can focus on the patients standing in front of them. Every call is logged, transcribed, and audit-trail ready.',
    widgetGreeting: "Hello, I'm Alex — your voice assistant. I can help you book, cancel, or reschedule an appointment. How can I help?",
    widgetStatus: 'Online · responds in 1s',
    fabLabel: 'Talk to Alex — tap the mic',
    sampleHeadline: () => (<>The <em>single</em> phone call.</>),
    sample: 'Brisk. Professional. Front-desk efficient.',
  },

}

export const CITYCARE_MOODS: CityCareMood[] = [
  { id: 'apothecary', label: 'Apothecary', bg: '#F6F4EE', accent: '#178F8B' },
  { id: 'midnight',   label: 'Midnight',   bg: '#0E1A1A', accent: '#5EE3C2', fg: '#ECF2EF' },
  { id: 'clinical',   label: 'Clinical',   bg: '#F1F4F9', accent: '#1E4FE0' },
  { id: 'bedside',    label: 'Bedside',    bg: '#F7EDE6', accent: '#9E2A4A' },
]
