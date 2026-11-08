'use client'

import { useState, useEffect, useRef, useContext } from 'react'
import Vapi from '@vapi-ai/web'
import { CityCareCtx, type CityCarePersona } from './CityCareContext'
import { MicIcon, CloseIcon, SendIcon } from './Icons'

interface BotMessage {
  who: 'bot'
  text?: string
  kind?: 'chips' | 'appt'
  chips?: string[]
  appt?: {
    doctor: string
    dept: string
    when: string
    loc: string
    code: string
  }
}

interface UserMessage {
  who: 'user'
  text: string
}

type Message = BotMessage | UserMessage

export default function VoiceWidget() {
  const c = useContext(CityCareCtx) ?? {} as CityCarePersona
  const greeting = c.widgetGreeting ?? "Hello, I'm Alex — your voice assistant. I can help you book, cancel, or reschedule an appointment. How can I help?"
  const defaultStatus = c.widgetStatus ?? 'Online · responds in 1s'

  const [open, setOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const [typing, setTyping] = useState(false)
  const [statusText, setStatusText] = useState(defaultStatus)
  const [input, setInput] = useState('')
  const [showLabel, setShowLabel] = useState(true)
  const [thread, setThread] = useState<Message[]>([{ who: 'bot', text: greeting }])
  const scrollRef = useRef<HTMLDivElement>(null)
  const vapiRef = useRef<Vapi | null>(null)

  useEffect(() => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!)
    vapiRef.current = vapi

    vapi.on('call-start', () => setListening(true))
    vapi.on('call-end', () => {
      setListening(false)
      setTyping(false)
      setStatusText(defaultStatus)
    })
    vapi.on('speech-start', () => {
      setStatusText('Listening...')
      setTyping(false)
    })
    vapi.on('speech-end', () => {
      setStatusText('Thinking...')
      setTyping(true)
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vapi.on('message', (message: any) => {
      if (
        message.type === 'transcript' &&
        message.role === 'assistant' &&
        message.transcriptType === 'final'
      ) {
        setTyping(false)
        setThread((t) => [...t, { who: 'bot', text: message.transcript }])
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vapi.on('error', (error: any) => console.error(error))

    return () => {
      vapi.stop()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setThread([{ who: 'bot', text: greeting }])
  }, [greeting])

  useEffect(() => {
    const t = setTimeout(() => setShowLabel(false), 6000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [thread, typing])

  function toggleMic() {
    if (!listening) {
      vapiRef.current?.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!)
    } else {
      vapiRef.current?.stop()
    }
  }

  function sendToVapi(text: string) {
    vapiRef.current?.send({
      type: 'add-message',
      message: { role: 'user', content: text },
    })
  }

  function handleChip(label: string) {
    setThread((t) => [...t, { who: 'user', text: label }])
    sendToVapi(label)
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const v = input.trim()
    if (!v) return
    setInput('')
    setThread((t) => [...t, { who: 'user', text: v }])
    sendToVapi(v)
  }

  if (!open) {
    return (
      <>
        {showLabel && (
          <div className="voice-fab-label">
            <span className="dot"></span>
            {c.fabLabel ?? 'Talk to Alex — tap the mic'}
          </div>
        )}
        <button
          className="voice-fab"
          onClick={() => { setOpen(true); setShowLabel(false) }}
          aria-label="Open CityCare voice agent"
        >
          <span className="ring"></span>
          <span className="ring"></span>
          <span className="ring"></span>
          <MicIcon size={28} />
        </button>
      </>
    )
  }

  return (
    <div className="widget" role="dialog" aria-label="CityCare voice agent">
      <div className="w-head">
        <div className="w-avatar">A</div>
        <div>
          <div className="w-name">Alex</div>
          <div className="w-status">{statusText}</div>
        </div>
        <button className="w-close" onClick={() => setOpen(false)} aria-label="Close">
          <CloseIcon />
        </button>
      </div>

      <div className="w-body" ref={scrollRef}>
        {thread.map((m, i) => {
          if (m.who === 'bot' && m.kind === 'chips') {
            return (
              <div key={i} className="w-chips">
                {m.chips!.map((chip) => (
                  <button key={chip} className="chip" onClick={() => handleChip(chip)}>{chip}</button>
                ))}
              </div>
            )
          }
          if (m.who === 'bot' && m.kind === 'appt') {
            const a = m.appt!
            return (
              <div key={i} className="w-appt">
                <div className="w-appt-row"><span>Doctor</span><span>{a.doctor}</span></div>
                <div className="w-appt-row"><span>Department</span><span>{a.dept}</span></div>
                <div className="w-appt-row"><span>When</span><span>{a.when}</span></div>
                <div className="w-appt-row"><span>Where</span><span>{a.loc}</span></div>
                <div className="w-appt-row"><span>Code</span><span className="mono">{a.code}</span></div>
                <div className="w-appt-actions">
                  <button className="chip" onClick={() => handleChip('Reschedule this')}>Reschedule</button>
                  <button className="chip" onClick={() => handleChip('Cancel this')}>Cancel</button>
                  <button className="chip" onClick={() => handleChip('Send to WhatsApp')}>Send to WhatsApp</button>
                </div>
              </div>
            )
          }
          return (
            <div key={i} className={`w-bubble ${m.who}`}>{m.text}</div>
          )
        })}
        {typing && (
          <div className="typing"><i></i><i></i><i></i></div>
        )}
      </div>

      <div className="w-foot">
        <button className={`w-mic${listening ? ' listening' : ''}`} onClick={toggleMic} aria-label="Toggle microphone">
          <MicIcon size={22} />
        </button>
        {listening ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="w-wave">
              {Array.from({ length: 18 }).map((_, i) => {
                const h = 6 + Math.abs(Math.sin((i + 1) * 0.9)) * 26
                return (
                  <i key={i} style={{
                    height: `${h}px`,
                    animation: `bar ${0.6 + (i % 4) * 0.15}s ease-in-out infinite`,
                    animationDelay: `${i * 0.04}s`,
                  }}></i>
                )
              })}
            </div>
            <span className="w-listen-label">Listening · speak now</span>
          </div>
        ) : (
          <form className="w-input" onSubmit={handleSend} style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Or type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="w-send" type="submit" aria-label="Send"><SendIcon /></button>
          </form>
        )}
      </div>
    </div>
  )
}
