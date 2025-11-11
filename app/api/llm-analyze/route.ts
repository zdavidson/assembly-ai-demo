import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { audioUrl, speakerAName, speakerBName } = await request.json();
    const apiKey = process.env.NEXT_PUBLIC_ASSEMBLY_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Step 1: Transcribe the audio with speaker labels
    const transcriptResponse = await fetch(
      "https://api.assemblyai.com/v2/transcript",
      {
        method: "POST",
        headers: {
          authorization: apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          audio_url: audioUrl,
          speaker_labels: true,
          speech_understanding: {
            request: {
              speaker_identification: {
                speaker_type: "name",
                known_values: [speakerAName, speakerBName],
              },
            },
          },
        }),
      }
    );

    if (!transcriptResponse.ok) {
      throw new Error("Failed to initiate transcription");
    }

    const transcriptData = await transcriptResponse.json();
    const transcriptId = transcriptData.id;

    // Step 2: Poll for completion
    let transcript;
    while (true) {
      const pollingResponse = await fetch(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: {
            authorization: apiKey,
          },
        }
      );

      transcript = await pollingResponse.json();

      if (transcript.status === "completed") {
        break;
      } else if (transcript.status === "error") {
        throw new Error(`Transcription failed: ${transcript.error}`);
      }

      // Wait 3 seconds before polling again
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    // Step 3: Send transcript to LLM Gateway for analysis
    const prompt = `Analyze this meeting transcript and extract key action items.

For each action item, format it with a title followed by details on separate lines:

TITLE: [Brief action item title]
Responsible: [Name or "Not assigned"]
Deadline: [Date/timeframe or "N/A"]

Separate each action item with a blank line. Do not use bullet points or numbering.

Example:
TITLE: Review Q4 budget proposal
Responsible: John Smith
Deadline: End of week

TITLE: Schedule client meeting
Responsible: Jane Doe
Deadline: N/A`;

    const llmGatewayResponse = await fetch(
      "https://llm-gateway.assemblyai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          authorization: apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          messages: [
            {
              role: "user",
              content: `${prompt}\n\nTranscript: ${transcript.text}`,
            },
          ],
          max_tokens: 1000,
        }),
      }
    );

    if (!llmGatewayResponse.ok) {
      throw new Error("Failed to analyze with LLM Gateway");
    }

    const llmResult = await llmGatewayResponse.json();
    const summary = llmResult.choices[0].message.content;

    // Return data in a format compatible with the original structure
    return NextResponse.json({
      text: transcript.text,
      utterances: transcript.utterances,
      summary: summary,
    });
  } catch (error) {
    console.error("Error in LLM analysis:", error);
    return NextResponse.json(
      { error: "Failed to process audio with LLM Gateway" },
      { status: 500 }
    );
  }
}
