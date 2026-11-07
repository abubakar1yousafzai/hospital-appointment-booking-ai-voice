'use client'

import { useEffect } from 'react'
import { CityCareCtx, CITYCARE_PERSONAS } from '@/components/CityCareContext'
import { useTweaks } from '@/components/TweaksPanel'
// import TopBar from '@/components/TopBar'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Capabilities from '@/components/Capabilities'
import Stats from '@/components/Stats'
import How from '@/components/How'
import Departments from '@/components/Departments'
import Stories from '@/components/Stories'
import CtaBand from '@/components/CtaBand'
import Footer from '@/components/Footer'
import VoiceWidget from '@/components/VoiceWidget'
import CityCareTweaksPanel from '@/components/CityCareTweaksPanel'
import ScrollReveal from '@/components/ScrollReveal'

const TWEAK_DEFAULTS = {
  mood: 'clinical',
  persona: 'receptionist',
  display: 'editorial',
}

export default function Page() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS)

  useEffect(() => {
    document.documentElement.setAttribute('data-mood', t.mood as string)
  }, [t.mood])

  useEffect(() => {
    document.documentElement.setAttribute('data-display', t.display as string)
  }, [t.display])

  const content = CITYCARE_PERSONAS[t.persona as string] || CITYCARE_PERSONAS.receptionist

  return (
    <CityCareCtx.Provider value={content}>
      <Nav />
      <Hero />
      <ScrollReveal><Capabilities /></ScrollReveal>
      <ScrollReveal><Stats /></ScrollReveal>
      <ScrollReveal><How /></ScrollReveal>
      <ScrollReveal><Departments /></ScrollReveal>
      <ScrollReveal><Stories /></ScrollReveal>
      <ScrollReveal><CtaBand /></ScrollReveal>
      <Footer />
      <VoiceWidget />
      <CityCareTweaksPanel t={t} setTweak={(key, val) => setTweak(key as keyof typeof TWEAK_DEFAULTS, val)} />
    </CityCareCtx.Provider>
  )
}
