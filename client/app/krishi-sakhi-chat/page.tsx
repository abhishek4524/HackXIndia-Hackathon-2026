"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Send, RotateCw, Volume2, X, Play, User, Bot, Sparkles, ThumbsUp, ThumbsDown, MessageSquare, Zap } from "lucide-react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// framer-motion removed to simplify client runtime; using Tailwind/CSS instead
import { 
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn

 } from "@clerk/nextjs";

const quickQuestions = [
  { text: "मौसम की जानकारी", icon: "🌤️" },
  { text: "बीज उपचार विधि", icon: "🌱" },
  { text: "कृषि में नई तकनीक", icon: "🚜" },
  { text: "फसल सुरक्षा", icon: "🛡️" },
  { text: "मिट्टी परीक्षण कैसे करें?", icon: "🧪" },
  { text: "कृषि ऋण कैसे लें?", icon: "💰" },
  { text: "जैविक खाद बनाना", icon: "♻️" },
  { text: "सिंचाई के तरीके", icon: "💧" }
]

const conversationStarters = [
  "आज की कृषि टिप्स",
  "फसल रोगों की पहचान",
  "बाजार भाव जानें",
  "कीट नियंत्रण उपाय"
]

export default function KrishiSakhiChatPage() {
  const { t } = useLanguage()
  const { user } = useUser()
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `नमस्ते ${user?.firstName ? user.firstName : "किसान मित्र"}! मैं आपकी कृषि सखी हूं। आप आज किस बारे में जानना चाहती हैं?`,
      sender: "bot",
      timestamp: new Date(),
      isLiked: null
    }
  ])
  const [inputText, setInputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isTypingEffect, setIsTypingEffect] = useState(false)
  const [activeQuickQuestion, setActiveQuickQuestion] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.lang = 'hi-IN'
      recognitionRef.current.interimResults = true
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
      }
      
      recognitionRef.current.onend = () => {
        if (inputText.trim()) {
          handleSendMessage(inputText)
        }
        setIsListening(false)
      }
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
        if (event.error !== 'no-speech') {
          toast.error("Voice recognition failed. Please try again.")
        }
      }
    }

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

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleVoiceInput = () => {
    if (!isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        toast.info("Listening... Speak now")
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

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText
    if (messageText.trim() !== "") {
      const newMessage = {
        id: messages.length + 1,
        text: messageText,
        sender: "user",
        timestamp: new Date(),
        isLiked: null
      }
      setMessages(prev => [...prev, newMessage])
      if (!text) setInputText("")
      getBotResponse(newMessage.text)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'hi-IN'
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1
      
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
    setIsTypingEffect(true)
    
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
            { 
              role: "system", 
              content: `You are Krishi Sakhi, an agriculture assistant for Indian farmers. 
                        User's name is ${user?.firstName || "Farmer Friend"}. 
                        Answer in simple, clear Hindi with regional relevance. 
                        Keep responses practical, actionable, and empathetic. 
                        Add emojis where appropriate.`
            },
            { role: "user", content: userMessage }
          ],
          model: "openai/gpt-4o-mini",
          temperature: 0.7
        })
      })
      
      if (!response.ok) throw new Error("API error: " + response.status)
      const data = await response.json()
      
      setTimeout(() => {
        const botText = data.choices?.[0]?.message?.content || "माफ़ कीजिए, मुझे उत्तर नहीं मिला। कृपया पुनः प्रयास करें। 🌱"
        const botMessage = {
          id: messages.length + 2,
          text: botText,
          sender: "bot",
          timestamp: new Date(),
          isLiked: null
        }
        setMessages(prev => [...prev, botMessage])
        setIsTypingEffect(false)
        
        // Auto-speak for short to medium responses
        if (botText.length < 500) {
          speakText(botText)
        }
      }, 1500)
      
    } catch (err) {
      console.error("API Error:", err)
      const botMessage = {
        id: messages.length + 2,
        text: "माफ़ कीजिए, सर्वर से उत्तर नहीं मिला। कृपया बाद में पुनः प्रयास करें। 📡",
        sender: "bot",
        timestamp: new Date(),
        isLiked: null
      }
      setMessages(prev => [...prev, botMessage])
      setIsTypingEffect(false)
    } finally {
      setTimeout(() => setIsProcessing(false), 1500)
    }
  }

  const handleQuickQuestion = (question: string, index: number) => {
    setActiveQuickQuestion(index)
    setTimeout(() => setActiveQuickQuestion(null), 1000)
    
    const newMessage = {
      id: messages.length + 1,
      text: question,
      sender: "user",
      timestamp: new Date(),
      isLiked: null
    }
    setMessages(prev => [...prev, newMessage])
    getBotResponse(newMessage.text)
  }

  const handleFeedback = (messageId: number, isLiked: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isLiked } : msg
    ))
    toast.success("Feedback recorded! धन्यवाद 🙏")
  }

  const clearChat = () => {
    setMessages([{
      id: 1,
      text: `नमस्ते ${user?.firstName ? user.firstName : "किसान मित्र"}! चर्चा फिर से शुरू करें। कैसे मदद कर सकती हूं? 🌟`,
      sender: "bot",
      timestamp: new Date(),
      isLiked: null
    }])
    toast.info("Chat cleared")
  }

  return (
    <ClerkProvider>
    <LayoutWrapper>
        <SignedOut>
            <div className="w-full h-screen flex justify-center items-center">  
            <SignIn/>
            </div>
        </SignedOut>
    <SignedIn>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Animated Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                {t("home.hero.title")}
              </h1>
            </div>
            <p className="text-green-600 text-lg max-w-2xl mx-auto">
              {t("home.hero.subtitle")} - आपकी डिजिटल कृषि सहयोगी 🤝
            </p>
          </div>

          {/* User Info Card */}
          {user && (
            <div className="mb-8 max-w-md mx-auto">
              <Card className="bg-gradient-to-r from-green-100 to-amber-100 border-green-200 shadow-md">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-green-500">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback className="bg-green-500 text-white">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-green-800">
                      {user.fullName || "किसान मित्र"}
                    </h3>
                    <p className="text-sm text-green-600">Welcome back! आज क्या जानना चाहेंगे? 🌾</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Voice Button with Animation */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative">
              {isListening && (
                <div className="absolute inset-0 animate-ping bg-green-400 rounded-full opacity-75"></div>
              )}
              <Button
                onClick={handleVoiceInput}
                disabled={isProcessing}
                size="lg"
                className={`relative rounded-full p-10 h-auto shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                    isListening 
                    ? "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse" 
                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                }`}
              >
                <div className="flex flex-col items-center">
                  {isListening ? (
                    <>
                      <X className="w-14 h-14 mb-2" />
                      <span className="text-lg font-bold">Stop Listening</span>
                    </>
                  ) : (
                      <>
                      <Mic className="w-14 h-14 mb-2" />
                      <span className="text-lg font-bold">{t("dashboard.voiceButton")}</span>
                    </>
                  )}
                </div>
              </Button>
            </div>
            
            {/* Voice Status */}
              {isListening && (
                <div className="mt-4 text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl shadow-sm">
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-6 bg-green-500 rounded-full animate-wave"></div>
                      <div className="w-2 h-4 bg-green-500 rounded-full animate-wave" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-8 bg-green-500 rounded-full animate-wave" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="text-green-700 font-semibold">Listening... Speak your question now 🎤</p>
                  </div>
                  <style jsx>{`
                    @keyframes wave {
                        0%, 100% { transform: scaleY(1); }
                        50% { transform: scaleY(1.5); }
                        }
                        .animate-wave {
                            animation: wave 1s ease-in-out infinite;
                            }
                            `}</style>
                </div>
              )}

            {/* Audio Control */}
            {isSpeaking && (
              <div className="mt-4">
                <Button
                  onClick={stopSpeaking}
                  className="rounded-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
                  >
                  <X className="w-5 h-5 mr-2" />
                  Stop Audio
                </Button>
              </div>
            )}
          </div>

          {/* Quick Questions Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-bold text-green-800">
                {t("krishiSakhiChat.quickQuestions")}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickQuestions.map((question, index) => (
                <div key={index} className="transform transition-transform duration-150 hover:scale-105 active:scale-95">
                  <Badge
                    variant="outline"
                    className={`w-full h-full py-3 px-4 cursor-pointer transition-all duration-300 text-center text-sm ${
                        activeQuickQuestion === index
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent shadow-lg"
                        : "bg-white/80 hover:bg-green-50 text-green-800 border-green-200 shadow-sm"
                    }`}
                    onClick={() => handleQuickQuestion(question.text, index)}
                    >
                    <span className="mr-2">{question.icon}</span>
                    {question.text}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Starters */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-green-700 mb-3 text-center">Start a conversation 💬</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {conversationStarters.map((starter, index) => (
                <Badge
                key={index}
                variant="secondary"
                className="bg-amber-100 text-amber-800 hover:bg-amber-200 px-4 py-2 cursor-pointer rounded-full border-amber-200"
                onClick={() => handleQuickQuestion(starter, -1)}
                >
                  {starter}
                </Badge>
              ))}
            </div>
          </div>

          {/* Main Chat Container */}
          <div>
            <Card className="w-full shadow-2xl border-green-300 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      <Bot className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-green-800 text-xl">
                        {t("krishiSakhiChat.chatTitle")}
                      </CardTitle>
                      <p className="text-sm text-green-600">
                        Your AI Agriculture Assistant
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSpeaking && (
                      <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                        <Play className="h-3 w-3 mr-1 animate-pulse" />
                        <span className="text-xs font-medium">Playing</span>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearChat}
                      className="text-green-700 border-green-300 hover:bg-green-50"
                      >
                      Clear Chat
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Chat Messages */}
                <div className="h-[400px] overflow-y-auto p-6 bg-gradient-to-b from-white to-green-50/50">
                    {messages.map((message) => (
                      <div
                      key={message.id + '-' + message.timestamp.getTime()}
                      className={`flex mb-6 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className="max-w-[80%]">
                          <div className={`flex items-start gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                            {/* Avatar */}
                            <Avatar className={`h-8 w-8 ${message.sender === "user" ? "bg-green-500" : "bg-emerald-500"}`}>
                              <AvatarFallback className="text-white">
                                {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                            
                            {/* Message Bubble */}
                            <div className={`relative rounded-2xl p-4 shadow-sm ${
                                message.sender === "user"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-tr-none"
                                : "bg-white border border-green-100 text-gray-800 rounded-tl-none shadow-sm"
                            }`}>
                              {/* Message Text */}
                              <p className="whitespace-pre-wrap">{message.text}</p>
                              
                              {/* Timestamp */}
                              <div className={`flex items-center justify-between mt-3 text-xs ${
                                  message.sender === "user" ? "text-green-100" : "text-gray-500"
                                }`}>
                                <span>
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                
                                {/* Feedback Buttons for Bot Messages */}
                                {message.sender === "bot" && (
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className={`h-6 w-6 ${message.isLiked === true ? 'text-green-600 bg-green-100' : 'hover:text-green-600'}`}
                                      onClick={() => handleFeedback(message.id, true)}
                                    >
                                      <ThumbsUp className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className={`h-6 w-6 ${message.isLiked === false ? 'text-red-600 bg-red-100' : 'hover:text-red-600'}`}
                                      onClick={() => handleFeedback(message.id, false)}
                                      >
                                      <ThumbsDown className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 hover:text-blue-600"
                                      onClick={() => speakText(message.text)}
                                      >
                                      <Volume2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* Typing Indicator */}
                    {isTypingEffect && (
                      <div className="flex justify-start mb-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-emerald-500">
                          <Bot className="h-4 w-4 text-white" />
                        </Avatar>
                        <div className="bg-white border border-green-100 rounded-2xl rounded-tl-none p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-green-700 font-medium">
                              Krishi Sakhi लिख रही हैं...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-green-200 p-4 bg-gradient-to-r from-green-50 to-white">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t("krishiSakhiChat.inputPlaceholder") + " या माइक पर क्लिक करें..."}
                      className="flex-1 border border-green-300 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm bg-white"
                      disabled={isProcessing}
                      />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleVoiceInput}
                        size="icon"
                        className={`rounded-full h-12 w-12 ${
                            isListening 
                            ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                            : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        }`}
                        >
                        <Mic className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={() => handleSendMessage()}
                        disabled={isProcessing || inputText.trim() === ""}
                        className="rounded-full h-12 w-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
                        >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-green-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Tip: Press Enter to send
                      </span>
                      <span className="flex items-center gap-1">
                        <Volume2 className="h-3 w-3" />
                        Click speaker icon to replay audio
                      </span>
                    </div>
                    <span>{messages.length} messages</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips & Features */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Mic className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-800">Voice Commands</h4>
                </div>
                <p className="text-sm text-green-700">
                  Try saying: "धान की फसल में कौन सी खाद डालनी चाहिए?" or "मौसम कैसा रहेगा कल?"
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-amber-800">Smart Features</h4>
                </div>
                <p className="text-sm text-amber-700">
                  Get personalized advice, weather updates, crop protection tips, and market prices
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <ThumbsUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-800">Feedback System</h4>
                </div>
                <p className="text-sm text-emerald-700">
                  Rate responses to help improve Krishi Sakhi's accuracy and relevance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
              </SignedIn>
    </LayoutWrapper>
              </ClerkProvider>
  )
}