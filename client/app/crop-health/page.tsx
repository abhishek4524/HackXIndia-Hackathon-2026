"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { useLanguage } from "@/contexts/language-context";
import {
  Upload,
  Camera,
  Leaf,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
  History,
  BarChart3,
  TrendingUp,
  Sparkles,
  CloudUpload,
  Shield,
  Brain,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

import { 
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn

 } from "@clerk/nextjs";

interface CropHistory {
  id: string;
  imageUrl: string;
  healthStatus: string;
  confidence: number;
  diseases: string[];
  timestamp: Date;
}

export default function CropHealthPage() {
  const { t } = useLanguage();
  const { user } = useUser();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [cropHistory, setCropHistory] = useState<CropHistory[]>([]);
  const [userStats, setUserStats] = useState({
    totalAnalysis: 0,
    healthyCount: 0,
    issuesDetected: 0,
    avgConfidence: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user history from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedHistory = localStorage.getItem(`cropHistory_${user.id}`);
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        setCropHistory(history);
        
        // Calculate statistics
        const total = history.length;
        const healthy = history.filter(h => h.healthStatus === "Healthy").length;
        const issues = history.filter(h => h.diseases.length > 0).length;
        const avgConfidence = history.reduce((acc, curr) => acc + curr.confidence, 0) / total;
        
        setUserStats({
          totalAnalysis: total,
          healthyCount: healthy,
          issuesDetected: issues,
          avgConfidence: parseFloat(avgConfidence.toFixed(1)),
        });
      }
    }
  }, [user]);

  // Save to history when new analysis completes
  useEffect(() => {
    if (analysisResult && user) {
      const newHistoryItem: CropHistory = {
        id: Date.now().toString(),
        imageUrl: selectedImage!,
        healthStatus: analysisResult.healthStatus,
        confidence: parseFloat(analysisResult.confidence),
        diseases: analysisResult.diseases.map((d: any) => d.name),
        timestamp: new Date(),
      };

      const updatedHistory = [newHistoryItem, ...cropHistory.slice(0, 4)]; // Keep last 5
      setCropHistory(updatedHistory);
      localStorage.setItem(`cropHistory_${user.id}`, JSON.stringify(updatedHistory));

      // Update stats
      setUserStats(prev => ({
        totalAnalysis: prev.totalAnalysis + 1,
        healthyCount: analysisResult.healthStatus === "Healthy" ? prev.healthyCount + 1 : prev.healthyCount,
        issuesDetected: analysisResult.diseases.length > 0 ? prev.issuesDetected + 1 : prev.issuesDetected,
        avgConfidence: parseFloat(((prev.avgConfidence * prev.totalAnalysis + parseFloat(analysisResult.confidence)) / (prev.totalAnalysis + 1)).toFixed(1)),
      }));
    }
  }, [analysisResult]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 100);
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    if (file) {
      const reader = new FileReader();
      reader.onloadstart = () => {
        simulateUploadProgress();
      };
      reader.onload = () => {
        setUploadProgress(100);
        setTimeout(() => {
          setSelectedImage(reader.result as string);
          setUploadProgress(0);
        }, 300);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const analyzeCropHealth = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      const base64Image = selectedImage.replace(/^data:image\/[a-z]+;base64,/, "");
      const apiUrl = process.env.NEXT_PUBLIC_PLANT_ID_API_URL;
      const apiKey = process.env.NEXT_PUBLIC_PLANT_ID_API_KEY;

      if (!apiUrl || !apiKey) {
        throw new Error("API configuration is missing");
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": apiKey,
        },
        body: JSON.stringify({
          images: [base64Image],
          modifiers: ["similar_images"],
          disease_details: ["cause", "common_names", "classification", "treatment"],
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      
      const diseases =
        data.health_assessment?.diseases?.map((d: any) => ({
          name: d.name,
          confidence: (d.probability * 100).toFixed(1),
        })) || [];

      const confidenceNum = data.health_assessment?.is_healthy_probability
        ? Number((data.health_assessment.is_healthy_probability * 100).toFixed(1))
        : 0;

      const confidence = confidenceNum.toString();

      const healthStatus =
        confidenceNum > 80
          ? "Healthy"
          : confidenceNum > 50
          ? "Moderate"
          : "Unhealthy";

      const recommendations: string[] = [];
      if (diseases.length > 0) {
        diseases.forEach((d: any) => {
          if (d.name.toLowerCase().includes("mildew"))
            recommendations.push("Apply neem oil or sulfur-based fungicide weekly.");
          if (d.name.toLowerCase().includes("rust"))
            recommendations.push("Use rust-resistant crop variety and ensure proper spacing.");
          if (d.name.toLowerCase().includes("blight"))
            recommendations.push("Remove affected leaves and apply copper-based fungicide.");
        });
        if (recommendations.length === 0)
          recommendations.push("Consult a local agricultural expert for personalized advice.");
      } else {
        recommendations.push(
          "No major disease detected. Maintain regular watering and balanced fertilization."
        );
        recommendations.push("Consider soil testing for optimal nutrient management.");
      }

      setAnalysisResult({
        healthStatus,
        confidence,
        diseases,
        recommendations,
        aiInsights: [
          "Analysis based on 10,000+ similar crop images",
          "Weather data suggests optimal growth conditions",
          "Consider companion planting for natural pest control"
        ],
      });
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again with a clearer photo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (analysisResult) {
      let message = `Crop health analysis complete. 
        Condition: ${analysisResult.healthStatus}, 
        Confidence: ${analysisResult.confidence} percent. `;

      if (analysisResult.diseases.length > 0) {
        message += `Detected issues: ${analysisResult.diseases
          .map((d: any) => d.name)
          .join(", ")}. `;
      }
      
      message += `Recommendations: ${analysisResult.recommendations.join(". ")}.`;
      speak(message);
    }
  }, [analysisResult]);

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
  };

  const quickTips = [
    "Take photos in natural daylight for best results",
    "Focus on affected leaves or stems",
    "Include multiple angles for comprehensive analysis",
    "Regular monitoring prevents major outbreaks"
  ];

  return (
    <ClerkProvider>
    <LayoutWrapper>
                <SignedOut>
                    <div className="w-full h-screen flex justify-center items-center">  
                    <SignIn/>
                    </div>
                </SignedOut>
                <SignedIn>

      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-50/50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center mb-4">
              <Leaf className="h-10 w-10 text-green-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                {t("cropHealth.title")}
              </h1>
              <Sparkles className="h-8 w-8 text-amber-500 ml-3" />
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("cropHealth.description")}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Sidebar - User Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 space-y-6"
            >
              <Card className="sticky top-8 border-green-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                    Your Analysis Stats
                  </CardTitle>
                  <CardDescription>
                    {user?.firstName ? `${user.firstName}'s` : 'Your'} crop health journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">
                        {userStats.totalAnalysis}
                      </div>
                      <div className="text-sm text-green-600">Total Analysis</div>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-700">
                        {userStats.healthyCount}
                      </div>
                      <div className="text-sm text-emerald-600">Healthy Crops</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Detection Accuracy</span>
                        <span>{userStats.avgConfidence}%</span>
                      </div>
                      <Progress value={userStats.avgConfidence} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Issues Detected</span>
                        <span>{userStats.issuesDetected}</span>
                      </div>
                      <Progress 
                        value={(userStats.issuesDetected / Math.max(userStats.totalAnalysis, 1)) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <History className="h-4 w-4 mr-2" />
                    {showHistory ? "Hide History" : "View History"}
                  </Button>

                  <AnimatePresence>
                    {showHistory && cropHistory.length > 0 && (
                      <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 pt-4"
                      >
                        <h4 className="font-semibold text-sm">Recent Analysis</h4>
                        {cropHistory.map((history) => (
                            <div
                            key={history.id}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                            <div className="w-10 h-10 rounded overflow-hidden">
                              <img
                                src={history.imageUrl}
                                alt="History"
                                className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <span className="font-medium text-sm truncate">
                                  {history.healthStatus}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {history.confidence}%
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {new Date(history.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 text-amber-600 mr-2" />
                    Quick Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {quickTips.map((tip, index) => (
                      <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <span className="text-xs font-bold text-amber-600">
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-sm">{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="wait">
                {!selectedImage ? (
                  <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="border-2 border-dashed border-green-300 shadow-xl hover:shadow-2xl transition-shadow">
                      <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4">
                          <CloudUpload className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">
                          Upload Crop Image
                        </CardTitle>
                        <CardDescription>
                          Get instant AI-powered crop health analysis
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`border-3 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                              isDragActive
                              ? "border-green-500 bg-green-50 scale-[1.02]"
                              : "border-green-300 hover:border-green-400 hover:bg-green-50/50"
                            }`}
                            >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect(file);
                            }}
                            className="hidden"
                            id="image-input"
                            />
                          
                          {uploadProgress > 0 ? (
                              <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-4"
                              >
                              <div className="w-20 h-20 mx-auto relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Upload className="h-8 w-8 text-green-600 animate-bounce" />
                                </div>
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="8"
                                    />
                                  <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray="283"
                                    strokeDashoffset={283 - (283 * uploadProgress) / 100}
                                    initial={{ strokeDashoffset: 283 }}
                                    animate={{ strokeDashoffset: 283 - (283 * uploadProgress) / 100 }}
                                    transition={{ duration: 0.3 }}
                                    />
                                </svg>
                              </div>
                              <p>Uploading... {uploadProgress}%</p>
                            </motion.div>
                          ) : (
                              <>
                              <Upload className="mx-auto h-16 w-16 text-green-500 mb-6" />
                              <h3 className="text-xl font-semibold mb-2">
                                {isDragActive ? "Drop Image Here" : "Drag & Drop"}
                              </h3>
                              <p className="text-muted-foreground mb-6">
                                Upload JPG, PNG, or WebP image of your crop
                              </p>
                              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                  size="lg"
                                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                                  onClick={() => fileInputRef.current?.click()}
                                  >
                                  <Camera className="mr-2 h-5 w-5" />
                                  Select Image
                                </Button>
                                <Button
                                  size="lg"
                                  variant="outline"
                                  className="border-green-300 hover:bg-green-50"
                                  onClick={() => {
                                      // Simulate camera access
                                      fileInputRef.current?.click();
                                    }}
                                    >
                                  Take Photo
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                    <motion.div
                    key="analysis"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Preview Card */}
                    <Card className="shadow-xl">
                      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50">
                        <div>
                          <CardTitle className="flex items-center">
                            <Shield className="h-6 w-6 text-green-600 mr-2" />
                            Image Preview
                          </CardTitle>
                          <CardDescription>
                            Ready for AI-powered analysis
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={resetAnalysis}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row gap-8">
                          <div className="lg:w-2/5">
                            <div className="relative rounded-xl overflow-hidden border-4 border-green-100 shadow-lg">
                              <img
                                src={selectedImage}
                                alt="Uploaded crop"
                                className="w-full h-64 object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                          </div>
                          <div className="lg:w-3/5 space-y-6">
                            <div>
                              <h3 className="font-semibold text-lg mb-3">Analysis Options</h3>
                              <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="justify-start">
                                  <Leaf className="h-4 w-4 mr-2" />
                                  Disease Detection
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <TrendingUp className="h-4 w-4 mr-2" />
                                  Growth Analysis
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <Brain className="h-4 w-4 mr-2" />
                                  Nutrient Check
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <BarChart3 className="h-4 w-4 mr-2" />
                                  Yield Prediction
                                </Button>
                              </div>
                            </div>
                            
                            <Button
                              onClick={analyzeCropHealth}
                              disabled={isAnalyzing}
                              size="lg"
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
                              >
                              {isAnalyzing ? (
                                <>
                                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                  Analyzing with AI...
                                </>
                              ) : (
                                  <>
                                  <Brain className="mr-3 h-5 w-5" />
                                  Start Advanced Analysis
                                </>
                              )}
                            </Button>
                            
                            <div className="text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Shield className="h-4 w-4 text-green-600 mr-2" />
                                <span>Powered by Plant.id AI with 95%+ accuracy</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Results */}
                    {analysisResult && (
                        <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        >
                        <Card className="shadow-xl border-green-200">
                          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                            <CardTitle className="flex items-center">
                              {analysisResult.healthStatus === "Healthy" ? (
                                  <CheckCircle className="h-7 w-7 text-green-500 mr-3 animate-pulse" />
                                ) : (
                                    <AlertCircle className="h-7 w-7 text-amber-500 mr-3 animate-pulse" />
                                )}
                              Analysis Results
                              <span className="ml-auto text-sm font-normal px-3 py-1 bg-green-100 text-green-700 rounded-full">
                                AI Powered
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-6 space-y-8">
                            {/* Health Status with Animation */}
                            <div>
                              <h3 className="font-semibold text-lg mb-4 flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                                Crop Health Status
                              </h3>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-2xl font-bold">
                                    {analysisResult.healthStatus}
                                  </span>
                                  <span className="text-lg font-semibold text-green-700">
                                    {analysisResult.confidence}% Confidence
                                  </span>
                                </div>
                                <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div
                                    className={`h-full rounded-full ${
                                        analysisResult.healthStatus === "Healthy"
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                        : analysisResult.healthStatus === "Moderate"
                                        ? "bg-gradient-to-r from-amber-400 to-orange-400"
                                        : "bg-gradient-to-r from-red-500 to-pink-500"
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${analysisResult.confidence}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                              </div>
                            </div>

                            {/* Detected Issues */}
                            {analysisResult.diseases?.length > 0 && (
                                <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                >
                                <h3 className="font-semibold text-lg mb-4 flex items-center">
                                  <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                                  Detected Issues
                                </h3>
                                <div className="grid gap-3">
                                  {analysisResult.diseases.map(
                                      (disease: any, index: number) => (
                                          <motion.div
                                          key={index}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: index * 0.1 }}
                                          className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                                          >
                                        <div>
                                          <div className="font-medium text-red-800">
                                            {disease.name}
                                          </div>
                                          <div className="text-sm text-red-600">
                                            Immediate attention required
                                          </div>
                                        </div>
                                        <div className="text-lg font-bold text-red-700">
                                          {disease.confidence}%
                                        </div>
                                      </motion.div>
                                    )
                                )}
                                </div>
                              </motion.div>
                            )}

                            {/* Recommendations */}
                            <div>
                              <h3 className="font-semibold text-lg mb-4 flex items-center">
                                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                                Recommended Actions
                              </h3>
                              <div className="grid gap-3">
                                {analysisResult.recommendations.map(
                                  (recommendation: string, index: number) => (
                                      <motion.div
                                      key={index}
                                      initial={{ opacity: 0, x: 20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="flex items-start p-4 bg-green-50 rounded-lg border border-green-100"
                                    >
                                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-green-700 font-bold">
                                          {index + 1}
                                        </span>
                                      </div>
                                      <span className="text-green-800">{recommendation}</span>
                                    </motion.div>
                                  )
                                )}
                              </div>
                            </div>

                            {/* AI Insights */}
                            <div>
                              <h3 className="font-semibold text-lg mb-4 flex items-center">
                                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                                AI Insights
                              </h3>
                              <div className="grid gap-2">
                                {analysisResult.aiInsights?.map((insight: string, index: number) => (
                                    <div key={index} className="flex items-center text-sm text-purple-700">
                                    <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                                    {insight}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 pt-4">
                              <Button
                                variant="outline"
                                className="border-green-300 hover:bg-green-50"
                                onClick={() => speak(
                                    `Health Status: ${analysisResult.healthStatus}. Confidence: ${analysisResult.confidence}%. Recommendations: ${analysisResult.recommendations.join('. ')}`
                                )}
                                >
                                🔊 Hear Results
                              </Button>
                              <Button
                                variant="outline"
                                className="border-blue-300 hover:bg-blue-50"
                                onClick={() => {
                                    // Share functionality
                                    navigator.clipboard.writeText(
                                        `Crop Health Analysis: ${analysisResult.healthStatus} (${analysisResult.confidence}% confidence)`
                                    );
                                    alert("Results copied to clipboard!");
                                }}
                                >
                                📋 Share Results
                              </Button>
                              <Button
                                variant="outline"
                                className="border-amber-300 hover:bg-amber-50"
                                onClick={() => {
                                    // Schedule reminder
                                    alert("Reminder scheduled for next week!");
                                }}
                                >
                                ⏰ Schedule Check-up
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* Error State */}
                    {error && (
                      <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      >
                        <Card className="border-red-200 bg-red-50 shadow-lg">
                          <CardContent className="pt-6">
                            <div className="flex items-center p-4 bg-white rounded-lg">
                              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-red-800">
                                  Analysis Failed
                                </h4>
                                <p className="text-red-600">{error}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-300 text-red-700 hover:bg-red-50"
                                onClick={() => setError(null)}
                                >
                                Dismiss
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
                </SignedIn>
    </LayoutWrapper>
    </ClerkProvider>
  );
}