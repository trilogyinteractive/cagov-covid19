# video component
This component provides functionality for viewing YouTube videos in a modal window.

## YouTube API
The API is loaded in the `initYouTube()` function. This is called the first time a user requests a video,
so the API will never load for users who do not click on the videos. This function sends the user to `waitForYouTube()`,
putting them into a loop until the API is loaded, then finally sends them to `play()`, which begins to load the video.

## Modal controls
Elements with a `video-modal-open` class will open the modal, and elements with `video-modal-close` will close the modal.
There is only one modal on the page, and the video component will add a new `<div>` for each video the user requests to play.
Only the `<div>` for the currently playing video is visible when the modal is open.

## Sample Markup
The modal markup should go as close to the `</body>` tag as possible.
````html
<div id="video-modal" class="video-modal">
  <button class="video-modal-close">Close</button>
  <div id="video-container">Videos appear here</div>
</div>
````

Any element with a `video-modal-open` class will act as an opener. It also needs a `[data-video]` attribute with the ID
of the YouTube video to load.
````html
<article class="video-modal-open" data-video="aWmw_cLiuOk">
  Thumbnail goes here
</article>
````
