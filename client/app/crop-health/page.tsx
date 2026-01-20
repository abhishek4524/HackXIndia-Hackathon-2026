"use client";

import React, { useState, useCallback,useEffect } from "react";



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
} from "lucide-react";

export default function CropHealthPage() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN"; // You can also use 'hi-IN' for Hindi voice
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
};

  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    setError(null);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
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
      const base64Image = selectedImage.replace(/^data:image\/[a-z]+;base64,/, "");
      const apiUrl = process.env.NEXT_PUBLIC_PLANT_ID_API_URL;
      const apiKey = process.env.NEXT_PUBLIC_PLANT_ID_API_KEY;

      if (!apiUrl || !apiKey) {
        throw new Error("API configuration is missing. Please set NEXT_PUBLIC_PLANT_ID_API_URL and NEXT_PUBLIC_PLANT_ID_API_KEY in .env.local");
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
      console.log("Plant.id API Response:", data);

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
            recommendations.push("Apply neem oil or sulfur-based fungicide.");
          if (d.name.toLowerCase().includes("rust"))
            recommendations.push(
              "Use rust-resistant crop variety and improve air circulation."
            );
        });
        if (recommendations.length === 0)
          recommendations.push("Consult a local agricultural expert for advice.");
      } else {
        recommendations.push(
          "No major disease detected. Maintain regular watering and soil balance."
        );
      }

      setAnalysisResult({
        healthStatus,
        confidence,
        diseases,
        recommendations,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
  if (analysisResult) {
    let message = `Crop health analysis complete. 
      The crop condition is ${analysisResult.healthStatus}, 
      with ${analysisResult.confidence} percent confidence. `;

    if (analysisResult.diseases.length > 0) {
      message += `Detected issues are: ${analysisResult.diseases
        .map((d: any) => d.name)
        .join(", ")}. `;
    } else {
      message += `No diseases were detected. `;
    }

    message += `Recommendations: ${analysisResult.recommendations.join(", ")}.`;
    speak(message);
  }
}, [analysisResult]);

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <LayoutWrapper>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t("cropHealth.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("cropHealth.description")}
            </p>
          </div>

          {!selectedImage ? (
            <Card>
              <CardHeader>
                <CardTitle>{t("cropHealth.uploadTitle")}</CardTitle>
                <CardDescription>
                  {t("cropHealth.uploadDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="hidden"
                    id="image-input"
                  />
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  {isDragActive ? (
                    <p>{t("cropHealth.dropHere")}</p>
                  ) : (
                    <>
                      <p>{t("cropHealth.dragDrop")}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {t("cropHealth.supportedFormats")}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => document.getElementById("image-input")?.click()}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        {t("cropHealth.selectImage")}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle>{t("cropHealth.previewTitle")}</CardTitle>
                    <CardDescription>
                      {t("cropHealth.previewDescription")}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="icon" onClick={resetAnalysis}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <img
                        src={selectedImage}
                        alt="Uploaded crop"
                        className="max-h-64 rounded-lg object-contain"
                      />
                    </div>
                    <Button
                      onClick={analyzeCropHealth}
                      disabled={isAnalyzing}
                      className="w-full sm:w-auto"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("cropHealth.analyzing")}
                        </>
                      ) : (
                        <>
                          <Leaf className="mr-2 h-4 w-4" />
                          {t("cropHealth.analyzeButton")}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {analysisResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {analysisResult.healthStatus === "Healthy" ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                      )}
                      {t("cropHealth.resultsTitle")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">
                        {t("cropHealth.healthStatus")}
                      </h3>
                      <div className="flex items-center">
                        <div
                          className={`h-3 rounded-full ${
                            analysisResult.healthStatus === "Healthy"
                              ? "bg-green-500"
                              : analysisResult.healthStatus === "Moderate"
                              ? "bg-amber-500"
                              : "bg-red-500"
                          } w-24`}
                        />
                        <span className="ml-2">
                          {analysisResult.healthStatus} (
                          {analysisResult.confidence}% confidence)
                        </span>
                      </div>
                    </div>

                    {analysisResult.diseases &&
                      analysisResult.diseases.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">
                            {t("cropHealth.detectedIssues")}
                          </h3>
                          <ul className="space-y-2">
                            {analysisResult.diseases.map(
                              (disease: any, index: number) => (
                                <li key={index} className="flex justify-between">
                                  <span>{disease.name}</span>
                                  <span className="text-muted-foreground">
                                    {disease.confidence}%
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    <div>
                      <h3 className="font-medium mb-2">
                        {t("cropHealth.recommendations")}
                      </h3>
                      <ul className="space-y-2">
                        {analysisResult.recommendations.map(
                          (recommendation: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                              <span>{recommendation}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center text-red-700">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>{error}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}
