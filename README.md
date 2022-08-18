# bike-vis

Inspired by https://github.com/technologiestiftung/bikesharing-vis


## Export video

 * requestanimationframe
   * https://riptutorial.com/html5-canvas/example/16985/use-requestanimationframe---not-setinterval---for-animation-loops
   * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
   

 * hubble.gl
   * https://hubble.gl/examples/nyc-trips/

 * media recorder
   * https://julien-decharentenay.medium.com/how-to-save-html-canvas-animation-as-a-video-421157c2203b

 * let image = canvas.toDataURL('image/jpeg');

 
Videos can be incomplete, fix by:

> ffmpeg -err_detect ignore_err -i video-app4.webm -c copy v.webm

[Example](https://cloud.ok-lab-karlsruhe.de/index.php/s/GYQ7ST8Fo43Gaor)


