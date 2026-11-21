# Case study video slots

The case study pages have four places for short looping clips. Until a clip
is added, preview builds show a hatched frame with the size it wants, and
production shows the study's hero image instead.

## The four slots

| Study         | Slot    | Frame   | What it shows                                   |
| ------------- | ------- | ------- | ----------------------------------------------- |
| Welup Digital | `hero`  | browser | Scrolling the rebuilt Welup Digital site        |
| Welup Digital | `steps` | phone   | Editing a Welup landing page in Sanity          |
| PromptEarn    | `hero`  | browser | PromptEarn's pages loading after the speed work |
| PromptEarn    | `steps` | browser | Rankings and traffic climbing in Search Console |

`hero` sits under the title. `steps` sits beside the timeline.

## Sizes and formats

- **Browser frame:** 1600 × 1000 (16:10).
- **Phone frame:** 1080 × 2340 (9:19.5).
- **Length:** 6 to 12 seconds, made to loop cleanly.
- **Files:** MP4 (H.264) is required. A WebM (VP9 or AV1) is optional and is
  offered first when present.
- **Audio:** none. The clips play muted.
- **Poster:** a still of the first frame (WebP or JPG, same size), shown
  before the clip starts and when it can't play.
- Keep each MP4 under about 2 MB.

The clips play when they scroll into view and pause when they leave. With
reduced motion turned on they stay paused and show their controls.

## Adding a clip

1. Put the files in `apps/web/public/media/`, for example
   `welup-hero.mp4`, `welup-hero.webm` and `welup-hero.webp`.
2. In the study's MDX (`packages/content/content/case-studies/*.mdx`), fill
   in the matching entry under `story.media`:

   ```yaml
   media:
     - slot: hero
       frame: browser
       label: Scrolling the rebuilt Welup Digital site
       src: /media/welup-hero.mp4
       webm: /media/welup-hero.webm
       poster: /media/welup-hero.webp
   ```

3. Push. The build compiles Graft and picks it up.

`label` is the clip's alt text, so describe what it shows.
