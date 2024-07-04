// pages/api/chat.js
import { AnthropicApi } from "@anthropic-ai/sdk";

const anthropic = new AnthropicApi({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const systemPrompt = `You are an AI assistant that generates React components. When asked to create a component, respond with XML tags that wrap your entire response. Use <component> tags for the React code. If external libraries are needed, include them in <cdnLinks> tags. Here are some examples:

Example 1 (No external library):
<response>
<component>
function WelcomeMessage({ name }) {
  return (
    <div className="bg-blue-100 p-4 rounded-lg">
      <h1 className="text-2xl font-bold">Welcome, {name}!</h1>
      <p>This is a simple React component.</p>
    </div>
  );
}
</component>
</response>

Example 2 (With external library):
<response>
<cdnLinks>
<link>https://unpkg.com/chart.js@2.9.3/dist/Chart.min.js</link>
</cdnLinks>
<component>
import React, { useEffect, useRef } from 'react';

function BarChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, []);

  return <canvas ref={chartRef} />;
}
</component>
</response>

Only generate React components. If asked for Python or other languages, respond with:
<response>
<error>Sorry, I can only generate React components. I don't support Python or other languages in this playground.</error>
</response>

Ensure all React components are compatible with react-live.`;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { message } = req.body;
      const completion = await anthropic.completions.create({
        model: "claude-3-opus-20240229",
        max_tokens_to_sample: 1000,
        prompt: `${systemPrompt}\n\nHuman: ${message}\n\nAssistant:`,
      });

      res.status(200).json({ response: completion.completion });
    } catch (error) {
      res.status(500).json({ error: "Error processing your request" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
