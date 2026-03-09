import Link from 'next/link';

export default function GridAbout() {
  return (
    <main className="min-h-screen p-12" style={{ backgroundColor: '#f7f4ef' }}>
      <div className="max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-black" style={{ fontFamily: 'monospace' }}>
            ← Back to Home
          </Link>
        </div>

        <div style={{ backgroundColor: '#f7f4ef' }}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-black" style={{ fontFamily: 'monospace' }}>
              The Grid
            </h1>
            <p className="text-sm text-gray-500 italic" style={{ fontFamily: 'monospace' }}>
              A Collective Neural Memory Map
            </p>
          </div>

          <div className="space-y-6 text-gray-800 leading-relaxed" style={{ fontFamily: 'monospace' }}>
            <div className="space-y-3 text-sm">
              <p>
                The Grid aggregates the neural activity patterns captured during generation and turns them into a collective map of the system's behavior over time. Every story produced through Garden of Life ends with a final neural activity pattern. This pattern represents the spike activity detected across the electrode array during the final token selection that completed the generation.
              </p>
              
              <p>
                Rather than treating these patterns as isolated events, The Grid combines them into a shared map. Each electrode position tracks how frequently spike activity has appeared there across all generated outputs. Over time this creates a visual record of how the biological neural system has responded to language generation events.
              </p>
              
              <p>
                Each circle on <Link href="/grid" className="text-black underline hover:text-gray-600 font-bold">the grid</Link> represents an electrode position on the CL1 array. The number inside the circle identifies the electrode, while the number below it shows how many times that electrode has appeared in a final neural activity pattern. The color intensity reflects frequency as well. Electrodes that appear more often become darker, revealing areas of the neural culture that are more consistently involved during generation.
              </p>
              
              <p>
                Because every story ends with a slightly different neural response pattern, the grid slowly evolves as more generations occur. Some electrodes become more dominant, while others appear only occasionally. This produces a distribution of activity that reflects how the biological neural network has reacted across many prompts and outputs.
              </p>
              
              <p>
                The purpose of this view is to make the neural activity observable at a higher level. While the <Link href="/visualizer" className="text-black underline hover:text-gray-600 font-bold">visualizer</Link> shows the moment-by-moment decision process during generation, The Grid shows the cumulative footprint left by those decisions. Instead of focusing on a single token selection, it reveals how neural responses accumulate across many generations.
              </p>
              
              <p>
                Recent patterns displayed below the grid show the final electrode activation patterns from the most recent generations. These patterns provide a snapshot of the neural state associated with each completed output before it is merged into the larger map.
              </p>
              
              <p>
                Over time The Grid becomes a collective record of neural responses produced during language generation. Each new story contributes another pattern to the system, gradually expanding the map of how the biological neural network reacts when interacting with the language model.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
