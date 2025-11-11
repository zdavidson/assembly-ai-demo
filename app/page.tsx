/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { AssemblyAI } from "assemblyai";
import styles from "./page.module.css";
import FileUpload from "../components/FileUpload";
import ActionItems from "../components/ActionItems";
import TranscriptSection from "../components/TranscriptSection";

const client = new AssemblyAI({
  apiKey: process.env.NEXT_PUBLIC_ASSEMBLY_AI_API_KEY!,
});

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptData, setTranscriptData] = useState<any>(null);
  const [speakerAName, setSpeakerAName] = useState("");
  const [speakerBName, setSpeakerBName] = useState("");
  const [useLlmGateway, setUseLlmGateway] = useState(false);

  const handleSubmit = async () => {
    if (!audioFile) return;

    setIsProcessing(true);

    try {
      // Upload file to AssemblyAI via our API route
      const formData = new FormData();
      formData.append("file", audioFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      const audioSource = data.uploadUrl;

      if (useLlmGateway) {
        // Use LLM Gateway for analysis
        const llmResponse = await fetch("/api/llm-analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audioUrl: audioSource,
            speakerAName,
            speakerBName,
          }),
        });

        if (!llmResponse.ok) {
          throw new Error("Failed to analyze with LLM Gateway");
        }

        const llmData = await llmResponse.json();
        setTranscriptData(llmData);
      } else {
        // Use original AssemblyAI summarization
        const transcript = await client.transcripts.transcribe({
          audio: audioSource,
          speaker_labels: true,
          speech_understanding: {
            request: {
              speaker_identification: {
                speaker_type: "name",
                known_values: [speakerAName, speakerBName],
              },
            },
          },
          summarization: true,
          summary_model: "conversational",
          summary_type: "bullets",
        });
        setTranscriptData(transcript);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Failed to process audio. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Meeting Action-Item Extractor</h1>
        <p className={styles.subtitle}>
          Transform your meeting recordings into actionable insights
        </p>
      </div>

      <div className={styles.main}>
        <FileUpload
          audioFile={audioFile}
          onFileChange={setAudioFile}
          isProcessing={isProcessing}
          onSubmit={handleSubmit}
          speakerAName={speakerAName}
          speakerBName={speakerBName}
          onSpeakerANameChange={setSpeakerAName}
          onSpeakerBNameChange={setSpeakerBName}
          useLlmGateway={useLlmGateway}
          onUseLlmGatewayChange={setUseLlmGateway}
        />

        {transcriptData && (
          <div className={styles.results}>
            <ActionItems summary={transcriptData.summary} />
            <TranscriptSection transcript={transcriptData.utterances} />
          </div>
        )}
      </div>
    </div>
  );
}
