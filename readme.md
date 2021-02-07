## Terminal canvas

A node.js script to (inefficiently) render video to the terminal. Part of an ongoing project.  

*WARNING: THIS CODE IS DEPRECATED, UNMAINTAINED, AND WILL BE REPLACED IN THE FUTURE. IT IS FUNCTIONAL, BUT RUNS EXTREMELY INEFFICIENT.*

*NOTE: This code has limitations. FPS rates tend to quirk around and not work, and input files need to be in the /in directory. Audio is also currently not supported.*

### Installation

- Clone repository
- Run `npm install`
- Make sure `ffmpeg` is installed and in your path.

### Usage

`node index.js <filename> <...args>`
(Files work best when in mp4 format.)

### CLI Args

`-q <number>` (default 1) - How high quality the rendering should be. Caution: This factor multiplies the resolution and then downscales the result. Use with caution.  
`-t <number>` (default 2) - How many threads to use to prerender frames. Caution: Large numbers of threads consume _a lot_ of resources. Also note numbers below 2 won't work properly.  
`-heap <number>` (default 1000) - How many frames are pushed to the buffer by each thread. Caution: This may cause many problems, _THIS IS RECOMMENDED TO NOT BE USED._  
`-nogi true` Disables the video output, only logging debug frame counts.