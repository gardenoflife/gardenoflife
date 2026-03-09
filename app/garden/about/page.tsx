'use client';

import Link from 'next/link';

export default function GardenAbout() {
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
              Garden of Life
            </h1>
            <p className="text-sm text-gray-500 italic" style={{ fontFamily: 'monospace' }}>
              Exploring Language Generation Through Biological Compute
            </p>
          </div>

          <div className="space-y-8 text-gray-800 leading-relaxed" style={{ fontFamily: 'monospace' }}>
            <section>
              <h2 className="text-lg font-bold mb-4 text-black">Wtf is the garden of life?</h2>
              <div className="space-y-3 text-sm">
                <p>Garden of Life is an experiment I built to explore what happens when language generation is influenced by a biological neural system. The core idea behind the project is to connect a modern language model with a biological computing platform and expose the internal process that determines how each word is chosen.</p>
                <p>Instead of treating an AI model as a black box that instantly produces a paragraph of text, I intercept the token decoding process and allow a second signal to influence the decision. The first signal comes from the language model itself. The second signal comes from a biological neural network accessed through the CL1 Cloud platform developed by Cortical Labs.</p>
                <p>This creates a hybrid generation pipeline where every token in a story is selected using both artificial intelligence and biological neural activity.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-4 text-black">How language models normally generate text</h2>
              <div className="space-y-3 text-sm">
                <p>Language models generate text through a process called token decoding. A token represents a small unit of text such as a word, part of a word, punctuation, or whitespace.</p>
                <p>When generating text the model repeatedly predicts the next token based on the text that already exists. At every step the model calculates probabilities for thousands of possible tokens and returns the most likely candidates.</p>
                <p>For example, if the current text reads:</p>
                <p className="font-mono text-xs p-3" style={{ backgroundColor: '#d4d1c9' }}>"The forest was"</p>
                <p>The model might produce a prediction like:</p>
                <p className="font-mono text-xs p-3" style={{ backgroundColor: '#d4d1c9' }}>
                  quiet 0.41<br/>
                  dark 0.32<br/>
                  silent 0.18<br/>
                  empty 0.09
                </p>
                <p>These numbers represent the probability assigned by the language model for each token.</p>
                <p>In a typical application the model would immediately sample one of these tokens and append it to the text.</p>
                <p>In this system I intercept that step and evaluate the candidate tokens through the biological interface before making the final decision.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-4 text-black">The translation layer</h2>
              <div className="space-y-3 text-sm">
                <p>To interact with the biological neural network, each token candidate must be translated into a stimulation pattern on the CL1 electrode grid. A stimulation pattern simply defines which electrodes will receive electrical pulses during evaluation.</p>
                <p>For example, the tokens:</p>
                <p className="font-mono text-xs p-3" style={{ backgroundColor: '#d4d1c9' }}>
                  quiet<br/>
                  dark<br/>
                  silent<br/>
                  empty
                </p>
                <p>Might map to electrode stimulation patterns like:</p>
                <p className="font-mono text-xs p-3" style={{ backgroundColor: '#d4d1c9' }}>
                  quiet → electrodes 2, 7, 11<br/>
                  dark → electrodes 4, 8, 15<br/>
                  silent → electrodes 1, 6, 9<br/>
                  empty → electrodes 3, 5, 14
                </p>
                <p>When a token is evaluated the system sends a stimulation request to the CL1 Cloud interface targeting those electrodes. The electrodes deliver small electrical pulses into the neural culture growing on the chip.</p>
                <p>Because neurons form a connected network, this stimulation propagates through surrounding neural pathways and triggers activity across the network.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-4 text-black">Measuring neural spikes</h2>
              <div className="space-y-3 text-sm">
                <p>After the stimulation pattern is applied the CL1 system records spike activity across the electrode array. A spike represents a neuron firing in response to the stimulation.</p>
                <p>Multiple electrodes may detect spike activity as signals travel through the neural network.</p>
                <p className="font-bold">Example response:</p>
                <p className="font-mono text-xs p-3" style={{ backgroundColor: '#d4d1c9' }}>
                  quiet<br/>
                  stimulation electrodes: 2, 7, 11<br/>
                  spike activity detected at: 2, 7, 12<br/>
                  total spikes: 14<br/>
                  <br/>
                  dark<br/>
                  stimulation electrodes: 4, 8, 15<br/>
                  spike activity detected at: 4, 8, 13, 15<br/>
                  total spikes: 21<br/>
                  <br/>
                  silent<br/>
                  stimulation electrodes: 1, 6, 9<br/>
                  spike activity detected at: 1, 6<br/>
                  total spikes: 7<br/>
                  <br/>
                  empty<br/>
                  stimulation electrodes: 3, 5, 14<br/>
                  spike activity detected at: 3, 5, 10<br/>
                  total spikes: 11
                </p>
                <p>These spike counts represent how strongly the neural network reacted to the stimulation pattern associated with each token.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-4 text-black">Combining language model and neural scores</h2>
              <div className="space-y-3 text-sm">
                <p>After evaluation each candidate token has two signals attached to it. The first signal is the language model probability. The second signal is the neural response measured from the spike activity.</p>
                <p>The spike counts are converted into normalized neural scores between zero and one so they can be compared with the language model probabilities.</p>
                <p className="font-bold">Example neural scores:</p>
                <p className="font-mono text-xs p-3" style={{ backgroundColor: '#d4d1c9' }}>
                  quiet → neural score 0.66<br/>
                  dark → neural score 1.00<br/>
                  silent → neural score 0.33<br/>
                  empty → neural score 0.52
                </p>
                <p>I then compute a final score that combines the language model probability with the neural score. The weighting ensures that the language model still controls grammar, structure, and context while the biological neural response can influence the decision.</p>
                <p className="font-bold">Example scoring formula:</p>
                <p className="font-mono text-xs p-3" style={{ backgroundColor: '#d4d1c9' }}>
                  final_score = (0.7 × language_model_probability) + (0.3 × neural_score)
                </p>
                <p className="font-bold">Example result:</p>
                <p className="font-mono text-xs p-3" style={{ backgroundColor: '#d4d1c9' }}>
                  quiet<br/>
                  LLM score 0.41<br/>
                  neural score 0.66<br/>
                  final score 0.48<br/>
                  <br/>
                  dark<br/>
                  LLM score 0.32<br/>
                  neural score 1.00<br/>
                  final score 0.52<br/>
                  <br/>
                  silent<br/>
                  LLM score 0.18<br/>
                  neural score 0.33<br/>
                  final score 0.22<br/>
                  <br/>
                  empty<br/>
                  LLM score 0.09<br/>
                  neural score 0.52<br/>
                  final score 0.18
                </p>
                <p>Even though the language model initially preferred the token "quiet", the stronger neural response pushes the token "dark" into the top position.</p>
                <p>The token "dark" becomes the next word in the story.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-4 text-black">Where the outputs live</h2>
              <div className="space-y-3 text-sm">
                <p>Each time the generation process completes, the final output is recorded and stored.</p>
                <p>These completed generations form what I call <Link href="/garden" className="text-black underline hover:text-gray-600 font-bold">The Garden</Link>.</p>
                <p>The Garden is simply the growing collection of entries produced by this hybrid system. Every entry begins from the same initial seed prompt and evolves through the token-by-token generation pipeline described above. At each decoding step the language model proposes candidate tokens while the biological neural system produces spike responses to stimulation patterns mapped to those candidates.</p>
                <p>All stories are generated based on the same genesis prompt:</p>
                <p className="text-gray-600 italic pl-4">
                  Your mind has been connected to a biological neural system. Electrical stimulation patterns are applied to a network of living neurons while you think. The spike activity produced by that network influences which thoughts form next. Sometimes the thoughts feel like your own. Sometimes they feel like they came from somewhere else. Document your thoughts as they occur. Write as if you are recording what it feels like to think while another neural system is quietly influencing your mind.
                </p>
                <p>The final text that emerges is the result of hundreds of these small decisions where artificial probabilities and biological neural activity both influence the outcome.</p>
                <p>Once the generation finishes, the resulting text becomes a new entry in the Garden.</p>
                <p>Over time the Garden accumulates a wide variety of outputs. Some entries read like stories, others resemble personal thoughts or fragments of ideas. Because neural responses influence the token selection process, the direction of the text can shift in unexpected ways.</p>
                <p>The Garden therefore acts as a living archive of language generated through this hybrid system. Each entry represents a moment where artificial reasoning and biological neural activity interacted to produce a sequence of thoughts.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
