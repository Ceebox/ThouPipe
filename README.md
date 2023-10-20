## ThouPipe
You may ask, *"What on Earth is this?"*. That is a very good question. And it's got a very, very clear answer. I've got no idea.

You might find a use for it; I am using it for presenting `.mp4` video like it is a PowerPoint Presentation (kinda). I needed to be able to embed it in a website - and so this hacky mess was born.

I hope someone else one day has a use for this, but for now it is just going to live here.

**Here's how to run the program:**

 - Compile the program using `tsc`.
 - Host the .js files (I am using VSCode Live Server).
 - Open the `index.html` file.
 - Bang!

**Some more information:**

When you open the `index.html` or embed the build JavaScript into a website, it will create a small file input. You can add your video file to this, but also a .JSON file. This JSON file can contain times where the video will automatically pause, so you can present and then resume when you are done.

**Keybinds:**

 - Enter: Play/Pause.
 - Left Arrow: Skip backwards by 1 second.
 - Right Arrow: Skip forwards by 1 second.
 - M: Toggle muting.
 - T: Add a pause point at the current time.
 - D: Download an updated JSON containing all the pause information.