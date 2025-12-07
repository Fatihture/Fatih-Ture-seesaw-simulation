Seesaw Simulation Logic:
This is a pure JavaScript simulation of a playground seesaw, built as a hiring case for Insider. The goal was to create a physics-based interactive UI without relying on any external libraries like React, jQuery, or Canvas.

Live Demo: https://fatihture.github.io/Fatih-Ture-seesaw-simulation/


Seesaw Simulation:

I focused on keeping the code clean, modular, and performance-friendly. Here is what I implemented:

Torque Physics: The seesaw tilts based on real physics logic (Weight * Distance). It balances itself automatically as you add more objects.

Pure DOM Manipulation: No Canvas was used. Everything you see is a standard HTML element styled with CSS.

Visual Feedback:
Ghost Ball: A visual indicator that follows your mouse so you know exactly where the weight will drop.
Animations: Objects don't just appear; they drop from the sky and bounce a little when they hit the plank.

State Persistence: If you refresh the page, you won't lose your progress. The state is saved in localStorage.

Audio Effects: I used the Web Audio API to generate procedural sound effects based on the weight of the object (heavier objects sound deeper).

My Thought Process:

1. Why Pure JS and DOM?
The requirement was "Pure JS," so I avoided frameworks. I had two choices for rendering: HTML5 Canvas or DOM elements. I chose DOM elements because:

It's more accessible and easier to debug via DevTools.

CSS transitions (like the plank rotation) are much smoother and easier to handle than redrawing a Canvas 60 times a second manually.

The number of objects is relatively small, so there are no performance issues.

2. The Physics Logic:
I didn't implement a full-blown physics engine (like Matter.js) because it would be overkill. instead, I wrote a simple "Torque Calculator":

I calculate the torque for the left and right sides separately.

The difference determines the angle.

I clamped the angle between -30 and 30 degrees to keep it visually realistic.

Trade-offs & Limitations:

Responsiveness: The prompt required a fixed-length plank (e.g., 500px). Because of this, the simulation is optimized for desktop views. On very small mobile screens, the plank might overflow.

Coordinate System: I used offsetX for positioning. It works great, but if the plank is tilting at a very steep angle, the click detection requires careful calculation. I handled this by calculating the distance from the center, regardless of the visual rotation.

AI Usage Declaration
To be transparent, I used AI tools (ChatGPT) during development for:

CSS Animations: Generating the @keyframes for the "drop and bounce" effect to make it look natural.

Syntax Check: verifying the Web Audio API syntax since I don't write audio code often.

Refactoring: Cleaning up the drawBall function to make it more readable.

The core logic, state management, and architectural decisions are my own.

How to Run:

Since there are no dependencies or build steps (npm, webpack, etc.), it's super simple:
Clone the repo and open index.html in your browser.