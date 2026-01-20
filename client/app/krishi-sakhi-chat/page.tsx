"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Send, RotateCw, Volume2, X, Play } from "lucide-react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"



const quickQuestions = [
  "मौसम की जानकारी",
  "बीज उपचार विधि",
  "कृषि में नई तकनीक",
  "फसल सुरक्षा",
  "मिट्टी परीक्षण कैसे करें?",
  "कृषि ऋण कैसे लें?"
]

export default function KrishiSakhiChatPage() {
  const { t } = useLanguage()
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "नमस्ते! मैं आपकी कृषि सखी हूं। आप आज किस बारे में जानना चाहती हैं?",
      sender: "bot",
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.lang = 'hi-IN' // Hindi language
      recognitionRef.current.interimResults = false
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        handleSendMessage(transcript)
      }
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
        toast.error("Voice recognition failed. Please try again.")
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    } else {
      console.warn('Speech Recognition API not supported in this browser')
    }

    // Clean up on component unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthesisRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Only scroll to bottom if messages length increases (not on initial mount)
  const prevMessagesLength = useRef(messages.length)
  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      scrollToBottom()
    }
    prevMessagesLength.current = messages.length
  }, [messages])

  const handleVoiceInput = () => {
    if (!isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error('Error starting voice recognition:', error)
        toast.error("Cannot start voice recognition. Please check permissions.")
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsListening(false)
    }
  }

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
  }

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText
    if (messageText.trim() !== "") {
      const newMessage = {
        id: messages.length + 1,
        text: messageText,
        sender: "user",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, newMessage])
      if (!text) setInputText("") // Only clear if it was from text input
      getBotResponse(newMessage.text)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'hi-IN' // Hindi language
      utterance.rate = 0.9 // Slightly slower for better comprehension
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      synthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const getBotResponse = async (userMessage: string) => {
    setIsProcessing(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_OPENAI_API_URL 
      const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are Krishi Sakhi, an agriculture assistant for Indian farmers. Answer in simple, clear Hindi. Keep responses concise but helpful." },
            { role: "user", content: userMessage }
          ],
          model: "openai/gpt-4o-mini"
        })
      })
      if (!response.ok) throw new Error("API error: " + response.status)
      const data = await response.json()
      const botText = data.choices?.[0]?.message?.content || "माफ़ कीजिए, मुझे उत्तर नहीं मिला।"
      const botMessage = {
        id: messages.length + 2,
        text: botText,
        sender: "bot",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      
      // Speak the bot response
      speakText(botText)
    } catch (err) {
      console.error("API Error:", err)
      const botMessage = {
        id: messages.length + 2,
        text: "माफ़ कीजिए, सर्वर से उत्तर नहीं मिला। कृपया बाद में पुनः प्रयास करें।",
        sender: "bot",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    const newMessage = {
      id: messages.length + 1,
      text: question,
      sender: "user",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    getBotResponse(newMessage.text)
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
              {t("home.hero.title")}
            </h1>
            <p className="text-green-600">
              {t("home.hero.subtitle")}
            </p>
          </div>

          {/* Voice Button */}
          <div className="flex justify-center mb-8 gap-4">
            <Button
              onClick={handleVoiceInput}
              disabled={isProcessing}
              size="lg"
              className={`rounded-full p-8 h-auto ${isListening 
                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                : "bg-green-600 hover:bg-green-700"
              } text-white shadow-xl transition-all`}
            >
              {isListening ? (
                <div className="flex flex-col items-center">
                  <X className="w-12 h-12 mb-2" />
                  <span className="text-lg font-semibold">{t("dashboard.stopButton")}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Mic className="w-12 h-12 mb-2" />
                  <span className="text-lg font-semibold">
                    {t("dashboard.voiceButton")}
                  </span>
                </div>
              )}
            </Button>
            
            {isSpeaking && (
              <Button
                onClick={stopSpeaking}
                size="lg"
                className="rounded-full p-8 h-auto bg-amber-500 hover:bg-amber-600 text-white shadow-xl transition-all"
              >
                <div className="flex flex-col items-center">
                  <X className="w-12 h-12 mb-2" />
                  <span className="text-lg font-semibold">Stop Audio</span>
                </div>
              </Button>
            )}
          </div>

          {/* Voice Status */}
          {isListening && (
            <div className="text-center mb-4 p-3 bg-green-100 rounded-lg animate-pulse">
              <p className="text-green-700 font-medium">Listening... Speak now</p>
            </div>
          )}

          {/* Quick Questions */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-green-700 mb-3 text-center">
              {t("krishiSakhiChat.quickQuestions")}
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {quickQuestions.map((question, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 cursor-pointer"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>

          {/* Chat Container */}
          <Card className="w-full shadow-lg border-green-200">
            <CardHeader className="bg-green-100 py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-green-800 text-lg">
                {t("krishiSakhiChat.chatTitle")}
              </CardTitle>
              {isSpeaking && (
                <div className="flex items-center text-amber-600">
                  <Play className="h-4 w-4 mr-1" />
                  <span className="text-sm">Playing</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-4 bg-white">
                {messages.map((message) => (
                  <div
                    key={message.id + '-' + message.timestamp.getTime()}
                    className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-green-100 text-green-900 rounded-br-none"
                          : "bg-gray-100 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.sender === "bot" && (
                          <Volume2 className="h-4 w-4 mr-1 text-green-600" />
                        )}
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {message.text}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-gray-100 text-gray-900 rounded-lg rounded-bl-none p-3 max-w-xs">
                      <div className="flex items-center">
                        <RotateCw className="h-4 w-4 mr-2 animate-spin text-green-600" />
                        <span className="text-sm">टाइपिंग...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-green-200 p-3 bg-white rounded-b-lg">
                <div className="flex items-center">
                  <input
                    ref={inputRef}
                    value={inputText}
                    onChange={handleTextInput}
                    onKeyPress={handleKeyPress}
                    placeholder={t("krishiSakhiChat.inputPlaceholder")}
                    className="flex-1 border border-green-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={isProcessing || inputText.trim() === ""}
                    className="rounded-l-none rounded-r-lg py-2 px-4 bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <div className="mt-6 text-center text-sm text-green-600">
            <p>{t("krishiSakhiChat.tips")}</p>
            <p className="mt-2">Try saying: "धान की फसल में कौन सी खाद डालनी चाहिए?" or "मौसम कैसा रहेगा?"</p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}